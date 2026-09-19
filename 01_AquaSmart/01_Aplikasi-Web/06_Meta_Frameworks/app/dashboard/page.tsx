// app/dashboard/page.tsx - Main Dashboard Page (React Server Component)
// Modul 6 - Next.js App Router Implementation
// Demonstrates async/await data fetching without useState/useEffect

import { cookies } from "next/headers";
import Link from "next/link";

// Simulate server-side data fetching
async function fetchDashboardData() {
  // In production, this would be real API calls to backend
  // const response = await fetch('http://localhost:8080/api/dashboard-stats', {
  //   cache: 'no-store' // Revalidate on every request
  // });
  
  // Mock data for demonstration
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  
  return {
    totalDevices: 12,
    activeSensors: 45,
    alertsToday: 3,
    tasksPending: 7,
    avgTemperature: 28.5,
    avgPH: 7.2,
    avgTurbidity: 15.3,
    waterLevel: 78
  };
}

async function fetchRecentAlerts() {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      id: 1,
      type: "warning",
      message: "pH level berada di ambang batas atas (7.5)",
      timestamp: "10 menit yang lalu",
      severity: "medium"
    },
    {
      id: 2,
      type: "info",
      message: "Sensor turbidity melakukan kalibrasi otomatis",
      timestamp: "25 menit yang lalu",
      severity: "low"
    },
    {
      id: 3,
      type: "success",
      message: "Feed schedule berhasil dieksekusi",
      timestamp: "1 jam yang lalu",
      severity: "low"
    }
  ];
}

async function fetchSensorData() {
  // Simulate API call with caching strategy
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return [
    { deviceId: "DEV-001", name: "Tank A - pH Sensor", value: 7.2, unit: "pH", status: "active", lastUpdate: "2 menit lalu" },
    { deviceId: "DEV-002", name: "Tank A - Temperature", value: 28.5, unit: "°C", status: "active", lastUpdate: "2 menit lalu" },
    { deviceId: "DEV-003", name: "Tank A - Turbidity", value: 15.3, unit: "NTU", status: "active", lastUpdate: "3 menit lalu" },
    { deviceId: "DEV-004", name: "Tank B - pH Sensor", value: 6.9, unit: "pH", status: "active", lastUpdate: "2 menit lalu" },
    { deviceId: "DEV-005", name: "Tank B - Temperature", value: 27.8, unit: "°C", status: "maintenance", lastUpdate: "15 menit lalu" }
  ];
}

export default async function DashboardPage() {
  // Fetch all data in parallel for optimal performance
  const [dashboardStats, recentAlerts, sensorData] = await Promise.all([
    fetchDashboardData(),
    fetchRecentAlerts(),
    fetchSensorData()
  ]);

  // Get session info on server side
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            🌊 Dashboard AquaSmart AIoT
          </h1>
          <p className="text-slate-600">
            Monitoring kualitas air secara real-time untuk {dashboardStats.totalDevices} akuakultur
          </p>
        </div>
        
        {session && (
          <div className="text-right">
            <p className="text-sm text-slate-500">Connected as</p>
            <p className="font-semibold text-blue-600">{session.value}</p>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Devices" 
          value={dashboardStats.totalDevices} 
          icon="🔌"
          color="blue"
          description={`${dashboardStats.activeSensors} sensors aktif`}
        />
        
        <StatCard 
          title="Alert Hari Ini" 
          value={dashboardStats.alertsToday} 
          icon="🔔"
          color="red"
          description="Perlu perhatian segera"
        />
        
        <StatCard 
          title="Suhu Rata-rata" 
          value={`${dashboardStats.avgTemperature}°C`} 
          icon="🌡️"
          color="orange"
          description="Range optimal: 26-30°C"
        />
        
        <StatCard 
          title="pH Air" 
          value={dashboardStats.avgPH.toString()} 
          icon="💧"
          color="green"
          description={`Level: ${getPHLevel(dashboardStats.avgPH)}`}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sensor Data Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Data Sensor Terakhir
            </h2>
            
            <Link href="/dashboard/sensors" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Lihat Semua →
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Device</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Parameter</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Nilai</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Update</th>
                </tr>
              </thead>
              <tbody>
                {sensorData.map((sensor, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-sm">
                      <span className="font-medium text-slate-800">{sensor.deviceId}</span>
                      <br />
                      <span className="text-xs text-slate-500">{sensor.name}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">{sensor.unit}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className="font-bold text-slate-800">{sensor.value}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        sensor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {sensor.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500">{sensor.lastUpdate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Alerts Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Notifikasi Terbaru
            </h2>
            
            <Link href="/dashboard/alerts" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Lihat Semua →
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ title, value, icon, color, description }: { 
  title: string; 
  value: string | number; 
  icon: string; 
  color: string;
  description?: string;
}) {
  const colors: Record<string, string> = {
    blue: "from-blue-500 to-blue-600",
    red: "from-red-500 to-red-600",
    orange: "from-orange-500 to-orange-600",
    green: "from-green-500 to-green-600"
  };
  
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl shadow-md p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {description && (
            <p className="text-xs mt-1 opacity-75">{description}</p>
          )}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}

function AlertCard({ alert }: { alert: any }) {
  const icons = {
    warning: "⚠️",
    info: "ℹ️",
    success: "✅"
  };
  
  const badges = {
    high: "badge-danger",
    medium: "badge-warning",
    low: "badge-success"
  };
  
  return (
    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icons[alert.type as keyof typeof icons]}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 mb-1">{alert.message}</p>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${badges[alert.severity]}`}>
              {alert.severity.toUpperCase()}
            </span>
            <span className="text-xs text-slate-500">{alert.timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getPHLevel(phValue: number): string {
  if (phValue >= 6.5 && phValue <= 8.5) return "Normal";
  if (phValue < 6.5) return "Asam";
  return "Basa";
}
