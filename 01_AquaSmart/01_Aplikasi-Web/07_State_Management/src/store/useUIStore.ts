// src/store/useUIStore.ts - Zustand Store for Client UI State
// Modul 7 - State Management Implementation
// Demonstrates Zustand usage for client-side state management (~0.5 KB gzipped)

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Type definitions
interface FilterState {
  category: string;
  priority: string;
  status: string;
}

interface NotificationState {
  notifications: Array<{
    id: number;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: Date;
  }>;
}

interface ThemeState {
  theme: 'light' | 'dark' | 'auto';
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
}

interface TaskFilterState {
  searchQuery: string;
  dateRange: {
    start: string | null;
    end: string | null;
  };
  sortBy: 'date' | 'priority' | 'category';
  sortOrder: 'asc' | 'desc';
}

// Create Zustand store with multiple slices
export const useUIStore = create<FilterState & NotificationState & ThemeState & TaskFilterState>()(
  persist(
    (set, get) => ({
      // Filter State
      category: 'all',
      priority: 'all',
      status: 'all',
      
      setCategory: (category: string) => set({ category }),
      setPriority: (priority: string) => set({ priority }),
      setStatus: (status: string) => set({ status }),
      resetFilters: () => set({ 
        category: 'all', 
        priority: 'all', 
        status: 'all' 
      }),
      
      // Notifications
      notifications: [],
      
      addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
        set(state => ({
          notifications: [
            ...state.notifications,
            {
              id: Date.now(),
              type,
              message,
              timestamp: new Date()
            }
          ]
        }));
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
          removeNotification(Date.now());
        }, 5000);
      },
      
      removeNotification: (id: number) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));
      },
      
      clearNotifications: () => set({ notifications: [] }),
      
      // Theme State
      theme: 'auto',
      sidebarOpen: true,
      mobileMenuOpen: false,
      
      setTheme: (theme: 'light' | 'dark' | 'auto') => set({ theme }),
      toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
      toggleMobileMenu: () => set(state => ({ mobileMenuOpen: !state.mobileMenuOpen })),
      closeSidebar: () => set({ sidebarOpen: false }),
      
      // Task Filters
      searchQuery: '',
      dateRange: {
        start: null,
        end: null
      },
      sortBy: 'date',
      sortOrder: 'desc',
      
      setSearchQuery: (searchQuery: string) => set({ searchQuery }),
      setDateRange: (start: string | null, end: string | null) => set({ 
        dateRange: { start, end } 
      }),
      setSortBy: (sortBy: 'date' | 'priority' | 'category') => set({ sortBy }),
      setSortOrder: (sortOrder: 'asc' | 'desc') => set({ sortOrder }),
      resetTaskFilters: () => set({
        searchQuery: '',
        dateRange: { start: null, end: null },
        sortBy: 'date',
        sortOrder: 'desc'
      })
    }),
    {
      version: '1.0',
      name: 'aquasmart-ui-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist certain parts of the state
        category: state.category,
        priority: state.priority,
        status: state.status,
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        searchQuery: state.searchQuery,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder
      })
    }
  )
);

// Additional stores for specific functionality
export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id: Date.now(),
          type,
          message,
          timestamp: new Date()
        }
      ]
    }));
  },
  
  removeNotification: (id: number) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    }));
  }
}));

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'auto',
  sidebarOpen: true,
  mobileMenuOpen: false,
  
  setTheme: (theme: 'light' | 'dark' | 'auto') => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen }))
}));
