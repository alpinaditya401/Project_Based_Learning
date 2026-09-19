#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <ESP32Servo.h>
#include <Preferences.h>
#include <esp_task_wdt.h>
#include <esp_random.h>
#include <ctype.h>
#include <math.h>
#include <time.h>
#include "config.local.h"

static_assert(MAX_FEED_SECONDS >= 1 && MAX_FEED_SECONDS <= 30, "Unsafe feeder duration");
static_assert(RELAY_MAX_ON_SECONDS >= 1 && RELAY_MAX_ON_SECONDS <= 30, "Unsafe relay lease");
static_assert(SERVO_CLOSED_DEGREES >= 0 && SERVO_CLOSED_DEGREES <= 180, "Invalid closed angle");
static_assert(SERVO_OPEN_DEGREES >= 0 && SERVO_OPEN_DEGREES <= 180, "Invalid open angle");

OneWire oneWire(PIN_TEMPERATURE);
DallasTemperature thermometer(&oneWire);
Servo feeder;
Preferences journal;
String sessionId, currentId, terminalStatus, pendingTelemetry;
bool configured = false, storageReady = false, connectedBefore = false;
bool feeding = false, relayOn = false, waitingTemperature = false;
uint32_t feedDeadline = 0, relayDeadline = 0, conversionAt = 0;
uint32_t nextNetwork = 0, nextTelemetry = 0, nextAdc = 0, nextWifi = 0, offlineAt = 0;
uint32_t failures = 0;
float temperature = NAN;
int adcIndex = 0, raw[2][9] = {}, millivolts[2][9] = {};
int filteredRaw[2] = {}, filteredMv[2] = {};
bool adcReady = false;

bool due(uint32_t now, uint32_t deadline) { return int32_t(now - deadline) >= 0; }
bool relayEnabled() { return ENABLE_RELAY && RELAY_3V3_COMPATIBLE_CONFIRMED; }
uint32_t retryInterval() {
  unsigned exponent = failures < 6 ? failures++ : 6;
  uint32_t interval = 1000UL << exponent;
  return (interval > 60000 ? 60000 : interval) + esp_random() % 1000;
}

void safeOutputs() {
  if (ENABLE_FEEDER && feeder.attached()) feeder.write(SERVO_CLOSED_DEGREES);
  if (relayEnabled()) digitalWrite(PIN_RELAY, RELAY_ACTIVE_LOW ? HIGH : LOW);
  feeding = false;
  relayOn = false;
}

bool persistTerminal(const String &status) {
  // One NVS value is the recovery record. A reset during actuation recovers as failed.
  if (!storageReady || journal.putString("pending", currentId + "|" + status) == 0) {
    safeOutputs(); configured = false; return false;
  }
  terminalStatus = status;
  return true;
}

int median(int *values) {
  int sorted[9]; memcpy(sorted, values, sizeof(sorted));
  for (int i = 1; i < 9; ++i) {
    int value = sorted[i], j = i;
    while (j > 0 && sorted[j - 1] > value) { sorted[j] = sorted[j - 1]; --j; }
    sorted[j] = value;
  }
  return sorted[4];
}

void sampleSensors(uint32_t now) {
  if (due(now, nextAdc)) {
    nextAdc = now + 20;
    const int pins[] = {PIN_TURBIDITY, PIN_SOIL_PH};
    const bool enabled[] = {TURBIDITY_VOLTAGE_CONFIRMED, SOIL_PH_VOLTAGE_CONFIRMED};
    for (int i = 0; i < 2; ++i) if (enabled[i]) {
      raw[i][adcIndex] = analogRead(pins[i]);
      millivolts[i][adcIndex] = analogReadMilliVolts(pins[i]);
    }
    if (++adcIndex == 9) {
      adcIndex = 0; adcReady = true;
      for (int i = 0; i < 2; ++i) { filteredRaw[i] = median(raw[i]); filteredMv[i] = median(millivolts[i]); }
    }
  }
  if (DS18B20_WIRING_CONFIRMED) {
    if (!waitingTemperature) {
      thermometer.requestTemperatures(); conversionAt = now; waitingTemperature = true;
    } else if (now - conversionAt >= 800) {
      float value = thermometer.getTempCByIndex(0);
      temperature = value >= -55 && value <= 125 ? value : NAN;
      waitingTemperature = false;
    }
  }
}

bool privateHttp() {
  String base(API_BASE);
  if (!ALLOW_PRIVATE_LAN_HTTP || !base.startsWith("http://")) return false;
  String host = base.substring(7); int colon = host.indexOf(':');
  if (colon >= 0) host = host.substring(0, colon);
  IPAddress ip;
  if (!ip.fromString(host)) return false;
  return ip[0] == 10 || (ip[0] == 172 && ip[1] >= 16 && ip[1] <= 31) || (ip[0] == 192 && ip[1] == 168);
}

int requestApi(const String &path, const String &payload, String &response) {
  WiFiClient plain;
  WiFiClientSecure secure;
  HTTPClient http;
  String base(API_BASE);
  if (base.startsWith("https://")) {
    if (DEVELOPMENT_INSECURE_TLS) secure.setInsecure();
    else secure.setCACert(ROOT_CA);
    secure.setHandshakeTimeout(3);
    if (!http.begin(secure, base + path)) return -1;
  } else {
    if (!privateHttp() || !http.begin(plain, base + path)) return -1;
  }
  http.setConnectTimeout(2000); http.setTimeout(2000);
  http.setFollowRedirects(HTTPC_DISABLE_FOLLOW_REDIRECTS);
  http.useHTTP10(true);
  http.addHeader("X-Device-Key", DEVICE_KEY);
  http.addHeader("Content-Type", "application/json");
  int status = payload.length() ? http.POST(payload) : http.GET();
  response = "";
  if (status > 0) {
    auto stream = http.getStreamPtr(); uint32_t began = millis();
    while ((http.connected() || stream->available()) && millis() - began < 2000) {
      while (stream->available()) {
        if (response.length() >= 8192) { http.end(); return -2; }
        response += char(stream->read());
      }
      delay(1);
    }
  }
  http.end(); return status;
}

void buildTelemetry() {
  JsonDocument body;
  time_t utc = time(nullptr); char timestamp[24]; struct tm tmUtc;
  gmtime_r(&utc, &tmUtc); strftime(timestamp, sizeof(timestamp), "%Y-%m-%dT%H:%M:%SZ", &tmUtc);
  body["device_id"] = DEVICE_ID; body["created_at"] = timestamp;
  body["provenance"] = "device"; body["simulation"] = false; body["source_session"] = sessionId;
  body["temperature"] = nullptr;
  body["temperature_status"] = DS18B20_WIRING_CONFIRMED ? "disconnected" : "unverified";
  if (isfinite(temperature)) { body["temperature"] = temperature; body["temperature_status"] = "ok"; }
  const char *prefixes[] = {"turbidity", "soil_ph"};
  const bool enabled[] = {TURBIDITY_VOLTAGE_CONFIRMED, SOIL_PH_VOLTAGE_CONFIRMED};
  for (int i = 0; i < 2; ++i) {
    body[String(prefixes[i]) + "_adc"] = nullptr; body[String(prefixes[i]) + "_mv"] = nullptr;
    if (enabled[i] && adcReady && filteredMv[i] <= 3300) {
      body[String(prefixes[i]) + "_adc"] = filteredRaw[i];
      body[String(prefixes[i]) + "_mv"] = filteredMv[i];
    }
  }
  body["turbidity_sensor_mv"] = nullptr; body["turbidity_mapping_percent"] = nullptr;
  if (!body["turbidity_mv"].isNull()) {
    float sensorMv = filteredMv[0] / 0.6f;
    body["turbidity_sensor_mv"] = sensorMv;
    body["turbidity_mapping_percent"] = constrain(100.0f * (1.0f - sensorMv / 5000.0f), 0.0f, 100.0f);
  }
  body["ph_sensor"] = "soil_placeholder"; body["calibrated"] = false;
  pendingTelemetry = ""; serializeJson(body, pendingTelemetry);
}

bool validId(const String &id) {
  if (id.length() != 32) return false;
  for (unsigned i = 0; i < id.length(); ++i) if (!isxdigit(id[i]) || isupper(id[i])) return false;
  return true;
}

void acceptCommand(JsonObject command) {
  String id = command["id"] | "";
  if (!validId(id) || String(command["device_id"] | "") != DEVICE_ID) return;
  if (!command["simulation"].is<bool>() || command["simulation"].as<bool>()) return;
  if (!command["expires_at"].is<long>() || !command["duration"].is<int>() || !command["value"].is<bool>()) return;
  // The server never reopens terminal IDs. Retain a bounded journal as extra replay protection.
  for (int i = 0; i < 8; ++i) {
    String slot = "seen" + String(i);
    if (journal.getString(slot.c_str(), "") == id) return;
  }
  currentId = id;
  if (!persistTerminal("failed")) return;
  unsigned slot = journal.getUInt("slot", 0) % 8;
  String key = "seen" + String(slot);
  if (!journal.putString(key.c_str(), id) || !journal.putUInt("slot", (slot + 1) % 8)) {
    safeOutputs(); configured = false; return;
  }
  long expires = command["expires_at"].as<long>();
  int duration = command["duration"].as<int>(); bool value = command["value"].as<bool>();
  String actuator = command["actuator"] | "";
  if (expires <= time(nullptr)) { persistTerminal("timeout"); return; }
  if (actuator == "feeder" && ENABLE_FEEDER && duration >= 1 && duration <= int(MAX_FEED_SECONDS)) {
    if (!value) { safeOutputs(); persistTerminal("succeeded"); return; }
    if (expires - time(nullptr) < duration + 2) { persistTerminal("timeout"); return; }
    feeder.write(SERVO_OPEN_DEGREES); feeding = true;
    feedDeadline = millis() + duration * 1000UL; terminalStatus = "";
  } else if (actuator == "aerator" && relayEnabled() && duration == 0) {
    digitalWrite(PIN_RELAY, value == RELAY_ACTIVE_LOW ? LOW : HIGH);
    relayOn = value; relayDeadline = millis() + RELAY_MAX_ON_SECONDS * 1000UL;
    persistTerminal("succeeded");
  }
  // Disabled/unsupported commands retain the prewritten failed result.
}

void setup() {
  Serial.begin(115200);
  if (relayEnabled()) {
    digitalWrite(PIN_RELAY, RELAY_ACTIVE_LOW ? HIGH : LOW); pinMode(PIN_RELAY, OUTPUT);
  }
  if (ENABLE_FEEDER) { feeder.setPeriodHertz(50); feeder.attach(PIN_SERVO, 500, 2400); }
  safeOutputs();
  esp_task_wdt_config_t watchdog = {.timeout_ms = 15000, .idle_core_mask = 0, .trigger_panic = true};
  esp_task_wdt_init(&watchdog); esp_task_wdt_add(nullptr);
  storageReady = journal.begin("aquasmart", false);
  String recovery = journal.getString("pending", ""); int delimiter = recovery.indexOf('|');
  if (delimiter == 32) { currentId = recovery.substring(0, delimiter); terminalStatus = recovery.substring(delimiter + 1); }
  configured = storageReady && String(WIFI_SSID) != "GANTI_SEBELUM_UPLOAD"
    && String(WIFI_PASSWORD) != "GANTI_SEBELUM_UPLOAD" && String(DEVICE_KEY) != "GANTI_SEBELUM_UPLOAD"
    && String(DEVICE_ID) != "GANTI_SEBELUM_UPLOAD" && String(API_BASE).indexOf("GANTI_SEBELUM_UPLOAD") < 0;
  if (String(API_BASE).startsWith("https://") && !DEVELOPMENT_INSECURE_TLS && String(ROOT_CA).indexOf("BEGIN CERTIFICATE") < 0) configured = false;
  if (DEVELOPMENT_INSECURE_TLS) Serial.println("WARNING: TLS identity verification DISABLED. Development only; no security evidence.");
  analogReadResolution(12);
  if (TURBIDITY_VOLTAGE_CONFIRMED) analogSetPinAttenuation(PIN_TURBIDITY, ADC_11db);
  if (SOIL_PH_VOLTAGE_CONFIRMED) analogSetPinAttenuation(PIN_SOIL_PH, ADC_11db);
  if (DS18B20_WIRING_CONFIRMED) { thermometer.begin(); thermometer.setResolution(12); thermometer.setWaitForConversion(false); }
  sessionId = "esp32-" + String(uint32_t(ESP.getEfuseMac()), HEX) + "-" + String(esp_random(), HEX);
  WiFi.mode(WIFI_STA); WiFi.setAutoReconnect(false);
  offlineAt = millis();
  Serial.println(configured ? "Configuration loaded; outputs safe." : "Configuration/storage incomplete; outputs disabled.");
}

void loop() {
  esp_task_wdt_reset(); uint32_t now = millis();
  if (!configured) { safeOutputs(); delay(10); return; }
  if (feeding && due(now, feedDeadline)) { safeOutputs(); persistTerminal("succeeded"); }
  if (relayOn && due(now, relayDeadline)) safeOutputs();
  sampleSensors(now);
  bool connected = WiFi.status() == WL_CONNECTED;
  if (!connected) {
    if (connectedBefore) {
      bool interrupted = feeding; safeOutputs(); if (interrupted) persistTerminal("failed");
      offlineAt = now; connectedBefore = false;
    }
    if (due(now, nextWifi)) {
      WiFi.disconnect(); WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
      nextWifi = now + retryInterval();
    }
    if (now - offlineAt > 300000UL) { safeOutputs(); ESP.restart(); }
    delay(1); return;
  }
  if (!connectedBefore) {
    safeOutputs(); connectedBefore = true; failures = 0;
    configTime(0, 0, NTP_SERVER); nextNetwork = now;
  }
  // No fabricated epoch timestamps and no commands before NTP synchronization.
  if (time(nullptr) < 1704067200 || feeding || !due(now, nextNetwork)) { delay(1); return; }
  String response; int status;
  String devicePath = "/api/device/devices/" + String(DEVICE_ID) + "/commands";
  if (currentId.length() && terminalStatus.length()) {
    JsonDocument body; body["status"] = terminalStatus; String payload; serializeJson(body, payload);
    status = requestApi(devicePath + "/" + currentId + "/ack", payload, response);
    // 409 is terminal/expired according to this server contract; never actuate again.
    if (status == 200 || status == 409) {
      if (!journal.remove("pending")) { configured = false; safeOutputs(); return; }
      currentId = ""; terminalStatus = "";
    }
  } else if (pendingTelemetry.length() || due(now, nextTelemetry)) {
    if (!pendingTelemetry.length()) buildTelemetry();
    status = requestApi("/api/devices/" + String(DEVICE_ID) + "/telemetry", pendingTelemetry, response);
    if (status == 201 || status == 409 || status == 422) { pendingTelemetry = ""; nextTelemetry = millis() + 10000; }
  } else {
    status = requestApi(devicePath, "", response);
    if (status == 200) {
      JsonDocument body;
      if (!deserializeJson(body, response) && body["commands"].is<JsonArray>()) {
        for (JsonObject command : body["commands"].as<JsonArray>()) {
          acceptCommand(command); if (currentId.length()) break;
        }
      } else status = -3;
    }
  }
  if (status >= 200 && status < 300) { failures = 0; nextNetwork = millis() + 2000; }
  else { nextNetwork = millis() + retryInterval(); }
  delay(1);
}
