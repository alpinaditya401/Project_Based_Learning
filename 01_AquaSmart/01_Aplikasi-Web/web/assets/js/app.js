(() => {
  'use strict';

  const APP_KEY = 'aquasmart-prototype-v1';
  const SESSION_KEY = 'aquasmart-session';
  const app = document.getElementById('app');
  const modalRoot = document.getElementById('modal-root');
  const toastRegion = document.getElementById('toast-region');

  const icons = {
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    droplet: '<path d="M12 3s6 6.2 6 11a6 6 0 0 1-12 0c0-4.8 6-11 6-11Z"/><path d="M9 15.5c.6 1 1.6 1.5 3 1.5"/>',
    thermometer: '<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0Z"/><path d="M12 9v7"/>',
    waves: '<path d="M3 7c2 0 2 1 4 1s2-1 4-1 2 1 4 1 2-1 4-1 2 1 4 1M3 12c2 0 2 1 4 1s2-1 4-1 2 1 4 1 2-1 4-1 2 1 4 1M3 17c2 0 2 1 4 1s2-1 4-1 2 1 4 1 2-1 4-1 2 1 4 1"/>',
    wifi: '<path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 20h.01M2 9a14 14 0 0 1 20 0"/>',
    gauge: '<path d="M4.9 19a9 9 0 1 1 14.2 0"/><path d="m12 13 4-4M8 19h8"/>',
    power: '<path d="M12 3v9M7.4 5.8a8 8 0 1 0 9.2 0"/>',
    wind: '<path d="M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h7"/>',
    feeder: '<path d="M7 4h10l-1 8H8L7 4Z"/><path d="M9 12v3h6v-3M10 19h.01M14 19h.01"/>',
    robot: '<rect x="5" y="7" width="14" height="12" rx="3"/><path d="M9 11h.01M15 11h.01M9 15h6M12 7V4M10 4h4"/>',
    bulb: '<path d="M9 18h6M10 22h4M8.2 14.5A7 7 0 1 1 15.8 14.5C15 15.2 15 16 15 17H9c0-1 0-1.8-.8-2.5Z"/>',
    chart: '<path d="M4 19V5M4 19h16M7 15l4-4 3 2 5-6"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    report: '<path d="M6 3h9l4 4v14H6V3Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    home: '<path d="m3 11 9-8 9 8v10h-6v-6H9v6H3V11Z"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    alert: '<path d="M12 3 2.8 19h18.4L12 3Z"/><path d="M12 9v4M12 17h.01"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    fish: '<path d="M4 12c4-5 10-5 14 0-4 5-10 5-14 0Z"/><path d="m18 12 4-4v8l-4-4ZM8 11h.01"/>',
    shield: '<path d="M12 3 4 6v5c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
    server: '<rect x="3" y="4" width="18" height="6" rx="2"/><rect x="3" y="14" width="18" height="6" rx="2"/><path d="M7 7h.01M7 17h.01"/>',
    edit: '<path d="m4 16-1 5 5-1L19 9l-4-4L4 16ZM13 7l4 4"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/>',
    play: '<path d="m9 7 8 5-8 5V7Z"/>',
    pause: '<path d="M9 7v10M15 7v10"/>',
    plus: '<path d="M12 5v14M5 12h14"/>'
  };

  function icon(name, cls = '') {
    return `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.info}</svg>`;
  }

  const defaults = {
    activeDevice: 0,
    user: { name: 'Alpin Aditya', username: 'aquasmart', role: 'Pembudidaya / Admin', phone: '08xx-xxxx-2650' },
    devices: [
      { id: 'AQS-KOLAM-01', name: 'Kolam Lele 1', location: 'Area Budidaya Utama', ph: 7.1, temp: 28.4, turbidity: 42, online: true, aerator: true, feeder: false, auto: true },
      { id: 'AQS-AQUA-02', name: 'Bak Aquaponik', location: 'Greenhouse Timur', ph: 6.8, temp: 27.8, turbidity: 35, online: true, aerator: false, feeder: false, auto: true }
    ],
    thresholds: { phMin: 6.5, phMax: 8.5, tempMin: 25, tempMax: 30, turbidityMax: 50 },
    schedules: [
      { id: 1, time: '07:00', duration: 8, days: 'Setiap hari', active: true },
      { id: 2, time: '16:30', duration: 8, days: 'Setiap hari', active: true }
    ],
    alerts: [
      { id: 1, level: 'warning', title: 'Kekeruhan mendekati ambang batas', message: 'Kolam Lele 1 tercatat 42 NTU. Periksa sirkulasi dan sisa pakan.', time: 'Hari ini, 10:18', read: false },
      { id: 2, level: 'info', title: 'Jadwal pakan berhasil dijalankan', message: 'Feeder Kolam Lele 1 aktif selama 8 detik.', time: 'Hari ini, 07:00', read: true },
      { id: 3, level: 'critical', title: 'pH sempat di bawah batas aman', message: 'Bak Aquaponik menyentuh pH 6.3 dan kembali stabil setelah aerasi.', time: 'Kemarin, 21:40', read: true }
    ],
    readings: [],
    auditLogs: []
  };

  function seedReadings() {
    const now = Date.now();
    return Array.from({ length: 18 }, (_, i) => ({
      time: new Date(now - (17 - i) * 5 * 60000).toISOString(),
      ph: +(7 + Math.sin(i / 3) * .18 + (i % 3) * .02).toFixed(2),
      temp: +(28.1 + Math.sin(i / 4) * .65).toFixed(1),
      turbidity: Math.round(36 + Math.cos(i / 3) * 6 + i * .25)
    }));
  }

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(APP_KEY));
      const state = parsed?.mode === 'demo' ? { ...defaults, ...parsed } : structuredClone(defaults);
      state.readings = Array.isArray(state.readings) && state.readings.length ? state.readings : seedReadings();
      return state;
    } catch (_) {
      const state = structuredClone(defaults);
      state.readings = seedReadings();
      return state;
    }
  }

  let state = loadState();
  let simulationTimer = null;
  let resizeHandler = null;
  let commonCleanup = null;
  let authenticated = false;
  let csrfToken = '';
  let apiMode = 'checking';

  function saveState() {
    if (apiMode !== 'demo') { localStorage.removeItem(APP_KEY); return; }
    localStorage.setItem(APP_KEY, JSON.stringify({ ...state, mode: 'demo' }));
  }

  class ApiError extends Error {
    constructor(message, status = 0, code = 'api_error') {
      super(message);
      this.name = 'ApiError';
      this.status = status;
      this.code = code;
    }
  }

  class ApiUnavailableError extends Error {
    constructor(message = 'API lokal tidak tersedia.') {
      super(message);
      this.name = 'ApiUnavailableError';
    }
  }

  async function apiRequest(path, options = {}) {
    const method = String(options.method || 'GET').toUpperCase();
    const headers = { Accept: 'application/json', ...(options.headers || {}) };
    const init = { method, headers, credentials: 'same-origin', cache: 'no-store', signal: AbortSignal.timeout(20000) };
    if (options.body !== undefined) {
      headers['Content-Type'] = 'application/json';
      init.body = JSON.stringify(options.body);
    }
    if (!['GET', 'HEAD'].includes(method) && csrfToken) headers['X-CSRF-Token'] = csrfToken;

    let response;
    try {
      response = await fetch(path, init);
    } catch (_) {
      throw new ApiUnavailableError();
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      if (!response.ok) throw new ApiError(`Respons layanan tidak dapat dibaca (HTTP ${response.status}). Coba lagi.`, response.status, 'invalid_response');
      throw new ApiUnavailableError('Server aktif, tetapi endpoint API belum tersedia.');
    }

    let payload;
    try {
      payload = await response.json();
    } catch (_) {
      throw new ApiError(`Respons layanan tidak dapat dibaca (HTTP ${response.status}). Coba lagi.`, response.status, 'invalid_response');
    }

    if (!response.ok) {
      const error = payload?.error || {};
      throw new ApiError(error.message || 'Permintaan API gagal.', response.status, error.code);
    }
    return payload;
  }

  function applyServerUser(user) {
    if (!user) return;
    state.user = {
      id: user.id,
      accessRole: user.role,
      workspaceOwnerId: user.workspace_owner_id,
      name: user.name || state.user.name,
      username: user.username || state.user.username,
      role: user.role === 'admin' ? 'Pembudidaya / Admin' : (user.role || state.user.role),
      phone: user.phone || user.contact || state.user.phone,
      contact: user.contact || user.phone || state.user.contact || ''
    };
  }

  const sourceNames = {simulation:'Simulation', device:'Device', manual:'Manual', seed:'Seed', legacy_unverified:'Legacy / belum diketahui'};
  function provenanceBadge(source) {
    const key = Object.hasOwn(sourceNames, source) ? source : 'legacy_unverified';
    return `<span class="badge provenance-badge" data-provenance="${key}">${sourceNames[key]}</span>`;
  }
  function rowSource(row) { return apiMode === 'api' ? (row?.provenance || 'legacy_unverified') : 'simulation'; }
  function sourceCountsView(counts) {
    return `<div class="provenance-counts">${Object.keys(sourceNames).map(key=>`<span>${provenanceBadge(key)} <strong>${Number(counts?.[key] || 0)}</strong></span>`).join('')}</div>`;
  }
  function diagnosticPanel() {
    return apiMode !== 'api' ? '' : `<section class="settings-card neu-card col-12"><h2>Diagnostik telemetry mentah</h2><p>PLACEHOLDER SENSOR TANAH, BUKAN pH AIR TERKALIBRASI. Mapping turbidity bukan NTU.</p><div id="raw-telemetry" role="status">Memuat telemetry...</div></section>`;
  }
  async function loadDiagnostics() {
    const panel=qs('#raw-telemetry'); if (!panel) return;
    try {
      const result=await apiRequest(`/api/devices/${encodeURIComponent(currentDevice().id)}/telemetry`);
      if (!panel.isConnected) return;
      const rows=result.telemetry;
      const counts=Object.fromEntries(Object.keys(sourceNames).map(key=>[key,rows.filter(row=>row.provenance===key).length]));
      panel.innerHTML=sourceCountsView(counts)+(rows.length?`<div class="table-wrap" tabindex="0" role="region" aria-label="Telemetry mentah"><table><thead><tr><th>UTC / sesi</th><th>Sumber</th><th>Suhu / status</th><th>Turbidity ADC / mV / sensor mV</th><th>Mapping %</th><th>pH tanah ADC / mV</th></tr></thead><tbody>${rows.map(row=>`<tr><td>${escapeHtml(row.created_at)}<br>${escapeHtml(row.source_session)}</td><td>${provenanceBadge(row.provenance)}</td><td>${row.temperature??'—'} / ${escapeHtml(row.temperature_status)}</td><td>${row.turbidity_adc??'—'} / ${row.turbidity_mv??'—'} / ${row.turbidity_sensor_mv??'—'}</td><td>${row.turbidity_mapping_percent??'—'}</td><td>${row.soil_ph_adc??'—'} / ${row.soil_ph_mv??'—'}</td></tr>`).join('')}</tbody></table></div>`:'<p>Belum ada telemetry mentah. Tidak ada nilai sensor yang dibuat otomatis.</p>');
    } catch(error) {if(panel.isConnected)panel.textContent=`Telemetry gagal dimuat: ${error.message}`;}
  }

  function mapServerDevice(device) {
    const reading = device.latest_reading || {};
    return {
      id: device.id,
      name: device.name,
      location: device.location,
      ph: reading.ph == null ? null : Number(reading.ph),
      temp: reading.temperature == null ? null : Number(reading.temperature),
      turbidity: reading.turbidity == null ? null : Number(reading.turbidity),
      online: Boolean(device.online),
      aerator: Boolean(device.aerator),
      feeder: Boolean(device.feeder),
      auto: Boolean(device.auto),
      lastSeen: device.last_seen || reading.created_at || null,
      provenance: reading.provenance || 'legacy_unverified', source_session: reading.source_session || null,
      simulation: Boolean(reading.simulation)
    };
  }

  function mapServerReading(reading) {
    return {
      time: reading.time,
      ph: Number(reading.ph),
      temp: Number(reading.temperature),
      turbidity: Number(reading.turbidity),
      provenance: reading.provenance || 'legacy_unverified', source_session: reading.source_session || null,
      simulation: Boolean(reading.simulation)
    };
  }

  function alertTitle(alert) {
    if (alert.severity === 'critical') return 'Kondisi air membutuhkan tindakan';
    if (alert.severity === 'warning') return 'Parameter kualitas air perlu dipantau';
    return 'Aktivitas sistem selesai';
  }

  function mapServerAlert(alert) {
    const device = state.devices.find(item => item.id === alert.device_id);
    return {
      id: Number(alert.id),
      deviceId: alert.device_id,
      level: alert.severity, provenance: alert.provenance,
      title: alertTitle(alert),
      message: `${device?.name || alert.device_id} · ${alert.source || 'UNVERIFIED'} · ${alert.message}`,
      time: formatTime(alert.created_at),
      read: Boolean(alert.acknowledged)
    };
  }

  function mapServerAuditLog(log) {
    return {
      id: Number(log.id),
      action: log.action, provenance: log.provenance,
      metadata: log.metadata || {},
      time: formatTime(log.created_at)
    };
  }

  function useDemoMode() {
    apiMode = 'demo';
    csrfToken = '';
    authenticated = false;
    sessionStorage.removeItem(SESSION_KEY);
    state = loadState();
  }

  async function restoreSession() {
    try {
      const payload = await apiRequest('/api/auth/me');
      apiMode = 'api';
      authenticated = true;
      csrfToken = payload.csrf_token || '';
      sessionStorage.setItem(SESSION_KEY, 'true');
      applyServerUser(payload.user);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        apiMode = 'api';
        authenticated = false;
        csrfToken = '';
        sessionStorage.removeItem(SESSION_KEY);
      } else if (error instanceof ApiUnavailableError) {
        useDemoMode();
      } else {
        apiMode = 'api';
        authenticated = false;
        csrfToken = '';
        sessionStorage.removeItem(SESSION_KEY);
        toast(error.message || 'Layanan sesi gagal. Muat ulang untuk mencoba lagi.', 'warning');
      }
    }
    try {
      const thresholdsPayload = await apiRequest('/api/settings/thresholds');
      state.thresholds = {
        phMin: thresholdsPayload.thresholds.ph_min,
        phMax: thresholdsPayload.thresholds.ph_max,
        tempMin: thresholdsPayload.thresholds.temperature_min,
        tempMax: thresholdsPayload.thresholds.temperature_max,
        turbidityMax: thresholdsPayload.thresholds.turbidity_max
      };
    } catch (_) {}
    try {
      const me = await apiRequest('/api/auth/me');
      applyServerUser(me.user);
    } catch (_) {}
  }

  async function syncCurrentDeviceData() {
    const device = currentDevice();
    if (apiMode !== 'api') return;
    if (!device) { state.readings = []; state.schedules = []; return; }
    const encodedId = encodeURIComponent(device.id);
    const [readingPayload, schedulePayload] = await Promise.all([
      apiRequest(`/api/devices/${encodedId}/readings?limit=36`),
      apiRequest(`/api/devices/${encodedId}/schedules`)
    ]);
    state.readings = readingPayload.readings.map(mapServerReading);
    state.schedules = schedulePayload.schedules;
  }

  async function syncApiData() {
   if (apiMode !== 'api' || !authenticated) return;
   const activeId = currentDevice()?.id;
   const devicesPayload = await apiRequest('/api/devices');
   state.devices = devicesPayload.devices.map(mapServerDevice);
   const activeIndex = state.devices.findIndex(device => device.id === activeId);
   state.activeDevice = activeIndex >= 0 ? activeIndex : 0;
   await syncCurrentDeviceData();
   const [alertPayload, auditPayload] = await Promise.all([
     apiRequest('/api/alerts?limit=50'),
     apiRequest('/api/audit-logs?limit=50')
   ]);
   state.alerts = alertPayload.alerts.map(mapServerAlert);
   state.auditLogs = auditPayload.audit_logs.map(mapServerAuditLog);
   saveState();
 }

  function isAuthed() { return authenticated; }
  function connectionLabel() { return apiMode === 'api' ? 'API lokal' : 'Mode demo'; }
  function dataModeCopy() {
    if (apiMode !== 'api') return 'Data simulasi tersimpan di browser';
    if (!Number.isFinite(currentDevice()?.ph)) return 'Belum ada pembacaan sensor';
    const sources=[...new Set(state.readings.map(row=>rowSource(row)))];
    return `Sumber data: ${sources.map(key=>sourceNames[key]).join(', ') || sourceNames[rowSource(currentDevice())]}. Bukan validasi hardware atau kalibrasi`;
  }
  function currentDevice() { return state.devices[state.activeDevice] || state.devices[0]; }
  function route() { return (location.hash.replace(/^#\/?/, '') || 'home').split('?')[0]; }
  function navigate(path) { location.hash = `#/${path}`; }
  function qs(selector, root = document) { return root.querySelector(selector); }
  function qsa(selector, root = document) { return [...root.querySelectorAll(selector)]; }
  function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char])); }

  function toast(message, kind = '') {
    const node = document.createElement('div');
    node.className = `toast ${kind}`;
    node.innerHTML = `${icon(kind === 'warning' ? 'alert' : 'check', 'icon-sm')}<span>${escapeHtml(message)}</span>`;
    toastRegion.appendChild(node);
    setTimeout(() => node.remove(), 3300);
  }

  function showModal({ title, body, confirmText = 'Lanjutkan', danger = false, onConfirm }) {
    const trigger = document.activeElement;
    app.setAttribute('aria-hidden', 'true');
    app.setAttribute('inert', '');
    modalRoot.innerHTML = `
      <div class="modal-backdrop" role="presentation" data-close-modal>
        <section class="modal-card neu-card" role="dialog" aria-modal="true" aria-labelledby="modal-title" data-modal-card>
          <h2 id="modal-title">${escapeHtml(title)}</h2>
          <p>${body}</p>
          <div class="modal-actions">
            <button class="btn btn-sm" type="button" data-close-modal>Batal</button>
            <button class="btn btn-sm ${danger ? 'btn-danger' : 'btn-primary'}" type="button" id="modal-confirm">${escapeHtml(confirmText)}</button>
          </div>
        </section>
      </div>`;
    const dialog = modalRoot.querySelector('[data-modal-card]');
    const confirm = qs('#modal-confirm', modalRoot);

    function closeModal() {
      modalRoot.removeEventListener('keydown', focusTrap);
      modalRoot.innerHTML = '';
      app.removeAttribute('aria-hidden');
      app.removeAttribute('inert');
      trigger?.focus?.();
    }

    function focusTrap(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        closeModal();
        return;
      }
      if (event.key === 'Tab') {
        const focusables = qsa('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', dialog);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    modalRoot.addEventListener('keydown', focusTrap);
    confirm?.focus();
    confirm?.addEventListener('click', async () => {
      confirm.disabled = true;
      try {
        await onConfirm?.();
        closeModal();
      } catch (error) {
        toast(error.message || 'Tindakan gagal. Silakan coba lagi.', 'warning');
      } finally {
        confirm.disabled = false;
      }
    });
    qsa('[data-close-modal]', modalRoot).forEach(el => el.addEventListener('click', event => {
      if (event.target.closest('[data-modal-card]') && !event.target.matches('[data-close-modal]')) return;
      closeModal();
    }));
  }

  function brand() {
    return `<span class="brand"><img src="assets/images/logo.svg" alt=""><span>AquaSmart<small>AIoT Monitoring</small></span></span>`;
  }

  function landingPage() {
    return `
      <div class="public-page">
        <nav class="public-nav" aria-label="Navigasi utama">
          <div class="container">
            <a class="brand" href="#/home"><img src="assets/images/logo.svg" alt="Logo AquaSmart"><span>AquaSmart<small>AIoT Monitoring</small></span></a>
            <div class="public-actions">
              <a class="btn btn-sm" href="#/home" data-scroll="fitur">Fitur</a>
              <a class="btn btn-primary btn-sm" href="#/login">Masuk Dashboard ${icon('arrow', 'icon-sm')}</a>
            </div>
          </div>
        </nav>

        <main id="main-content">
          <div class="hero-band">
            <header class="hero container">
              <div class="hero-copy-block">
                <p class="eyebrow">AKUAKULTUR CERDAS, KEPUTUSAN LEBIH CEPAT</p>
                <h1>Kualitas air terjaga. Budidaya lebih tenang.</h1>
                <p class="hero-copy">AquaSmart AIoT memantau pH, suhu, dan kekeruhan air secara real-time — serta membantu mengatur aerator dan pemberian pakan dari satu dashboard.</p>
                <div class="hero-actions">
                  <a class="btn btn-primary" href="#/login">Buka Dashboard ${icon('arrow', 'icon-sm')}</a>
                  <button class="btn" id="open-demo" type="button">${icon('play', 'icon-sm')} Lihat Demo Sistem</button>
                </div>
                <div class="hero-note"><span class="pulse" aria-hidden="true"></span> Prototype mode aktif — data simulasi aman untuk demonstrasi</div>
              </div>
              <div class="hero-visual" aria-label="Visualisasi tabung sampel air dengan pembacaan pH, suhu, dan kekeruhan">
                <div class="water-sample-stage" id="water-sample-stage" data-ph="7.1" data-temperature="28.4" data-turbidity="42">
                  <div class="tube-grid" aria-hidden="true"></div>
                  <canvas id="water-sample-canvas" aria-hidden="true"></canvas>
                  <img class="water-static-fallback" src="assets/images/water-sample-static.svg" alt="Tabung sampel air dengan partikel kekeruhan">
                  <div class="tube-label tube-label-ph"><strong data-tube-value="ph">pH 7.1</strong><span>Keasaman air</span></div>
                  <div class="tube-label tube-label-temp"><strong data-tube-value="temperature">28.4°C</strong><span>Suhu air</span></div>
                  <div class="tube-label tube-label-ntu"><strong data-tube-value="turbidity">42 NTU</strong><span>Kekeruhan</span></div>
                </div>
              </div>
            </header>
          </div>

          <section class="landing-section compact-section" id="fitur">
            <div class="container">
              <div class="section-head section-head-actions">
                <div>
                  <p class="eyebrow">DASHBOARD TERPADU</p>
                  <h2>Pemantauan Real-Time</h2>
                  <p>Kualitas air terjaga dari satu titik kontrol.</p>
                </div>
                <button class="btn btn-primary" id="open-demo-features" type="button"><span>${icon('play', 'icon-sm')}</span>Lihat Demo Sistem</button>
              </div>
              <div class="live-readout-panel">
                <div class="readout-heading"><div><p class="eyebrow">STATUS AIR</p><h2>Pembacaan Langsung</h2></div><p>Satu panel readout untuk tiga instrumen utama.</p></div>
                <article class="readout-gauge gauge-ph">
                  <span class="readout-gauge-label">PH AIR</span>
                  <div class="gauge-arc" aria-hidden="true"><span class="gauge-fill"></span></div>
                  <div class="sensor-value">7.1<small>pH</small></div>
                  <span class="gauge-status">Dalam batas aman</span>
                </article>
                <article class="readout-gauge gauge-temp">
                  <span class="readout-gauge-label">SUHU AIR</span>
                  <div class="gauge-arc" aria-hidden="true"><span class="gauge-fill"></span></div>
                  <div class="sensor-value">28.4<small>°C</small></div>
                  <span class="gauge-status">Stabil</span>
                </article>
                <article class="readout-gauge gauge-turbidity warning">
                  <span class="readout-gauge-label">KEKERUHAN</span>
                  <div class="gauge-arc" aria-hidden="true"><span class="gauge-fill"></span></div>
                  <div class="sensor-value">42<small>NTU</small></div>
                  <span class="gauge-status">Perlu dipantau</span>
                </article>
              </div>
            </div>
          </section>

          <section class="landing-section white-island" id="jaringan-sistem">
            <div class="container">
              <div class="section-head"><p class="eyebrow">JARINGAN SISTEM</p><h2 class="section-title">Dari kolam ke keputusan</h2></div>
              <div class="system-flow">
                <svg class="system-flow-svg" viewBox="0 0 1000 100" aria-hidden="true">
                  <path id="system-flow-path" d="M40 52 C210 8 280 92 500 52 S790 8 960 52"></path>
                  <circle id="system-flow-dot" cx="40" cy="52" r="5"></circle>
                </svg>
                <div class="network-grid">
                  ${networkCard(1, 'Perangkat Kolam', 'ESP32, sensor pH, suhu, dan turbidity')}
                  ${networkCard(2, 'REST API', 'Telemetri tervalidasi dan tersimpan aman')}
                  ${networkCard(3, 'Dashboard Anda', 'Monitoring dan kontrol dari perangkat apa pun')}
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer class="main-footer"><div class="container"><div class="footer-grid"><div><a class="brand" href="#/home"><img src="assets/images/logo.svg" alt=""><span>AquaSmart<small>AIoT Monitoring</small></span></a><p>Prototype monitoring kualitas air dan otomasi akuakultur skala kecil.</p></div><div><h4>Tautan</h4><div class="footer-links"><a href="#/home" data-scroll="fitur">Fitur</a><button class="footer-link-button" id="open-demo-footer" type="button">Live Demo</button><a href="#/login">Dashboard</a></div></div><div><h4>Tim Proyek</h4><p>Alpin Aditya Pratama<br>Dimas Aryo Sejati</p></div></div><div class="copyright">© 2026 AquaSmart AIoT. Prototype akademik — data yang tampil merupakan simulasi.</div></div></footer>
      </div>`;
  }

  function featureCard(iconName, title, copy) { return `<article class="feature-card neu-card"><div class="feature-icon">${icon(iconName, 'icon-lg')}</div><h3>${title}</h3><p>${copy}</p></article>`; }
  function networkCard(step, title, copy) { return `<article class="network-card neu-card"><div class="step">${step}</div><h3>${title}</h3><p>${copy}</p></article>`; }

  function loginPage() {
    return `
      <main class="auth-page" id="main-content" tabindex="-1">
        <section class="auth-form-side">
          <div class="auth-card neu-card">
            <a class="brand auth-brand" href="#/home"><img src="assets/images/logo.svg" alt="Logo AquaSmart"><span>AquaSmart<small>AIoT Monitoring</small></span></a>
            <h1>Selamat datang kembali</h1>
            <p>Masuk untuk memantau kualitas air dan perangkat budidaya Anda.</p>
            <form class="form-stack" id="login-form" novalidate>
              <div class="field"><label for="username">Username</label><div class="input-shell">${icon('user', 'icon-sm')}<input id="username" name="username" autocomplete="username" placeholder="Masukkan username" required></div></div>
              <div class="field"><label for="password">Password</label><div class="input-shell">${icon('lock', 'icon-sm')}<input id="password" name="password" type="password" autocomplete="current-password" placeholder="Masukkan password" required><button class="btn-ghost" type="button" id="toggle-password" aria-label="Tampilkan password">${icon('eye', 'icon-sm')}</button></div></div>
              <div class="auth-error" id="login-error" role="alert">Username atau password tidak sesuai.</div>
              <button class="btn btn-primary" type="submit">${icon('lock', 'icon-sm')} Masuk Dashboard</button>
            </form>
            <p class="auth-switch">Belum punya akun? <a href="#/register">Buat akun di sini</a></p>
            <div class="demo-note"><b>${apiMode === 'api' ? 'Autentikasi server aktif' : 'Backend tidak tersedia'}</b><br><span>${apiMode === 'api' ? 'Masukkan akun yang dikonfigurasi pada server lokal.' : 'Mode demo hanya memakai data simulasi di browser dan tidak mengakses database.'}</span>${apiMode === 'demo' ? '<button class="btn btn-sm demo-mode-button" type="button" id="demo-mode-button">Buka Mode Demo</button>' : ''}</div>
            <a class="back-link" href="#/home">← Kembali ke halaman utama</a>
          </div>
        </section>
        <section class="auth-visual" aria-hidden="true"><div class="auth-visual-content"><p class="eyebrow auth-eyebrow">Monitoring tanpa menebak</p><h2>Rawat ekosistem air dengan data yang mudah dipahami.</h2><p>Parameter penting, kontrol aktuator, peringatan, dan histori tersedia dalam satu alur kerja.</p><div class="auth-stat-row"><div class="auth-stat"><b>3</b><span>parameter air</span></div><div class="auth-stat"><b>≤60s</b><span>target peringatan</span></div><div class="auth-stat"><b>Lokal</b><span>mode prototipe</span></div></div></div></section>
      </main>`;
  }

  function registerPage() {
    return `
      <main class="auth-page" id="main-content" tabindex="-1">
        <section class="auth-form-side">
          <div class="auth-card">
            <a class="brand auth-brand" href="#/home"><img src="assets/images/logo.svg" alt="Logo AquaSmart"><span>AquaSmart<small>AIoT Monitoring</small></span></a>
            <h1>Buat akun AquaSmart</h1>
            <p>Siapkan akses monitoring sekarang. Perangkat dapat dihubungkan saat daftar atau nanti dari Pengaturan.</p>
            <form class="form-stack" id="register-form" novalidate>
              <div class="field">
                <label for="register-name">Nama Lengkap</label>
                <div class="input-shell">${icon('user', 'icon-sm')}<input id="register-name" name="name" type="text" autocomplete="name" placeholder="Nama sesuai identitas" aria-describedby="register-name-error" maxlength="100" required></div>
                <div class="field-error" id="register-name-error" role="alert">Isi nama lengkap, maksimal 100 karakter.</div>
              </div>
              <div class="field">
                <label for="register-contact">Email atau No. WhatsApp</label>
                <div class="input-shell">${icon('wifi', 'icon-sm')}<input id="register-contact" name="contact" type="text" autocomplete="email" inputmode="email" placeholder="email@contoh.com atau 08xxxxxxxxxx" aria-describedby="register-contact-error" required></div>
                <div class="field-error" id="register-contact-error" role="alert">Format email atau nomor WA belum sesuai.</div>
              </div>
              <div class="field">
                <label for="register-password">Password</label>
                <div class="input-shell">${icon('lock', 'icon-sm')}<input id="register-password" name="password" type="password" autocomplete="new-password" placeholder="Minimal 8 karakter" aria-describedby="register-password-error" required minlength="8"><button class="btn-ghost" type="button" data-toggle-password="register-password" aria-label="Tampilkan password">${icon('eye', 'icon-sm')}</button></div>
                <div class="field-error" id="register-password-error" role="alert">Password minimal 8 karakter.</div>
              </div>
              <div class="field">
                <label for="register-password-confirmation">Konfirmasi Password</label>
                <div class="input-shell">${icon('lock', 'icon-sm')}<input id="register-password-confirmation" name="password_confirmation" type="password" autocomplete="new-password" placeholder="Ulangi password" aria-describedby="register-confirmation-error" required><button class="btn-ghost" type="button" data-toggle-password="register-password-confirmation" aria-label="Tampilkan password">${icon('eye', 'icon-sm')}</button></div>
                <div class="field-error" id="register-confirmation-error" role="alert">Password dan konfirmasi belum sama.</div>
              </div>
              <div class="field">
                <div class="serial-label-row"><label for="register-serial">Serial Number Alat (opsional)</label><button class="tooltip-trigger" type="button" aria-label="Informasi serial number" aria-describedby="serial-tooltip">${icon('info', 'icon-sm')}</button><div class="tooltip-copy" id="serial-tooltip" role="tooltip">Isi kalau kamu sudah punya perangkat AquaSmart terdaftar. Bisa ditambahkan nanti dari Pengaturan.</div></div>
                <div class="input-shell">${icon('server', 'icon-sm')}<input id="register-serial" name="serial_number" type="text" autocomplete="off" placeholder="Kosongkan jika belum punya perangkat"></div>
              </div>
              <div class="auth-error" id="register-error" role="alert"></div>
              <button class="btn btn-primary" type="submit">${icon('user', 'icon-sm')} Buat Akun</button>
            </form>
            <p class="auth-switch">Sudah punya akun? <a href="#/login">Masuk di sini</a></p>
            <a class="back-link" href="#/home">← Kembali ke halaman utama</a>
          </div>
        </section>
        <section class="auth-visual" aria-hidden="true"><div class="auth-visual-content"><p class="eyebrow auth-eyebrow">AKUN UNTUK SATU EKOSISTEM AIR</p><h2>Mulai dari data. Hubungkan alat saat Anda siap.</h2><p>Akun tetap bisa dibuat tanpa perangkat. Serial AquaSmart dapat ditambahkan kemudian tanpa kehilangan histori profil.</p><div class="auth-stat-row"><div class="auth-stat"><b>3</b><span>parameter air</span></div><div class="auth-stat"><b>1</b><span>dashboard terpadu</span></div><div class="auth-stat"><b>Lokal</b><span>mode prototipe</span></div></div></div></section>
      </main>`;
  }

  const pageMeta = {
    dashboard: ['DASHBOARD KUALITAS AIR', 'Pemantauan real-time'],
    alerts: ['PERINGATAN & REKOMENDASI', 'Status kualitas air'],
    reports: ['LAPORAN & LOG SISTEM', 'Analitik operasional'],
    settings: ['PENGATURAN SISTEM', 'Threshold dan perangkat'],
    profile: ['PROFIL PENGGUNA', 'Informasi akun']
  };

  function sidebar(active) {
    const unread = state.alerts.filter(a => !a.read).length;
    const link = (path, label, iconName, count = '') => `<a class="nav-link ${active === path ? 'active' : ''}" href="#/${path}">${icon(iconName)}<span>${label}</span>${count ? `<span class="nav-count">${count}</span>` : ''}</a>`;
    return `
      <div class="drawer-overlay" id="drawer-overlay"></div>
      <aside class="sidebar" id="sidebar" aria-label="Menu aplikasi">
        <div class="sidebar-head"><a class="brand" href="#/dashboard"><img src="assets/images/logo.svg" alt=""><span>AquaSmart<small>AIoT Monitoring</small></span></a><button class="btn icon-btn" id="close-sidebar" aria-label="Tutup menu">${icon('close')}</button></div>
        <nav class="sidebar-nav">
          <div class="sidebar-label">Monitoring</div>
          <a class="nav-link" href="units.html">${icon('wifi')}<span>Unit Aquaponik & Aktivasi</span></a>
          ${link('dashboard', 'Dashboard Kualitas Air', 'gauge')}
          ${link('alerts', 'Peringatan & Rekomendasi', 'bell', unread)}
          ${link('reports', 'Laporan & Log', 'report')}
          <div class="sidebar-label">Akun & Sistem</div>
          ${link('settings', 'Pengaturan', 'settings')}
          ${link('profile', 'Profil', 'user')}
          <span class="sidebar-spacer"></span>
          <button class="nav-link" id="logout-button" type="button">${icon('logout')}<span>Keluar</span></button>
        </nav>
        <div class="sidebar-user"><div class="avatar">${initials(state.user.name)}</div><div><b>${escapeHtml(state.user.name)}</b><span>${escapeHtml(state.user.role)}</span></div></div>
      </aside>`;
  }

  function appShell(active, content) {
    const meta = pageMeta[active] || pageMeta.dashboard;
    return `
      <div class="app-shell">
        ${sidebar(active)}
        <header class="app-topbar"><div class="topbar-inner"><button class="btn icon-btn" id="open-sidebar" aria-label="Buka menu">${icon('menu')}</button><div class="page-ident"><b>${meta[0]}</b><span>${meta[1]}</span></div><div class="topbar-right"><span class="badge" data-connection-mode="${apiMode}">${connectionLabel()}</span><div class="weather">${icon('wifi', 'icon-sm')}<span>${currentDevice()?.online ? 'Perangkat online' : 'Perangkat offline'}</span></div></div></div></header>
        <main class="app-main" id="main-content" tabindex="-1">${content}</main>
      </div>`;
  }

  function initials(name) { return name.split(/\s+/).map(x => x[0]).slice(0, 2).join('').toUpperCase(); }

  function readingStatus(kind, value) {
    if (!Number.isFinite(value)) return ['Belum ada data', 'muted'];
    const t = state.thresholds;
    if (kind === 'ph') return value >= t.phMin && value <= t.phMax ? ['Aman', 'text-success'] : ['Di luar batas', 'text-danger'];
    if (kind === 'temp') return value >= t.tempMin && value <= t.tempMax ? ['Stabil', 'text-success'] : ['Perlu tindakan', 'text-danger'];
    return value <= t.turbidityMax ? ['Dalam batas', 'text-success'] : ['Tinggi', 'text-danger'];
  }

  function sensorNumber(value, decimals) { return Number.isFinite(value) ? value.toFixed(decimals) : '—'; }
  function qualityIssues(d) {
    if (!d) return [];
    return [['ph', 'pH', d.ph], ['temp', 'Suhu', d.temp], ['turbidity', 'Kekeruhan', d.turbidity]]
      .filter(([kind, , value]) => readingStatus(kind, value)[1] === 'text-danger');
  }
  function qualitySummary(d) {
    if (![d.ph, d.temp, d.turbidity].every(Number.isFinite)) return '<div class="alert-banner">Belum ada pembacaan lengkap. Status kualitas air belum dapat dinilai.</div>';
    const issues = qualityIssues(d);
    return issues.length ? `<div class="alert-banner">${icon('alert')}<div><strong>Di luar batas:</strong> ${issues.map(([, label]) => label).join(', ')}. Periksa pembacaan dan ambang yang dikonfigurasi.</div></div>` : '<p class="quality-normal">Semua parameter terukur berada dalam batas yang dikonfigurasi.</p>';
  }
  function qualityRecommendations(d) {
    const issues = qualityIssues(d);
    const advice = { ph: 'Periksa sensor pH dan sumber air. Hindari koreksi mendadak.', temp: 'Periksa suhu dan sirkulasi air sebelum tindakan.', turbidity: 'Periksa sisa pakan, filter, dan sirkulasi air.' };
    return provenanceBadge(rowSource(d)) + (issues.length ? issues.map(([kind, label]) => `<div class="recommendation"><div class="rec-head text-danger">${label} di luar batas</div><p>${advice[kind]}</p></div>`).join('') : `<div class="recommendation"><p>${[d.ph, d.temp, d.turbidity].every(Number.isFinite) ? 'Lanjutkan pemantauan berkala. Tidak ada pelanggaran ambang pada pembacaan terakhir.' : 'Tunggu pembacaan sensor sebelum mengambil keputusan kualitas air.'}</p></div>`) + '<a class="rec-action" href="#/reports">Tinjau histori →</a>';
  }
  function metricCard(kind, iconName, label, value, unit, range, className) {
    const status = readingStatus(kind, value === '—' ? null : Number(value));
    return `<article class="metric-card neu-card ${className}"><div class="metric-head"><div class="metric-icon">${icon(iconName)}</div><span class="metric-status ${status[1]}">${status[0]}</span></div><div class="metric-label">${label}</div><div class="metric-value" data-live-value="${kind}">${value}<small>${unit}</small></div><div class="metric-range">Batas acuan: ${range}</div></article>`;
  }

  function dashboardPage() {
    const d = currentDevice();
    if (!d) return appShell('dashboard', deviceEmptyState());
    return appShell('dashboard', `
      <section class="dashboard-intro">
        <div>
          <p class="eyebrow">${escapeHtml(d.location)}</p>
          <h1>Kualitas Air</h1>
          <p>Data terakhir diperbarui <span id="last-updated">${d.lastSeen ? formatTime(d.lastSeen) : (apiMode === 'api' ? 'belum tersedia' : 'simulasi browser')}</span> · <span id="data-source-copy">${dataModeCopy()}</span></p>
          <button class="btn btn-primary btn-sm demo-dashboard-btn" type="button"><span>${icon('play', 'icon-sm')}</span>Lihat Demo Sistem</button>
        </div>
        <div class="device-tabs" role="tablist">${state.devices.map((device, i) => `<button class="device-tab ${i === state.activeDevice ? 'active' : ''}" data-device="${i}" role="tab" aria-selected="${i === state.activeDevice}">${escapeHtml(device.name)}</button>`).join('')}</div>
      </section>
      <div id="quality-summary">${qualitySummary(d)}</div>
      <section class="metrics-grid" aria-label="Metrik kualitas air">
        ${metricCard('ph', 'droplet', 'pH Air', sensorNumber(d.ph, 1), 'pH', `${state.thresholds.phMin}–${state.thresholds.phMax}`, 'metric-ph')}
        ${metricCard('temp', 'thermometer', 'Suhu Air', sensorNumber(d.temp, 1), '°C', `${state.thresholds.tempMin}–${state.thresholds.tempMax}°C`, 'metric-temp')}
        ${metricCard('turbidity', 'waves', 'Kekeruhan', sensorNumber(d.turbidity, 0), 'NTU', `≤ ${state.thresholds.turbidityMax} NTU`, 'metric-turbidity')}
        <article class="metric-card neu-card metric-device"><div class="metric-head"><div class="metric-icon">${icon('wifi')}</div><span class="metric-status ${d.online ? 'text-success' : 'text-danger'}">${d.online ? 'Online' : 'Offline'}</span></div><div class="metric-label">Status Perangkat</div><div class="metric-value metric-value-device">${d.online ? 'Terhubung' : 'Terputus'}</div><div class="metric-range">${escapeHtml(d.id)} · ${connectionLabel()}</div></article>
      </section>

      <section class="dashboard-two">
        <div class="panel neu-card"><div class="panel-head"><div class="panel-title">${icon('power')}<div><h2>Kontrol Aktuator</h2><p>Manual dan otomatis</p></div></div><span class="badge">Perangkat aktif</span></div><div class="control-grid">
          ${controlCard('aerator', 'wind', 'Aerator', 'Meningkatkan sirkulasi dan oksigen air.', d.aerator)}
          <article class="control-card"><div class="control-top"><div class="metric-icon control-icon">${icon('feeder')}</div><span class="badge ${d.feeder ? '' : 'badge-warning'}" id="feeder-status">${apiMode==='api' ? 'Lihat log simulator' : d.feeder ? 'Aktif' : 'Siap'}</span></div><h3>Feeder</h3><p>Jalankan motor pakan selama 8 detik.</p><button class="btn btn-primary btn-sm quick-feed" id="feed-now">${icon('power','icon-sm')} Beri Pakan</button></article>
          ${controlCard('auto', 'robot', 'Mode Otomatis', 'Jadwal simulator berjalan saat scheduler lokal aktif.', d.auto)}
        </div></div>
        <aside class="panel neu-card"><div class="panel-head"><div class="panel-title">${icon('bulb')}<div><h2>Rekomendasi</h2><p>Berdasarkan kondisi terbaru</p></div></div></div><div id="quality-recommendations">${qualityRecommendations(d)}</div></aside>
      </section>

      <section class="panel neu-card chart-panel"><div class="panel-head"><div class="panel-title">${icon('chart')}<div><h2>Data History</h2><p>Pembacaan terbaru yang tersedia</p></div></div><div class="chart-legend"><span class="legend-item"><i class="legend-dot legend-ph"></i>pH</span><span class="legend-item"><i class="legend-dot legend-temp"></i>Suhu</span><span class="legend-item"><i class="legend-dot legend-turbidity"></i>Kekeruhan</span></div></div><div class="chart-wrap"><canvas id="history-chart" role="img" aria-label="Grafik histori pH, suhu dan kekeruhan"></canvas></div></section>

      <section class="panel neu-card scheduler"><div class="panel-head"><div class="panel-title">${icon('calendar')}<div><h2>Jadwal Pakan</h2><p>Feeder terjadwal untuk ${escapeHtml(d.name)}</p></div></div><span class="badge">${state.schedules.filter(s => s.active).length} jadwal aktif</span></div><div class="scheduler-grid"><div><h3 class="scheduler-subtitle">Jadwal Aktif</h3><div class="schedule-list">${scheduleList()}</div></div><div><h3 class="scheduler-subtitle">Tambah Jadwal Baru</h3><form class="schedule-form" id="schedule-form"><div class="time-row"><div><label for="schedule-time">Waktu pemberian pakan</label><input id="schedule-time" type="time" value="12:00" required></div><div><label for="schedule-duration">Durasi feeder (detik)</label><input id="schedule-duration" type="number" min="1" max="30" value="8" required></div></div><div><label for="schedule-days">Pengulangan</label><select id="schedule-days" class="form-control"><option>Setiap hari</option><option value="Senin - Jumat">Senin–Jumat</option><option>Akhir pekan</option></select></div><button class="btn btn-primary" type="submit">${icon('plus','icon-sm')} Tambah Jadwal</button></form></div></div></section>`);
  }

  function deviceEmptyState() {
    return `<section class="device-empty-state neu-card"><div class="empty-state-mark">${icon('server', 'icon-lg')}</div><p class="eyebrow">BELUM ADA PERANGKAT</p><h1>Hubungkan alat pertama Anda</h1><p>Akun sudah aktif, tetapi belum ada serial AquaSmart yang terhubung. Tambahkan perangkat dari Pengaturan saat alat tersedia.</p><a class="btn btn-primary" href="#/settings">Buka Pengaturan ${icon('arrow', 'icon-sm')}</a></section>`;
  }

  function controlCard(key, iconName, title, copy, checked) {
    return `<article class="control-card"><div class="control-top"><div class="metric-icon control-icon">${icon(iconName)}</div><label class="switch"><input type="checkbox" data-control="${key}" ${checked ? 'checked' : ''} aria-label="Aktifkan ${title}"><span></span></label></div><h3>${title}</h3><p>${copy}</p><div class="rec-action" id="${key}-status">${apiMode==='api' ? 'Permintaan' : 'Status'}: ${checked ? 'Aktif' : 'Nonaktif'}</div></article>`;
  }

  function scheduleList() {
    if (!state.schedules.length) return '<div class="schedule-empty">Belum ada jadwal pakan.</div>';
    return state.schedules.map(s => `<div class="schedule-item"><div class="schedule-time">${icon('clock','icon-sm')}<div><b>${escapeHtml(s.time)} · ${s.duration} detik</b><small>${escapeHtml(s.days)}</small></div></div><button class="btn icon-btn btn-sm" data-delete-schedule="${s.id}" aria-label="Hapus jadwal ${escapeHtml(s.time)}">${icon('trash','icon-sm')}</button></div>`).join('');
  }

  function alertsPage() {
    return appShell('alerts', `<div class="page-heading"><p class="eyebrow">Rule-based monitoring</p><h1>Peringatan & Rekomendasi</h1><p>Kondisi di luar batas aman dan tindakan yang disarankan.</p></div><div class="content-grid"><section class="col-8 alert-list">${state.alerts.map(alert => `<article class="alert-item neu-card ${alert.level === 'critical' ? 'critical' : ''}"><div class="alert-icon">${icon(alert.level === 'info' ? 'check' : 'alert')}</div><div><h3>${escapeHtml(alert.title)} ${!alert.read ? '<span class="badge badge-warning badge-new">Baru</span>' : ''}</h3>${provenanceBadge(rowSource(alert))}<p>${escapeHtml(alert.message)}</p></div><time>${escapeHtml(alert.time)}</time></article>`).join('')}</section><aside class="col-4"><div class="settings-card neu-card"><h2>${icon('bulb')} Panduan Tindakan</h2><div class="recommendation"><div class="rec-head">pH terlalu rendah</div><p>Periksa sumber air, aerasi, dan lakukan koreksi bertahap. Hindari perubahan mendadak.</p></div><div class="recommendation"><div class="rec-head">Kekeruhan tinggi</div><p>Periksa sisa pakan, filter, dan sirkulasi. Kurangi pemberian pakan bila diperlukan.</p></div><button class="btn btn-primary mark-read-button" id="mark-read">${icon('check','icon-sm')} Tandai semua dibaca</button></div></aside></div>`);
  }

  function operationsPanels() {
    if (apiMode !== 'api') return '';
    const today = new Date().toISOString().slice(0,10);
    return `<section class="settings-card neu-card col-12"><h2>Observasi Pertumbuhan</h2><p>Catatan sampel manual; bukan hasil sensor atau prediksi AI. Tanggal pengamatan menggunakan UTC.</p>
      ${state.user.accessRole==='admin'?`<form class="settings-form" id="growth-form"><label for="growth-date">Tanggal pengamatan</label><input class="form-control" id="growth-date" type="date" value="${today}" required><label for="growth-weight">Berat sampel (gram, opsional)</label><input class="form-control" id="growth-weight" type="number" min="0.01" step="0.01"><label for="growth-length">Panjang sampel (cm, opsional)</label><input class="form-control" id="growth-length" type="number" min="0.01" step="0.01"><label for="growth-notes">Catatan pengamatan</label><textarea class="form-control" id="growth-notes" maxlength="2000"></textarea><button class="btn" type="submit">Simpan observasi</button></form>`:''}
      <div id="growth-list" class="table-wrap" aria-live="polite">Memuat observasi…</div></section>
      <section class="settings-card neu-card col-12"><h2>Status Perintah & Log Feeder</h2><p>Eksekusi simulator lokal, bukan bukti hardware. Pending: antre; delivered: dikirim; succeeded/failed: hasil simulator; timeout: tanpa ACK tepat waktu.</p><div id="command-list" class="table-wrap" aria-live="polite">Memuat perintah…</div></section>`;
  }

  function bindOperationsPanels() {
    if(apiMode!=='api'||!currentDevice())return;
    const deviceId=currentDevice().id;
    const list=qs('#growth-list'),commands=qs('#command-list');
    apiRequest('/api/growth-observations').then(result=>{
      if(!list?.isConnected)return;
      const rows=result.observations.filter(row=>row.device_id===deviceId);
      list.innerHTML=rows.length?`<table><thead><tr><th>Tanggal</th><th>Gram</th><th>cm</th><th>Catatan</th><th>Aksi</th></tr></thead><tbody>${rows.map(row=>`<tr><td>${escapeHtml(row.observed_at)}</td><td>${row.weight_g??'—'}</td><td>${row.length_cm??'—'}</td><td>${provenanceBadge(row.provenance)} ${escapeHtml(row.notes)}</td><td>${state.user.accessRole==='admin'?`<button class="btn btn-sm" data-delete-growth="${row.id}">Hapus</button>`:'Akses baca'}</td></tr>`).join('')}</tbody></table>`:'Belum ada observasi.';
      qsa('[data-delete-growth]',list).forEach(button=>button.addEventListener('click',()=>showModal({title:'Hapus observasi?',body:'Catatan ini akan dihapus dan tindakan tercatat di audit.',onConfirm:async()=>{await apiRequest(`/api/growth-observations/${button.dataset.deleteGrowth}`,{method:'DELETE'});render();}})));
    }).catch(error=>{if(list?.isConnected)list.textContent=error.message;});
    const refreshCommands = () => apiRequest(`/api/devices/${encodeURIComponent(deviceId)}/commands`).then(result=>{
      if(!commands?.isConnected)return;
      commands.innerHTML=result.commands.length?`<table><thead><tr><th>Waktu</th><th>Aktuator</th><th>Durasi</th><th>Status</th><th>Sumber</th></tr></thead><tbody>${result.commands.map(row=>`<tr><td>${formatTime(row.created_at*1000)}</td><td>${escapeHtml(row.actuator)}</td><td>${row.duration} detik</td><td>${escapeHtml(row.status)}</td><td>${provenanceBadge(row.provenance)}</td></tr>`).join('')}</tbody></table>`:'Belum ada perintah.';
    }).catch(error=>{if(commands?.isConnected)commands.textContent=error.message;});
    refreshCommands();
    simulationTimer = setInterval(refreshCommands, 5000);
    qs('#growth-form')?.addEventListener('submit',async event=>{
      event.preventDefault();const button=event.currentTarget.querySelector('button');button.disabled=true;
      try{await apiRequest('/api/growth-observations',{method:'POST',body:{device_id:deviceId,observed_at:qs('#growth-date').value,weight_g:qs('#growth-weight').value?Number(qs('#growth-weight').value):null,length_cm:qs('#growth-length').value?Number(qs('#growth-length').value):null,notes:qs('#growth-notes').value.trim()}});render();toast('Observasi tersimpan.');}
      catch(error){toast(error.message,'warning');}finally{button.disabled=false;}
    });
  }

  function filteredExportPanel() {
    if (apiMode !== 'api') return '';
    return `<section class="settings-card neu-card col-12"><h2>Ekspor Data Berfilter</h2><p>Unduh data milik ruang budidaya ini. Batas 10.000 baris per berkas; minggu dimulai Senin. Label simulasi disertakan.</p>
      <form class="filter-bar" id="filtered-export-form">
        <label for="export-device">Perangkat<select class="select-shell" id="export-device" name="device_id">${state.devices.map(d=>`<option value="${escapeHtml(d.id)}" ${d.id===currentDevice().id?'selected':''}>${escapeHtml(d.name)}</option>`).join('')}</select></label>
        <label for="export-kind">Jenis data<select class="select-shell" id="export-kind" name="kind"><option value="readings">Pembacaan sensor</option><option value="alerts">Peringatan</option><option value="commands">Perintah aktuator</option><option value="feeding_logs">Log pakan selesai</option><option value="reports">Agregat laporan</option><option value="telemetry">Telemetry mentah (diagnostik)</option></select></label>
        <label for="export-date">Tanggal acuan (UTC)<input class="form-control" id="export-date" name="date" type="date" value="${new Date().toISOString().slice(0,10)}" min="0001-01-01" max="9999-12-31" required></label>
        <label for="export-period">Periode<select class="select-shell" id="export-period" name="period"><option value="day">Harian</option><option value="week">Mingguan</option><option value="month">Bulanan</option></select></label>
        <label for="export-format">Format<select class="select-shell" id="export-format" name="format"><option value="csv">CSV</option><option value="json">JSON</option></select></label>
        <button class="btn btn-primary" type="submit">Unduh data</button>
      </form><p id="filtered-export-status" role="status">Pilih filter untuk menyiapkan berkas.</p></section>`;
  }

  function calendarReportPanel() {
    if (apiMode !== 'api') return '<section class="settings-card neu-card col-12"><h2>Laporan kalender</h2><p>Mode demo / offline: laporan kalender server tidak tersedia. Riwayat simulasi di bawah bukan laporan kalender.</p></section>';
    return `<section class="settings-card neu-card col-12" id="calendar-report"><div class="panel-head"><div><h2>Laporan Kalender UTC</h2><p>Agregat harian seluruh sampel dalam periode. Minggu dimulai Senin.</p></div></div>
      <form class="filter-bar" id="calendar-form">
        <label for="calendar-device">Perangkat laporan<select class="select-shell" id="calendar-device">${state.devices.map(d => `<option value="${escapeHtml(d.id)}" ${d.id === currentDevice().id ? 'selected' : ''}>${escapeHtml(d.name)}</option>`).join('')}</select></label>
        <label for="calendar-date">Tanggal acuan (UTC)<input class="form-control" type="date" id="calendar-date" value="${new Date().toISOString().slice(0,10)}" min="0001-01-01" max="9999-12-31" required></label>
        <label for="calendar-period">Periode<select class="select-shell" id="calendar-period"><option value="day">Harian</option><option value="week">Mingguan</option><option value="month">Bulanan</option></select></label>
        <button class="btn btn-primary" type="submit" id="calendar-submit">Tampilkan laporan</button>
      </form><div id="calendar-results" aria-live="polite"><p>Pilih perangkat, tanggal, dan periode lalu tampilkan laporan.</p></div></section>`;
  }

  function calendarResults(report) {
    return `<p>UTC · ${escapeHtml(report.start_at)} sampai ${escapeHtml(report.end_at_exclusive)} (akhir tidak termasuk).</p>
      <p>Total sampel: ${report.total_samples} · Simulasi: ${report.simulation_samples} · Non-simulasi: ${report.non_simulation_samples}. Flag non-simulasi bukan bukti pengukuran hardware fisik.</p>
      ${sourceCountsView(report.source_counts)}
      ${report.groups.length ? `<div class="table-wrap" tabindex="0" role="region" aria-label="Agregat harian UTC, geser untuk semua kolom"><table><thead><tr><th scope="col">Tanggal UTC</th><th scope="col">Sampel</th><th scope="col">Rata-rata pH</th><th scope="col">Rata-rata suhu °C</th><th scope="col">Rata-rata kekeruhan NTU</th><th scope="col">Simulasi</th><th scope="col">Non-simulasi</th></tr></thead><tbody>${report.groups.map(g => `<tr><td>${escapeHtml(g.day)}</td><td>${g.cnt}</td><td>${sensorNumber(g.ph_avg,2)}</td><td>${sensorNumber(g.temperature_avg,1)}</td><td>${sensorNumber(g.turbidity_avg,1)}</td><td>${g.simulation_samples}</td><td>${g.non_simulation_samples}${sourceCountsView(Object.fromEntries(Object.keys(sourceNames).map(key=>[key,g['source_'+key]])))}</td></tr>`).join('')}</tbody></table></div>` : '<p>Tidak ada sampel pada periode ini.</p>'}`;
  }

  function reportsPage() {
    if (!currentDevice()) return appShell('reports', deviceEmptyState());
    const rows = state.readings.slice(-(state.reportLimit || 12)).reverse();
    const summaries = [['ph', 'pH', 2, ''], ['temp', 'Suhu', 1, '°C'], ['turbidity', 'Kekeruhan', 0, ' NTU']].map(([key,label,decimals,unit]) => {
      const value = rows.length ? average(rows, key) : null;
      return `<article class="summary-card neu-card col-4"><span>Rata-rata ${label}</span><strong>${sensorNumber(value, decimals)}${unit}</strong><small>${readingStatus(key, value)[0]} · ${rows.length} pembacaan</small></article>`;
    }).join('');
    const auditLogs = state.auditLogs || [];
    return appShell('reports', `<div class="dashboard-intro"><div><p class="eyebrow">Ringkasan operasi</p><h1>Laporan & Log Sistem</h1><p>${dataModeCopy()}.</p></div><button class="btn btn-primary" id="export-csv" ${rows.length ? '' : 'disabled'}>${icon('download','icon-sm')} Ekspor CSV pembacaan dimuat</button></div>
      <section class="content-grid">${summaries}
      <section class="settings-card neu-card col-12"><div class="panel-head"><div><h2>Riwayat Pembacaan Sensor</h2><p>Data terbatas pada pembacaan yang dimuat, bukan laporan bulanan lengkap.</p></div><div class="filter-bar"><label>Perangkat<select class="select-shell" id="report-device" aria-label="Perangkat">${state.devices.map((d,i)=>`<option value="${i}" ${i===state.activeDevice?'selected':''}>${escapeHtml(d.name)}</option>`).join('')}</select></label><label>Jumlah data<select class="select-shell" id="report-limit" aria-label="Jumlah data"><option value="12" ${state.reportLimit!==36?'selected':''}>12 terbaru</option><option value="36" ${state.reportLimit===36?'selected':''}>36 terbaru</option></select></label></div></div>
      <div class="table-wrap" tabindex="0" role="region" aria-label="Riwayat sensor, geser untuk melihat semua kolom"><table><thead><tr><th>Waktu</th><th>pH</th><th>Suhu</th><th>Kekeruhan</th><th>Status</th><th>Sumber</th></tr></thead><tbody>${rows.length ? rows.map(r => `<tr><td>${formatTime(r.time)}</td><td>${sensorNumber(r.ph,2)}</td><td>${sensorNumber(r.temp,1)}°C</td><td>${sensorNumber(r.turbidity,0)} NTU</td><td>${qualityIssues(r).length ? 'Di luar batas' : 'Dalam batas'}</td><td>${provenanceBadge(rowSource(r))}</td></tr>`).join('') : '<tr><td colspan="6">Belum ada pembacaan sensor.</td></tr>'}</tbody></table></div></section>
      ${calendarReportPanel()}${filteredExportPanel()}${diagnosticPanel()}
      <section class="settings-card neu-card col-12"><h2>Log Aktuator & Audit Sistem</h2><p>Log perubahan state server; bukan bukti eksekusi atau ACK hardware.</p><div class="table-wrap" tabindex="0" role="region" aria-label="Audit sistem"><table><thead><tr><th>Waktu</th><th>Aksi</th><th>Detail</th></tr></thead><tbody>${auditLogs.length ? auditLogs.map(log=>`<tr><td>${escapeHtml(log.time)}</td><td>${provenanceBadge(rowSource(log))} ${escapeHtml(log.action)}</td><td>${escapeHtml(JSON.stringify(log.metadata))}</td></tr>`).join('') : '<tr><td class="audit-empty-row" colspan="3">Belum ada audit log.</td></tr>'}</tbody></table></div></section>${operationsPanels()}</section>`);
  }
  function average(rows, key) { return rows.reduce((sum, row) => sum + Number(row[key]), 0) / Math.max(rows.length, 1); }
  function formatTime(iso) { return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }).format(new Date(iso)); }

  function workspacePanel() {
    if (apiMode !== 'api') return '';
    return `<section class="settings-card neu-card col-12"><h2>Ruang Budidaya</h2><p>${state.user.accessRole === 'viewer' ? 'Viewer — akses baca' : 'Admin — hanya ruang budidaya sendiri'}</p>
      ${state.user.accessRole === 'admin' ? `<form id="invite-form" class="settings-form"><label for="invite-contact">Undang viewer dengan email atau nomor WA</label><input class="form-control" id="invite-contact" required maxlength="254"><button class="btn" type="submit">Buat undangan</button><output id="invite-output" class="form-help" aria-live="polite"></output></form>` : ''}
      ${state.devices.length === 0 && state.user.accessRole === 'admin' ? `<form id="accept-invite-form" class="settings-form"><label for="invite-token">Kode undangan (berlaku 24 jam)</label><input class="form-control" id="invite-token" required pattern="[a-f0-9]{64}" autocomplete="off"><button class="btn" type="submit">Terima undangan viewer</button></form>` : ''}
      <div id="workspace-members" aria-live="polite"></div></section>`;
  }

  function applyReadOnlyAccess() {
    if (apiMode === 'api' && state.user.accessRole === 'viewer') {
      qsa('[data-control], #feed-now, #schedule-form input, #schedule-form select, #schedule-form button, [data-delete-schedule], #threshold-form input, #threshold-form button, #mark-read').forEach(node=>node.disabled=true);
    }
  }

  function bindWorkspace() {
    if (apiMode !== 'api') return;
    qs('#invite-form')?.addEventListener('submit', async event=>{
      event.preventDefault(); const button=event.currentTarget.querySelector('button');button.disabled=true;
      try { const result=await apiRequest('/api/invitations',{method:'POST',body:{contact:qs('#invite-contact').value.trim()}});qs('#invite-output').textContent=`Kode: ${result.invitation.token}. Bagikan hanya kepada kontak yang diundang. Kedaluwarsa: ${formatTime(result.invitation.expires_at)}.`; }
      catch(error){toast(error.message,'warning');} finally {button.disabled=false;}
    });
    qs('#accept-invite-form')?.addEventListener('submit',async event=>{
      event.preventDefault();const button=event.currentTarget.querySelector('button');button.disabled=true;
      try { const result=await apiRequest('/api/invitations/accept',{method:'POST',body:{token:qs('#invite-token').value.trim()}});applyServerUser(result.user);await syncApiData();render(); }
      catch(error){toast(error.message,'warning');} finally{button.disabled=false;}
    });
    const container=qs('#workspace-members');
    apiRequest('/api/workspace').then(result=>{
      if(!container?.isConnected)return;
      container.innerHTML=`<h3>Anggota ruang</h3>${result.members.map(member=>`<p>${escapeHtml(member.name)} — ${escapeHtml(member.role)} ${state.user.accessRole==='admin' && member.id!==state.user.id ? `<button class="btn btn-sm" data-revoke-member="${member.id}">Cabut akses</button>`:''}</p>`).join('')}`;
      qsa('[data-revoke-member]',container).forEach(button=>button.addEventListener('click',()=>showModal({title:'Cabut akses viewer?',body:'Anggota tidak lagi dapat membaca data ruang ini.',onConfirm:async()=>{await apiRequest(`/api/workspace/members/${button.dataset.revokeMember}`,{method:'DELETE'});render();}})));
    }).catch(error=>{if(container?.isConnected)container.textContent=error.message;});
  }

  function settingsPage() {
    const t = state.thresholds;
    return appShell('settings', `<div class="page-heading"><p class="eyebrow">Konfigurasi sistem</p><h1>Pengaturan</h1><p>Atur ambang kualitas air dan identitas perangkat.</p></div><div class="content-grid"><section class="settings-card neu-card col-7"><h2>${icon('gauge')} Ambang Batas Kualitas Air</h2><form class="settings-form" id="threshold-form"><div class="threshold-row"><div><label for="parameter-ph">Parameter</label><input class="form-control" id="parameter-ph" value="pH Air" readonly></div><div><label for="ph-min">Minimum</label><input class="form-control" id="ph-min" type="number" step="0.1" value="${t.phMin}" required></div><div><label for="ph-max">Maksimum</label><input class="form-control" id="ph-max" type="number" step="0.1" value="${t.phMax}" required></div></div><div class="threshold-row"><div><label for="parameter-temperature">Parameter</label><input class="form-control" id="parameter-temperature" value="Suhu Air (°C)" readonly></div><div><label for="temp-min">Minimum</label><input class="form-control" id="temp-min" type="number" step="0.1" value="${t.tempMin}" required></div><div><label for="temp-max">Maksimum</label><input class="form-control" id="temp-max" type="number" step="0.1" value="${t.tempMax}" required></div></div><div class="threshold-row"><div><label for="parameter-turbidity">Parameter</label><input class="form-control" id="parameter-turbidity" value="Kekeruhan (NTU)" readonly></div><div class="threshold-wide"><label for="turbidity-max">Batas maksimum</label><input class="form-control" id="turbidity-max" type="number" step="1" value="${t.turbidityMax}" required></div></div><p class="form-help">Perubahan threshold memengaruhi status kartu sensor dan peringatan. Bukan pemicu otomatis feeder.</p><button class="btn btn-primary" type="submit">${icon('check','icon-sm')} Simpan Threshold</button></form></section><aside class="settings-card neu-card col-5"><h2>${icon('server')} Informasi Sistem</h2><div class="info-list"><div class="info-row"><span>Versi aplikasi</span><b>AquaSmart v1.0 Prototype</b></div><div class="info-row"><span>Mode data</span><b>${connectionLabel()}</b></div><div class="info-row"><span>Interval pembaruan dashboard</span><b>${apiMode==='api'?'15 detik':'5 detik (demo)'}</b></div><div class="info-row"><span>Transport target</span><b>REST HTTPS/JSON</b></div><div class="info-row"><span>PWA</span><b>${navigator.serviceWorker?.controller?'Shell offline tersedia':'Menunggu service worker'}</b></div></div><div class="warning-box system-note">${icon('alert','icon-sm')}<span>Prototype ini tidak mengirim perintah ke hardware sungguhan. Integrasi produksi wajib memakai backend tervalidasi dan autentikasi aman.</span></div></aside><section class="settings-card neu-card col-12"><h2>${icon('wifi')} Perangkat Terdaftar</h2><div class="table-wrap"><table><thead><tr><th>Device ID</th><th>Nama</th><th>Lokasi</th><th>Status</th><th>Sinyal</th></tr></thead><tbody>${state.devices.map(d => `<tr><td>${escapeHtml(d.id)}</td><td>${escapeHtml(d.name)}</td><td>${escapeHtml(d.location)}</td><td><span class="badge">${d.online ? 'Online' : 'Offline'}</span></td><td>Belum diukur</td></tr>`).join('')}</tbody></table></div></section>${workspacePanel()}</div>`);
  }

  function profilePage() {
    return appShell('profile', `<div class="page-heading"><p class="eyebrow">Akun pengguna</p><h1>Profil Saya</h1><p>Informasi pengguna prototype AquaSmart.</p></div><div class="content-grid"><section class="profile-hero neu-card col-5"><div class="profile-avatar">${initials(state.user.name)}</div><h2>${escapeHtml(state.user.name)}</h2><p>${escapeHtml(state.user.role)}</p><button class="btn btn-primary" id="edit-profile">${icon('edit','icon-sm')} Edit Profil</button></section><section class="settings-card neu-card col-7"><h2>${icon('user')} Informasi Akun</h2><div class="info-list"><div class="info-row"><span>Nama lengkap</span><b>${escapeHtml(state.user.name)}</b></div><div class="info-row"><span>Username</span><b>${escapeHtml(state.user.username)}</b></div><div class="info-row"><span>Nomor telepon</span><b>${escapeHtml(state.user.phone)}</b></div><div class="info-row"><span>Role</span><b>${escapeHtml(state.user.role)}</b></div><div class="info-row"><span>Perangkat dikelola</span><b>${state.devices.length} perangkat</b></div><div class="info-row"><span>Password</span><b>••••••••••••</b></div></div></section></div>`);
  }

  function render() {
    clearRuntime();
    const current = route();
    const protectedRoutes = ['dashboard', 'alerts', 'reports', 'settings', 'profile'];
    if (protectedRoutes.includes(current) && !isAuthed()) { navigate('login'); return; }
    if ((current === 'login' || current === 'register') && isAuthed()) { navigate('dashboard'); return; }

    if (current === 'home') app.innerHTML = landingPage();
    else if (current === 'login') app.innerHTML = loginPage();
    else if (current === 'register') app.innerHTML = registerPage();
    else if (current === 'dashboard') app.innerHTML = dashboardPage();
    else if (current === 'alerts') app.innerHTML = alertsPage();
    else if (current === 'reports') app.innerHTML = reportsPage();
    else if (current === 'settings') app.innerHTML = settingsPage();
    else if (current === 'profile') app.innerHTML = profilePage();
    else { navigate('home'); return; }

    document.title = current === 'home' ? 'AquaSmart AIoT' : `${pageMeta[current]?.[0] || 'AquaSmart'} — AquaSmart`;
    bindCommon();
    if (current === 'home') window.AquaSmartExperience?.initLanding?.();
    if (current === 'login') bindLogin();
    if (current === 'register') bindRegister();
    if (current === 'dashboard') bindDashboard();
    if (current === 'alerts') bindAlerts();
    if (current === 'reports') { bindReports(); bindOperationsPanels(); }
    if (current === 'settings') bindSettings();
    if (current === 'profile') bindProfile();
    if (current === 'settings') bindWorkspace();
    applyReadOnlyAccess();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function clearRuntime() {
    commonCleanup?.();
    commonCleanup = null;
    window.AquaSmartExperience?.teardown?.();
    if (simulationTimer) clearInterval(simulationTimer);
    simulationTimer = null;
    if (resizeHandler) window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
    modalRoot.innerHTML = '';
    app.removeAttribute('aria-hidden');
    app.removeAttribute('inert');
  }

  function bindCommon() {
    const sidebarEl = qs('#sidebar');
    const overlay = qs('#drawer-overlay');
    const trigger = qs('#open-sidebar');
    const events = new AbortController();
    const background = [qs('.app-topbar'), qs('#main-content'), qs('.skip-link')].filter(Boolean);
    let previousInert = [];
    if (sidebarEl) {
      sidebarEl.inert = true;
      sidebarEl.setAttribute('aria-hidden', 'true');
      sidebarEl.setAttribute('role', 'dialog');
      sidebarEl.setAttribute('aria-modal', 'true');
    }
    trigger?.setAttribute('aria-controls', 'sidebar');
    trigger?.setAttribute('aria-expanded', 'false');
    const open = () => {
      if (!sidebarEl || sidebarEl.classList.contains('open')) return;
      previousInert = background.map(node => node.inert);
      sidebarEl.inert = false;
      sidebarEl.removeAttribute('aria-hidden');
      sidebarEl.classList.add('open');
      overlay?.classList.add('open');
      trigger?.setAttribute('aria-expanded', 'true');
      qs('#close-sidebar')?.focus({ preventScroll: true });
      background.forEach(node => { node.inert = true; });
    };
    const close = (restoreFocus = true) => {
      if (!sidebarEl?.classList.contains('open')) return;
      background.forEach((node, index) => { node.inert = previousInert[index]; });
      sidebarEl.classList.remove('open');
      overlay?.classList.remove('open');
      trigger?.setAttribute('aria-expanded', 'false');
      if (restoreFocus) trigger?.focus({ preventScroll: true });
      sidebarEl.inert = true;
      sidebarEl.setAttribute('aria-hidden', 'true');
    };
    trigger?.addEventListener('click', open);
    qs('#close-sidebar')?.addEventListener('click', () => close());
    overlay?.addEventListener('click', () => close());
    qsa('a[href^="#/"]', sidebarEl || app).forEach(link => link.addEventListener('click', () => close()));
    document.addEventListener('keydown', event => {
      if (!sidebarEl?.classList.contains('open') || modalRoot.childElementCount) return;
      if (event.key === 'Escape') { event.preventDefault(); close(); return; }
      if (event.key !== 'Tab') return;
      const controls = qsa('a[href], button:not([disabled]), [tabindex="0"]', sidebarEl)
        .filter(node => node.getClientRects().length && !node.closest('[inert]'));
      const first = controls[0], last = controls[controls.length - 1];
      if (!first) return;
      const outside = !sidebarEl.contains(document.activeElement);
      if (outside || (event.shiftKey ? document.activeElement === first : document.activeElement === last)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    }, { signal: events.signal });
    commonCleanup = () => { close(false); events.abort(); };
    qsa('[data-scroll]').forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      qs(`#${link.dataset.scroll}`)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    }));
    qs('#logout-button')?.addEventListener('click', () => showModal({
      title: 'Keluar dari dashboard?',
      body: apiMode === 'api' ? 'Sesi server di perangkat ini akan diakhiri.' : 'Sesi demo di browser ini akan diakhiri.',
      confirmText: 'Ya, keluar',
      danger: true,
      onConfirm: async () => {
        try {
          if (apiMode === 'api') await apiRequest('/api/auth/logout', { method: 'POST', body: {} });
          authenticated = false;
          csrfToken = '';
          sessionStorage.removeItem(SESSION_KEY);
          toast('Anda berhasil keluar.', 'success');
          navigate('home');
        } catch (error) {
          toast(error.message || 'Logout gagal. Coba lagi.', 'warning');
        }
      }
    }));
  }

  function bindLogin() {
    const form = qs('#login-form');
    const password = qs('#password');
    qs('#toggle-password')?.addEventListener('click', event => {
      password.type = password.type === 'password' ? 'text' : 'password';
      event.currentTarget.setAttribute('aria-label', password.type === 'password' ? 'Tampilkan password' : 'Sembunyikan password');
    });
    qs('#demo-mode-button')?.addEventListener('click', () => {
      authenticated = true;
      sessionStorage.setItem(SESSION_KEY, 'true');
      toast('Mode demo browser diaktifkan.', 'warning');
      navigate('dashboard');
    });
    form?.addEventListener('submit', async event => {
      event.preventDefault();
      const data = new FormData(form);
      const submit = form.querySelector('[type="submit"]');
      const username = data.get('username')?.trim() || '';
      const passwordValue = data.get('password') || '';
      const errorNode = qs('#login-error');
      errorNode.classList.remove('show');

      if (apiMode !== 'api') {
        errorNode.textContent = 'Backend tidak tersedia. Gunakan tombol Mode Demo di bawah formulir.';
        errorNode.classList.add('show');
        qs('#demo-mode-button')?.focus();
        return;
      }

      submit.disabled = true;
      try {
        const payload = await apiRequest('/api/auth/login', {
          method: 'POST',
          body: { username, password: passwordValue }
        });
        authenticated = true;
        csrfToken = payload.csrf_token || '';
        applyServerUser(payload.user);
        sessionStorage.setItem(SESSION_KEY, 'true');
        await syncApiData();
        toast('Login berhasil melalui API lokal.', 'success');
        navigate('dashboard');
      } catch (error) {
        if (error instanceof ApiUnavailableError) {
          useDemoMode();
          toast('API terputus. Pilih Mode Demo bila ingin melanjutkan tanpa server.', 'warning');
          render();
          return;
        }
        errorNode.textContent = error.message || 'Login gagal. Coba lagi.';
        errorNode.classList.add('show');
        password.focus();
      } finally {
        submit.disabled = false;
      }
    });
  }

  function bindRegister() {
    const form = qs('#register-form');
    if (!form) return;

    qsa('[data-toggle-password]', form).forEach(button => button.addEventListener('click', () => {
      const input = qs(`#${button.dataset.togglePassword}`, form);
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
      button.setAttribute('aria-label', input.type === 'password' ? 'Tampilkan password' : 'Sembunyikan password');
    }));

    const fields = {
      name: qs('#register-name', form),
      contact: qs('#register-contact', form),
      password: qs('#register-password', form),
      confirmation: qs('#register-password-confirmation', form),
      serial: qs('#register-serial', form)
    };
    const errors = {
      name: qs('#register-name-error', form),
      contact: qs('#register-contact-error', form),
      password: qs('#register-password-error', form),
      confirmation: qs('#register-confirmation-error', form)
    };
    const setInvalid = (key, invalid) => {
      fields[key].setAttribute('aria-invalid', String(invalid));
      errors[key].classList.toggle('show', invalid);
      return invalid;
    };
    const validContact = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      || /^08\d{8,13}$/.test(value.replace(/[\s-]/g, ''));
    const validate = () => {
      const nameInvalid = setInvalid('name', !fields.name.value.trim() || [...fields.name.value].length > 100);
      const contactInvalid = setInvalid('contact', !validContact(fields.contact.value.trim()));
      const passwordInvalid = setInvalid('password', fields.password.value.length < 8 || new TextEncoder().encode(fields.password.value).length > 1024);
      const confirmationInvalid = setInvalid('confirmation', fields.confirmation.value !== fields.password.value);
      return !(nameInvalid || contactInvalid || passwordInvalid || confirmationInvalid);
    };

    ['name', 'contact', 'password', 'confirmation'].forEach(key => fields[key].addEventListener('blur', validate));
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const globalError = qs('#register-error', form);
      globalError.classList.remove('show');
      if (!validate()) {
        form.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }
      if (apiMode !== 'api') {
        globalError.textContent = 'Backend tidak tersedia. Jalankan server lokal untuk membuat akun.';
        globalError.classList.add('show');
        return;
      }

      const submit = form.querySelector('[type="submit"]');
      submit.disabled = true;
      try {
        const payload = await apiRequest('/api/auth/register', {
          method: 'POST',
          body: {
            name: fields.name.value.trim(),
            contact: fields.contact.value.trim(),
            password: fields.password.value,
            password_confirmation: fields.confirmation.value,
            serial_number: fields.serial.value.trim()
          }
        });
        authenticated = true;
        csrfToken = payload.csrf_token || '';
        applyServerUser(payload.user);
        sessionStorage.setItem(SESSION_KEY, 'true');
        await syncApiData();
        toast('Akun berhasil dibuat.', 'success');
        navigate('dashboard');
      } catch (error) {
        globalError.textContent = error.message || 'Akun belum dapat dibuat. Periksa data lalu coba lagi.';
        globalError.classList.add('show');
        if (error instanceof ApiUnavailableError) apiMode = 'demo';
      } finally {
        submit.disabled = false;
      }
    });
  }

  function bindDashboard() {
    if (!currentDevice()) return;
    
    // Bind demo button on dashboard
    const demoBtn = qs('.demo-dashboard-btn');
    if (demoBtn) {
      demoBtn.addEventListener('click', () => window.AquaSmartExperience?.openDemo(demoBtn));
    }
    
    qsa('[data-device]').forEach(button => button.addEventListener('click', async () => {
      state.activeDevice = Number(button.dataset.device);
      saveState();
      if (apiMode === 'api') {
        try {
          await syncCurrentDeviceData();
        } catch (error) {
          toast(error.message || 'Data perangkat gagal dimuat.', 'warning');
        }
      }
      render();
    }));
    qsa('[data-control]').forEach(input => input.addEventListener('change', async () => {
      const device = currentDevice();
      const actuator = input.dataset.control;
      const nextValue = input.checked;
      const previousValue = device[actuator];
      input.disabled = true;
      try {
        if (apiMode === 'api') {
          const payload = await apiRequest(`/api/devices/${encodeURIComponent(device.id)}/control`, {
            method: 'POST',
            body: { actuator, value: nextValue }
          });
          const index = state.devices.findIndex(item => item.id === payload.device.id);
          if (index >= 0) state.devices[index] = mapServerDevice(payload.device);
        } else {
          device[actuator] = nextValue;
        }
        saveState();
        const status = qs(`#${actuator}-status`);
        if (status) status.textContent = `${apiMode==='api'?'Permintaan':'Status'}: ${nextValue ? 'Aktif' : 'Nonaktif'}`;
        toast(apiMode==='api' ? 'Permintaan tersimpan; status eksekusi simulator ada di Laporan.' : `${actuator === 'aerator' ? 'Aerator' : 'Mode otomatis'} ${nextValue ? 'diaktifkan' : 'dinonaktifkan'}.`, 'success');
      } catch (error) {
        input.checked = previousValue;
        toast(error.message || 'Kontrol perangkat gagal.', 'warning');
      } finally {
        input.disabled = false;
      }
    }));
    qs('#feed-now')?.addEventListener('click', () => showModal({ title: 'Jalankan feeder?', body: `Antrekan simulasi feeder ${escapeHtml(currentDevice().name)} berdurasi 8 detik. Perintah bukan bukti eksekusi hardware.`, confirmText: 'Beri pakan', onConfirm: runFeeder }));
    qs('#schedule-form')?.addEventListener('submit', async event => {
      event.preventDefault();
      const time = qs('#schedule-time').value;
      const duration = Math.min(30, Math.max(1, Number(qs('#schedule-duration').value)));
      const days = qs('#schedule-days').value;
      const submit = event.currentTarget.querySelector('[type="submit"]');
      submit.disabled = true;
      try {
        if (apiMode === 'api') {
          const payload = await apiRequest(`/api/devices/${encodeURIComponent(currentDevice().id)}/schedules`, {
            method: 'POST',
            body: { time, duration, days }
          });
          state.schedules.push(payload.schedule);
        } else {
          state.schedules.push({ id: Date.now(), time, duration, days, active: true });
        }
        saveState();
        toast('Jadwal pakan berhasil ditambahkan.', 'success');
        render();
      } catch (error) {
        toast(error.message || 'Jadwal gagal ditambahkan.', 'warning');
        submit.disabled = false;
      }
    });
    qsa('[data-delete-schedule]').forEach(button => button.addEventListener('click', () => showModal({
      title: 'Hapus jadwal?',
      body: 'Jadwal pakan ini akan dihapus dari prototype.',
      confirmText: 'Hapus',
      danger: true,
      onConfirm: async () => {
        const scheduleId = Number(button.dataset.deleteSchedule);
        try {
          if (apiMode === 'api') await apiRequest(`/api/schedules/${scheduleId}`, { method: 'DELETE', body: {} });
          state.schedules = state.schedules.filter(s => s.id !== scheduleId);
          saveState();
          toast('Jadwal berhasil dihapus.', 'success');
          render();
        } catch (error) {
          toast(error.message || 'Jadwal gagal dihapus.', 'warning');
        }
      }
    })));
    drawChart();
    resizeHandler = () => drawChart();
    window.addEventListener('resize', resizeHandler);
    simulationTimer = apiMode === 'api'
      ? setInterval(refreshDashboardData, 15000)
      : setInterval(simulateReading, 5000);
  }

  async function runFeeder() {
    const device = currentDevice();
    const status = qs('#feeder-status');
    try {
      if (apiMode === 'api') {
        const payload = await apiRequest(`/api/devices/${encodeURIComponent(device.id)}/control`, {
          method: 'POST',
          body: { actuator: 'feeder', value: true, duration: 8, request_id: crypto.randomUUID() }
        });
        const index = state.devices.findIndex(item => item.id === payload.device.id);
        if (index >= 0) state.devices[index] = mapServerDevice(payload.device);
        if (status) status.textContent = 'Menunggu simulator';
        toast('Perintah diantrekan. Periksa hasil simulator di Laporan; belum ada bukti hardware.');
        return;
      } else {
        device.feeder = true;
      }
      saveState();
      if (status) status.textContent = 'Aktif';
      toast('Feeder aktif selama 8 detik.', 'success');

      setTimeout(async () => {
        try {
          if (apiMode === 'api' && authenticated) {
            const payload = await apiRequest(`/api/devices/${encodeURIComponent(device.id)}/control`, {
              method: 'POST',
              body: { actuator: 'feeder', value: false }
            });
            const index = state.devices.findIndex(item => item.id === payload.device.id);
            if (index >= 0) state.devices[index] = mapServerDevice(payload.device);
          } else {
            device.feeder = false;
          }
          saveState();
          if (qs('#feeder-status')) qs('#feeder-status').textContent = 'Siap';
        } catch (_) {
          toast('Feeder perlu dimatikan manual karena sinkronisasi gagal.', 'warning');
        }
      }, 8000);
    } catch (error) {
      toast(error.message || 'Feeder gagal dijalankan.', 'warning');
    }
  }

  async function refreshDashboardData() {
    if (route() !== 'dashboard' || apiMode !== 'api' || !authenticated) return;
    try {
      await syncApiData();
      if (route() !== 'dashboard') return;
      updateLiveReadout();
      drawChart();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        authenticated = false;
        sessionStorage.removeItem(SESSION_KEY);
        navigate('login');
        return;
      }
      toast('Sinkronisasi data tertunda.', 'warning');
    }
  }

  function updateLiveReadout() {
    const d = currentDevice();
    if (!d) { render(); return; }
    for (const [kind, value, decimals, unit] of [['ph', d.ph, 1, 'pH'], ['temp', d.temp, 1, '°C'], ['turbidity', d.turbidity, 0, 'NTU']]) {
      const node = qs(`[data-live-value="${kind}"]`);
      if (!node) continue;
      node.innerHTML = `${sensorNumber(value, decimals)}<small>${unit}</small>`;
      const status = node.closest('.metric-card').querySelector('.metric-status');
      const [label, cls] = readingStatus(kind, value);
      status.textContent = label; status.className = `metric-status ${cls}`;
    }
    if (qs('#quality-summary')) qs('#quality-summary').innerHTML = qualitySummary(d);
    if (qs('#quality-recommendations')) qs('#quality-recommendations').innerHTML = qualityRecommendations(d);
    if (qs('#last-updated')) qs('#last-updated').textContent = d.lastSeen ? formatTime(d.lastSeen) : 'belum tersedia';
    if (qs('#data-source-copy')) qs('#data-source-copy').textContent = dataModeCopy();
    const deviceStatus = qs('.metric-device .metric-status');
    if (deviceStatus) {
      deviceStatus.textContent = d.online ? 'Online' : 'Offline';
      deviceStatus.className = 'metric-status ' + (d.online ? 'text-success' : 'text-danger');
      qs('.metric-value-device').textContent = d.online ? 'Terhubung' : 'Terputus';
    }
    updateAlertCount();
  }

  function updateAlertCount() {
    const link = qs('.sidebar-nav a[href="#/alerts"]');
    if (!link) return;
    let badge = qs('.nav-count', link);
    const unread = state.alerts.filter(alert=>!alert.read).length;
    if (!badge && unread) {
      badge = document.createElement('span'); badge.className = 'nav-count'; link.append(badge);
    }
    if (badge) { badge.textContent = String(unread); badge.hidden = unread === 0; }
  }

  function simulateReading() {
    if (route() !== 'dashboard') return;
    const d = currentDevice();
    d.ph = clamp(d.ph + random(-.04, .04), 6.4, 8.7);
    d.temp = clamp(d.temp + random(-.15, .15), 24.5, 31);
    d.turbidity = clamp(d.turbidity + random(-1.8, 1.8), 24, 58);
    const reading = { time: new Date().toISOString(), ph: +d.ph.toFixed(2), temp: +d.temp.toFixed(1), turbidity: Math.round(d.turbidity) };
    state.readings.push(reading); if (state.readings.length > 36) state.readings.shift(); saveState();
    d.lastSeen = reading.time;
    updateLiveReadout();
    drawChart();
  }

  function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
  function random(min, max) { return Math.random() * (max - min) + min; }

  function drawChart() {
    const canvas = qs('#history-chart'); if (!canvas) return;
    const rect = canvas.getBoundingClientRect(); if (rect.width < 10) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * dpr); canvas.height = Math.floor(rect.height * dpr);
    const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
    const width = rect.width; const height = rect.height; const pad = { l: 34, r: 17, t: 18, b: 28 };
    const cw = width - pad.l - pad.r; const ch = height - pad.t - pad.b;
    ctx.clearRect(0, 0, width, height);
    const designTokens = getComputedStyle(document.documentElement);
    const clearWater = designTokens.getPropertyValue('--clear-water').trim() || '#4C9A8E';
    const sediment = designTokens.getPropertyValue('--sediment').trim() || '#B9834F';
    const ink = designTokens.getPropertyValue('--ink').trim() || '#10262A';
    const foamLine = designTokens.getPropertyValue('--foam-line').trim() || '#D8E2DE';
    ctx.font = '10px "IBM Plex Mono", monospace';
    ctx.fillStyle = ink;
    ctx.strokeStyle = foamLine;
    ctx.globalAlpha = .72;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) { const y = pad.t + ch * i / 4; ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(width - pad.r, y); ctx.stroke(); ctx.fillText(String(100 - i * 25), 4, y + 3); }
    ctx.globalAlpha = 1;
    const rows = state.readings.slice(-18);
    if (rows.length < 2) return;
    const datasets = [
      { key: 'ph', color: clearWater, dash: [], normalize: v => (v - 6) / 3 },
      { key: 'temp', color: clearWater, dash: [5, 4], normalize: v => (v - 22) / 12 },
      { key: 'turbidity', color: sediment, dash: [], normalize: v => v / 100 }
    ];
    datasets.forEach(set => {
      ctx.beginPath(); ctx.lineWidth = 2.4; ctx.strokeStyle = set.color; ctx.setLineDash(set.dash); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      rows.forEach((row, i) => { const x = pad.l + i * cw / (rows.length - 1); const y = pad.t + ch - clamp(set.normalize(Number(row[set.key])), 0, 1) * ch; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.fillStyle = ink; const ticks = [0, Math.floor((rows.length - 1) / 2), rows.length - 1]; ticks.forEach(i => { const x = pad.l + i * cw / (rows.length - 1); const label = new Date(rows[i].time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }); ctx.fillText(label, x - 14, height - 7); });
  }

  function bindAlerts() {
    if (apiMode === 'api') {
      const list = qs('.alert-list');
      list.insertAdjacentHTML('beforebegin', '<p id="alert-sync-status" class="col-12" role="status"></p>');
      const refresh = async () => {
        try {
          const payload = await apiRequest('/api/alerts?limit=50');
          if (route() !== 'alerts' || !list.isConnected) return;
          state.alerts = payload.alerts.map(mapServerAlert);
          updateAlertCount();
          const markup = new DOMParser().parseFromString(alertsPage(), 'text/html');
          list.innerHTML = markup.querySelector('.alert-list').innerHTML || '<p>Belum ada peringatan.</p>';
          qs('#alert-sync-status').textContent = '';
        } catch (error) {
          if (route() === 'alerts' && qs('#alert-sync-status')) qs('#alert-sync-status').textContent = 'Pembaruan tertunda. Data yang tampil adalah hasil sinkronisasi terakhir.';
        }
      };
      refresh();
      simulationTimer = setInterval(refresh, 15000);
    }
    qs('#mark-read')?.addEventListener('click', async event => {
      const unread = state.alerts.filter(alert => !alert.read);
      if (!unread.length) {
        toast('Semua peringatan sudah dibaca.');
        return;
      }
      const button = event.currentTarget;
      button.disabled = true;
      try {
        if (apiMode === 'api') {
          await Promise.all(unread.map(alert => apiRequest(`/api/alerts/${alert.id}/acknowledge`, {
            method: 'PATCH',
            body: {}
          })));
        }
        state.alerts.forEach(alert => { alert.read = true; });
        saveState();
        toast('Semua peringatan ditandai dibaca.', 'success');
        render();
      } catch (error) {
        button.disabled = false;
        toast(error.message || 'Peringatan gagal diperbarui.', 'warning');
      }
    });
  }

  function bindReports() {
    loadDiagnostics();
    qs('#filtered-export-form')?.addEventListener('submit', async event => {
      event.preventDefault();
      const form = event.currentTarget, output = qs('#filtered-export-status');
      const query = new URLSearchParams(new FormData(form));
      const controls = [...form.elements], focused = document.activeElement;
      controls.forEach(control => { control.disabled = true; });
      output.textContent = 'Menyiapkan berkas ekspor…';
      output.setAttribute('aria-busy','true');
      try {
        const response = await fetch('/api/export?' + query, { credentials:'same-origin', cache:'no-store', signal:AbortSignal.timeout(20000) });
        if (!response.ok) {
          const detail = await response.json().catch(() => null);
          throw new Error(detail?.error?.message || 'Server tidak dapat menyiapkan ekspor.');
        }
        const blob = await response.blob();
        if (!form.isConnected) return;
        const url = URL.createObjectURL(blob), link = document.createElement('a');
        link.href = url;
        link.download = `aquasmart-${query.get('device_id')}-${query.get('kind')}-${query.get('period')}-${query.get('date')}.${query.get('format')}`;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        output.textContent = response.headers.get('X-Export-Rows') === '0'
          ? 'Periode kosong. Berkas berisi struktur kolom atau metadata tanpa data buatan.'
          : 'Berkas siap; unduhan telah dimulai. Semua waktu menggunakan UTC.';
      } catch (error) {
        if (form.isConnected) output.textContent = 'Ekspor gagal: ' + error.message + ' Silakan coba lagi.';
      } finally {
        controls.forEach(control => { control.disabled = false; });
        output.setAttribute('aria-busy','false');
        if (form.isConnected && document.activeElement === document.body) focused?.focus();
      }
    });
    qs('#calendar-form')?.addEventListener('submit', async event => {
      event.preventDefault();
      const form = event.currentTarget;
      const results = qs('#calendar-results');
      const query = new URLSearchParams({ device_id: qs('#calendar-device').value, date: qs('#calendar-date').value, period: qs('#calendar-period').value });
      const controls = [...form.elements];
      const focused = document.activeElement;
      controls.forEach(control => { control.disabled = true; });
      results.setAttribute('aria-busy', 'true');
      results.textContent = 'Memuat laporan kalender UTC…';
      try {
        const report = await apiRequest('/api/reports?' + query);
        if (form.isConnected) results.innerHTML = calendarResults(report);
      } catch (error) {
        if (form.isConnected) results.textContent = 'Laporan gagal dimuat: ' + error.message + ' Silakan coba lagi.';
      } finally {
        controls.forEach(control => { control.disabled = false; });
        results.setAttribute('aria-busy', 'false');
        if (form.isConnected && (document.activeElement === document.body || document.activeElement === focused)) focused?.focus();
      }
    });
    qs('#calendar-form')?.addEventListener('input', () => {
      qs('#calendar-results').textContent = 'Filter berubah. Tampilkan laporan untuk periode yang dipilih.';
    });
    qs('#export-csv')?.addEventListener('click', exportCsv);
    qs('#report-limit')?.addEventListener('change', event => { state.reportLimit = Number(event.target.value); render(); });
    qs('#report-device')?.addEventListener('change', async event => {
      const select = event.target;
      const previous = state.activeDevice;
      select.disabled = true;
      try {
        state.activeDevice = Number(select.value);
        if (apiMode === 'api') await syncCurrentDeviceData();
        saveState(); render();
      } catch (error) {
        state.activeDevice = previous; select.value = String(previous);
        toast(error.message || 'Data perangkat gagal dimuat.', 'warning');
      } finally { select.disabled = false; }
    });
  }
  function exportCsv() {
    const device = currentDevice();
    if (!device) { toast('Hubungkan perangkat sebelum mengekspor data.', 'warning'); return; }
    const header = 'waktu,device_id,ph,suhu_c,kekeruhan_ntu,simulation,provenance,source_simulation,source_device,source_manual,source_seed,source_legacy_unverified\n';
    const body = state.readings.map(r => [r.time, device.id, r.ph, r.temp, r.turbidity, r.simulation || apiMode !== 'api',rowSource(r),...Object.keys(sourceNames).map(source=>state.readings.filter(row=>rowSource(row)===source).length)].join(',')).join('\n');
    const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `aquasmart-${new Date().toISOString().slice(0,10)}.csv`; link.click(); URL.revokeObjectURL(url); toast('Laporan CSV berhasil dibuat.', 'success');
  }

  function bindSettings() {
    bindDeviceManagement();
    qs('#threshold-form')?.addEventListener('submit', async event => {
      event.preventDefault();
      const values = { phMin: Number(qs('#ph-min').value), phMax: Number(qs('#ph-max').value), tempMin: Number(qs('#temp-min').value), tempMax: Number(qs('#temp-max').value), turbidityMax: Number(qs('#turbidity-max').value) };
      if (values.phMin >= values.phMax || values.tempMin >= values.tempMax) { toast('Nilai minimum harus lebih kecil dari maksimum.', 'warning'); return; }
      const submit = event.currentTarget.querySelector('[type="submit"]');
      submit.disabled = true;
      try {
        if (apiMode === 'api') {
          await apiRequest('/api/settings/thresholds', { method: 'PATCH', body: { ph_min: values.phMin, ph_max: values.phMax, temperature_min: values.tempMin, temperature_max: values.tempMax, turbidity_max: values.turbidityMax } });
        }
        state.thresholds = values; saveState(); toast('Threshold berhasil disimpan.', 'success'); render();
      } catch (error) {
        toast(error.message || 'Threshold gagal disimpan. Coba lagi.', 'warning');
      } finally {
        submit.disabled = false;
      }
    });
  }

  function bindDeviceManagement() {
    if (apiMode !== 'api') return;
    const container = qs('#threshold-form')?.closest('.content-grid');
    if (!container) return;
    if (state.user.accessRole !== 'admin') {
      container.insertAdjacentHTML('beforeend', '<section class="settings-card neu-card col-12"><h2>Kelola Perangkat</h2><p>Viewer memiliki akses baca. Hubungi admin untuk klaim perangkat, perubahan identitas, atau penggantian key.</p></section>');
      return;
    }
    const device = currentDevice();
    container.insertAdjacentHTML('beforeend', `<section class="settings-card neu-card col-12"><h2>Kelola Perangkat</h2>
      <form id="claim-device-form" class="settings-form"><label for="claim-serial">Serial perangkat tersedia</label><input class="form-control" id="claim-serial" maxlength="128" pattern="[A-Za-z0-9_-]+" required autocomplete="off"><button class="btn" type="submit">Klaim Perangkat</button></form>
      ${device ? `<form id="edit-device-form" class="settings-form"><label for="edit-device-id">Perangkat yang diubah</label><select class="form-control" id="edit-device-id">${state.devices.map(d=>`<option value="${escapeHtml(d.id)}" ${d.id===device.id?'selected':''}>${escapeHtml(d.name)}</option>`).join('')}</select><label for="device-name">Nama perangkat</label><input class="form-control" id="device-name" value="${escapeHtml(device.name)}" required maxlength="100"><label for="device-location">Lokasi</label><input class="form-control" id="device-location" value="${escapeHtml(device.location)}" required maxlength="150"><button class="btn" type="submit">Simpan Perangkat</button></form><p>Penggantian key langsung membatalkan key lama. Salin key baru ke simulator/perangkat; key tidak disimpan di browser dan hanya ditampilkan pada hasil ini.</p><button class="btn" id="rotate-device-key" type="button">Ganti Key Perangkat Terpilih</button><output id="device-key-output" class="form-help" aria-live="polite"></output>` : '<p>Belum ada perangkat. Klaim serial yang disediakan admin instalasi.</p>'}
      <p id="device-management-status" role="status"></p></section>`);
    const status = qs('#device-management-status');
    qs('#claim-device-form').addEventListener('submit', async event => {
      event.preventDefault();
      const button = event.currentTarget.querySelector('button');
      button.disabled = true; status.textContent = 'Mengklaim perangkat…';
      try {
        await apiRequest('/api/devices', {method:'POST',body:{serial_number:qs('#claim-serial').value.trim()}});
        await syncApiData(); render(); toast('Perangkat berhasil diklaim.', 'success');
      } catch (error) { status.textContent = error.message || 'Klaim gagal. Coba lagi.'; }
      finally { button.disabled = false; }
    });
    qs('#edit-device-id')?.addEventListener('change', event => {
      const selected = state.devices.find(d=>d.id===event.target.value);
      qs('#device-name').value = selected.name; qs('#device-location').value = selected.location;
      qs('#device-key-output').textContent = ''; status.textContent = '';
    });
    qs('#edit-device-form')?.addEventListener('submit', async event => {
      event.preventDefault();
      const button = event.currentTarget.querySelector('button');
      button.disabled = true; status.textContent = 'Menyimpan identitas perangkat…';
      try {
        await apiRequest('/api/devices/' + encodeURIComponent(qs('#edit-device-id').value), {method:'PATCH',body:{name:qs('#device-name').value.trim(),location:qs('#device-location').value.trim()}});
        await syncApiData(); render(); toast('Identitas perangkat disimpan.', 'success');
      } catch (error) { status.textContent = error.message || 'Perubahan gagal. Coba lagi.'; }
      finally { button.disabled = false; }
    });
    qs('#rotate-device-key')?.addEventListener('click', async event => {
      const button = event.currentTarget; button.disabled = true;
      const id = qs('#edit-device-id').value;
      qs('#device-key-output').textContent = ''; status.textContent = 'Mengganti key…';
      try {
        const result = await apiRequest('/api/devices/' + encodeURIComponent(id) + '/key', {method:'POST',body:{}});
        qs('#device-key-output').textContent = `${id}: ${result.device_key}`;
        status.textContent = result.notice;
      } catch (error) { status.textContent = error.message || 'Penggantian key gagal.'; }
      finally { button.disabled = false; }
    });
  }

  function bindProfile() {
    qs('#edit-profile')?.addEventListener('click', () => {
      const trigger = document.activeElement;
      app.setAttribute('aria-hidden', 'true');
      app.setAttribute('inert', '');
      modalRoot.innerHTML = `
        <div class="modal-backdrop" data-close-modal>
          <section class="modal-card neu-card" role="dialog" aria-modal="true" aria-labelledby="edit-title" data-modal-card>
            <h2 id="edit-title">Edit Profil</h2>
            <form class="settings-form profile-form" id="profile-form">
              <div><label for="edit-name">Nama lengkap</label><input class="form-control" id="edit-name" value="${escapeHtml(state.user.name)}" required></div>
              <div><label for="edit-phone">Nomor telepon</label><input class="form-control" id="edit-phone" value="${escapeHtml(state.user.phone)}" required></div>
              <div class="modal-actions">
                <button class="btn btn-sm" type="button" id="cancel-profile" data-close-modal>Batal</button>
                <button class="btn btn-primary btn-sm" type="submit">Simpan Perubahan</button>
              </div>
            </form>
          </section>
        </div>`;
      const dialog = modalRoot.querySelector('[data-modal-card]');
      const submitBtn = modalRoot.querySelector('[type="submit"]');
      const cancelBtn = modalRoot.querySelector('#cancel-profile');
      const editName = modalRoot.querySelector('#edit-name');

      function closeProfileModal() {
        modalRoot.removeEventListener('keydown', onProfileKeydown);
        modalRoot.innerHTML = '';
        app.removeAttribute('aria-hidden');
        app.removeAttribute('inert');
        trigger?.focus?.();
      }

      function onProfileKeydown(event) {
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          closeProfileModal();
          return;
        }
        if (event.key === 'Tab') {
          const focusables = qsa('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', dialog);
          if (!focusables.length) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }

      modalRoot.addEventListener('keydown', onProfileKeydown);
      editName?.focus();

      cancelBtn.addEventListener('click', closeProfileModal);
      qsa('[data-close-modal]', modalRoot).forEach(el => el.addEventListener('click', event => {
        if (event.target.closest('[data-modal-card]') && !event.target.matches('[data-close-modal]')) return;
        closeProfileModal();
      }));

      qs('#profile-form').addEventListener('submit', async event => {
        event.preventDefault();
        submitBtn.disabled = true;
        try {
          const name = qs('#edit-name').value.trim();
          const phone = qs('#edit-phone').value.trim();
          if (apiMode === 'api') await apiRequest('/api/profile', { method: 'PATCH', body: { name, phone } });
          state.user.name = name; state.user.phone = phone; saveState(); closeProfileModal(); toast('Profil berhasil diperbarui.', 'success'); render();
        } catch (_) {
          toast('Gagal memperbarui profil.', 'warning');
        } finally {
          submitBtn.disabled = false;
        }
      });
    });
  }

  document.querySelector('.skip-link')?.addEventListener('click', event => {
    const main = document.getElementById('main-content');
    if (!main) return;
    event.preventDefault(); // This anchor targets content, not a new SPA route.
    main.setAttribute('tabindex', '-1');
    main.focus({ preventScroll: true });
    main.scrollIntoView({ block: 'start', behavior: 'instant' });
  });
  window.addEventListener('hashchange', render);
  window.addEventListener('DOMContentLoaded', async () => {
    await restoreSession();
    if (apiMode === 'api' && authenticated) {
      try {
        await syncApiData();
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          authenticated = false;
          csrfToken = '';
          sessionStorage.removeItem(SESSION_KEY);
        } else {
          toast('Sebagian data belum dapat disinkronkan.', 'warning');
        }
      }
    }
    render();
    if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
})();
