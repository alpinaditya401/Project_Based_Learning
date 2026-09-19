// src/hooks/useUIStore.ts - Custom Hooks for Zustand Store
// Modul 7 - State Management Implementation

import { useMemo } from 'react';
import { useUIStore, useNotificationStore } from '../store/useUIStore';

/**
 * Hook untuk manajemen filter tasks
 */
export function useTaskFilters() {
  const category = useUIStore((state) => state.category);
  const priority = useUIStore((state) => state.priority);
  const status = useUIStore((state) => state.status);
  
  const setCategory = useUIStore((state) => state.setCategory);
  const setPriority = useUIStore((state) => state.setPriority);
  const setStatus = useUIStore((state) => state.setStatus);
  const resetFilters = useUIStore((state) => state.resetFilters);
  
  return useMemo(() => ({
    filters: { category, priority, status },
    actions: {
      setCategory,
      setPriority,
      setStatus,
      resetFilters
    }
  }), [category, priority, status, setCategory, setPriority, setStatus, resetFilters]);
}

/**
 * Hook untuk manajemen notifikasi
 */
export function useNotifications() {
  const notifications = useNotificationStore((state) => state.notifications);
  const addNotification = useNotificationStore((state) => state.addNotification);
  const removeNotification = useNotificationStore((state) => state.removeNotification);
  
  return useMemo(() => ({
    notifications,
    actions: {
      success: (message: string) => addNotification('success', message),
      error: (message: string) => addNotification('error', message),
      warning: (message: string) => addNotification('warning', message),
      info: (message: string) => addNotification('info', message),
      removeNotification
    }
  }), [notifications, addNotification, removeNotification]);
}

/**
 * Hook untuk manajemen tema
 */
export function useTheme() {
  const theme = useUIStore((state) => state.theme);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  
  const setTheme = useUIStore((state) => state.setTheme);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const closeSidebar = useUIStore((state) => state.closeSidebar);
  
  return useMemo(() => ({
    currentTheme: theme,
    isSidebarOpen: sidebarOpen,
    actions: {
      setTheme,
      toggleSidebar,
      closeSidebar
    },
    // Helper methods
    applyTheme: () => {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // Auto mode - follow system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }
  }), [theme, sidebarOpen]);
}

/**
 * Hook untuk filtering dan sorting data berdasarkan state client
 */
export function useDataFilter<T>(data: T[], filters: any) {
  const filteredData = useMemo(() => {
    let result = [...data];
    
    // Apply text search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(item => 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(query)
        )
      );
    }
    
    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      result = result.filter(item => item.category === filters.category);
    }
    
    // Apply priority filter
    if (filters.priority && filters.priority !== 'all') {
      result = result.filter(item => item.priority === filters.priority);
    }
    
    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      result = result.filter(item => item.status === filters.status);
    }
    
    // Apply date range filter
    if (filters.dateRange?.start || filters.dateRange?.end) {
      result = result.filter(item => {
        const createdAt = new Date(item.created_at || item.createdAt);
        
        if (filters.dateRange.start) {
          const startDate = new Date(filters.dateRange.start);
          if (createdAt < startDate) return false;
        }
        
        if (filters.dateRange.end) {
          const endDate = new Date(filters.dateRange.end);
          if (createdAt > endDate) return false;
        }
        
        return true;
      });
    }
    
    // Apply sorting
    if (filters.sortBy && filters.sortOrder) {
      result.sort((a, b) => {
        const aValue = a[filters.sortBy];
        const bValue = b[filters.sortBy];
        
        let comparison = 0;
        if (aValue < bValue) comparison = -1;
        else if (aValue > bValue) comparison = 1;
        
        return filters.sortOrder === 'desc' ? -comparison : comparison;
      });
    }
    
    return result;
  }, [data, filters]);
  
  return filteredData;
}

/**
 * Hook untuk real-time updates dengan polling
 */
export function useRealTimeData<T>(fetchFunction: () => Promise<T>, intervalMs: number = 5000) {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const data = await fetchFunction();
        setLastUpdate(new Date());
        return data;
      } catch (error) {
        console.error('Real-time update failed:', error);
      }
    }, intervalMs);
    
    return () => clearInterval(timer);
  }, [fetchFunction, intervalMs]);
  
  return lastUpdate;
}
