// src/services/api.ts - API Service Layer with TanStack Query
// Modul 7 - State Management Implementation
// Demonstrates TanStack Query v5 for server state management

import { queryOptions, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication tokens
apiClient.interceptors.request.use((config) => {
  // Add auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== Type Definitions ====================

export interface SensorReading {
  id: number;
  device_id: string;
  ph: number | null;
  temperature: number | null;
  turbidity: number | null;
  created_at: string;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'maintenance';
  last_heartbeat: string;
}

export interface Alert {
  id: number;
  device_id: string;
  alert_type: string;
  value: number;
  threshold: number;
  triggered_at: string;
  acknowledged: boolean;
}

export interface FeedingSchedule {
  id: number;
  device_id: string;
  time: string;
  amount: number;
  unit: string;
  enabled: boolean;
}

export interface ThresholdSettings {
  ph_min: number;
  ph_max: number;
  temp_min: number;
  temp_max: number;
  turbidity_max: number;
}

// ==================== Query Keys ====================

export const queryKeys = {
  sensors: {
    all: ['sensors'] as const,
    lists: () => [...queryKeys.sensors.all, 'list'] as const,
    list: (filters?: { deviceId?: string; startDate?: string; endDate?: string }) => 
      [...queryKeys.sensors.lists(), filters] as const,
    details: (id: number) => [...queryKeys.sensors.all, id] as const,
  },
  
  devices: {
    all: ['devices'] as const,
    list: () => [...queryKeys.devices.all, 'list'] as const,
    details: (deviceId: string) => [...queryKeys.devices.all, deviceId] as const,
  },
  
  alerts: {
    all: ['alerts'] as const,
    list: () => [...queryKeys.alerts.all, 'list'] as const,
    recent: () => [...queryKeys.alerts.list(), 'recent'] as const,
  },
  
  schedules: {
    all: ['schedules'] as const,
    list: () => [...queryKeys.schedules.all, 'list'] as const,
    details: (scheduleId: number) => [...queryKeys.schedules.all, scheduleId] as const,
  },
  
  thresholds: {
    all: ['thresholds'] as const,
    list: () => [...queryKeys.thresholds.all, 'list'] as const,
    details: () => [...queryKeys.thresholds.all, 'details'] as const,
  },
};

// ==================== React Query Queries ====================

// Fetch sensor readings with caching
export const useSensorReadings = (filters: {
  deviceId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: queryKeys.sensors.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.deviceId) params.append('device_id', filters.deviceId);
      if (filters.startDate) params.append('start_date', filters.startDate);
      if (filters.endDate) params.append('end_date', filters.endDate);
      if (filters.limit) params.append('limit', filters.limit.toString());
      
      const response = await apiClient.get(`/sensor-readings?${params.toString()}`);
      return response.data;
    },
    staleTime: 30000, // 30 seconds
    cacheTime: 300000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Fetch recent sensor data (streaming updates)
export const useRecentSensorData = () => {
  return useQuery({
    queryKey: queryKeys.sensors.details(999), // Dummy ID for "latest"
    queryFn: async () => {
      const response = await apiClient.get('/sensor-readings/latest');
      return response.data;
    },
    staleTime: 10000, // 10 seconds - very fresh
    cacheTime: 60000, // 1 minute
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
    refetchOnReconnect: true,
  });
};

// Fetch devices
export const useDevices = () => {
  return useQuery({
    queryKey: queryKeys.devices.list(),
    queryFn: async () => {
      const response = await apiClient.get('/devices');
      return response.data;
    },
    staleTime: 60000, // 1 minute
    cacheTime: 300000, // 5 minutes
  });
};

// Fetch alerts
export const useAlerts = (options: { includeAcknowledged?: boolean } = {}) => {
  return useQuery({
    queryKey: queryKeys.alerts.list(),
    queryFn: async () => {
      const response = await apiClient.get('/alerts', {
        params: { include_acknowledged: options.includeAcknowledged !== undefined ? options.includeAcknowledged : false }
      });
      return response.data;
    },
    staleTime: 30000, // 30 seconds
  });
};

// Fetch feeding schedules
export const useFeedingSchedules = () => {
  return useQuery({
    queryKey: queryKeys.schedules.list(),
    queryFn: async () => {
      const response = await apiClient.get('/feeding-schedules');
      return response.data;
    },
    staleTime: 300000, // 5 minutes
  });
};

// Fetch threshold settings
export const useThresholdSettings = () => {
  return useQuery({
    queryKey: queryKeys.thresholds.list(),
    queryFn: async () => {
      const response = await apiClient.get('/threshold-settings');
      return response.data;
    },
    staleTime: 3600000, // 1 hour
  });
};

// ==================== Mutations ====================

// Create mutation helper function
const createMutation = <TResponse, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TResponse>,
  options?: { onSuccess?: (data: TResponse) => void; onError?: (error: Error) => void }
) {
  return useMutation<TResponse, Error, TVariables>({
    mutationFn,
    onSuccess: (data) => {
      // Invalidate relevant queries to trigger refetch
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'sensors' });
      
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      
      if (options?.onError) {
        options.onError(error);
      }
    },
  });
};

const queryClient = queryClient; // Placeholder

// Acknowledge alert
export const useAcknowledgeAlert = () => {
  return useMutation({
    mutationFn: async (alertId: number) => {
      const response = await apiClient.patch(`/alerts/${alertId}/acknowledge`);
      return response.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts.list() });
    },
  });
};

// Update threshold settings
export const useUpdateThreshold = () => {
  return useMutation({
    mutationFn: async (settings: ThresholdSettings) => {
      const response = await apiClient.put('/threshold-settings', settings);
      return response.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.thresholds.list() });
    },
  });
};

// Send actuator command
export const useSendActuatorCommand = () => {
  return useMutation({
    mutationFn: async ({ deviceId, command, payload }: { 
      deviceId: string; 
      command: string; 
      payload: any 
    }) => {
      const response = await apiClient.post(`/devices/${deviceId}/command`, {
        command,
        payload
      });
      return response.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.devices.list() });
    },
  });
};

// ==================== Options ====================

// Pre-fetch options for optimal loading
export const sensorReadingsOptions = queryOptions({
  queryKey: queryKeys.sensors.lists(),
  queryFn: async () => {
    const response = await apiClient.get('/sensor-readings/list');
    return response.data;
  },
  staleTime: 30000,
});
