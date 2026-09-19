// app/dashboard/loading.tsx - Streaming Loading UI with React Suspense
// Modul 6 - Next.js App Router Implementation
// Demonstrates automatic streaming SSR and skeleton screens

export default function Loading() {
  return (
    <div className="space-y-6 fade-in">
      {/* Header Skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 skeleton rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-5 skeleton w-3/4"></div>
            <div className="h-4 skeleton w-1/2"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 bg-slate-50 rounded-lg">
              <div className="h-3 skeleton w-1/2 mb-2"></div>
              <div className="h-7 skeleton w-3/4"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 skeleton w-1/3"></div>
          <div className="flex gap-2">
            <div className="h-8 skeleton w-20"></div>
            <div className="h-8 skeleton w-20"></div>
          </div>
        </div>
        
        <div className="h-80 skeleton rounded-lg"></div>
      </div>

      {/* Data Table Skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 skeleton w-1/4"></div>
          <div className="h-8 skeleton w-32"></div>
        </div>
        
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 skeleton rounded-lg"></div>
          ))}
        </div>
      </div>

      {/* Notification Panel Skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 skeleton w-1/3"></div>
          <div className="h-8 skeleton w-24"></div>
        </div>
        
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-slate-50 rounded-lg">
              <div className="h-4 skeleton w-1/2 mb-2"></div>
              <div className="h-3 skeleton w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
