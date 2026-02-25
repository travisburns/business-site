import axios from 'axios'
import type { LeadCreateDto, LoginRequest, LoginResponse, Lead, LeadStats } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5057/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Check if JWT token is expired by decoding the payload
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

// Add auth token to requests if available and not expired
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('authToken')
  if (token) {
    if (isTokenExpired(token)) {
      sessionStorage.removeItem('authToken')
      sessionStorage.removeItem('userData')
      window.location.href = '/admin'
      return Promise.reject(new Error('Token expired'))
    }
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// If we get a 401, the token is invalid - clear it and force re-login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('authToken')
      sessionStorage.removeItem('userData')
      window.location.href = '/admin'
    }
    return Promise.reject(error)
  }
)

// Leads API
export const leadsApi = {
  create: async (data: LeadCreateDto) => {
    const response = await api.post('/leads', data)
    return response.data
  },

  getAll: async (): Promise<Lead[]> => {
    const response = await api.get('/leads')
    return response.data
  },

  getById: async (id: number): Promise<Lead> => {
    const response = await api.get(`/leads/${id}`)
    return response.data
  },

  update: async (id: number, data: Partial<Lead>) => {
    const response = await api.put(`/leads/${id}`, data)
    return response.data
  },

  delete: async (id: number) => {
    const response = await api.delete(`/leads/${id}`)
    return response.data
  },

  getStats: async (): Promise<LeadStats> => {
    const response = await api.get('/leads/stats')
    return response.data
  },
}

// Auth API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  logout: () => {
    sessionStorage.removeItem('authToken')
    sessionStorage.removeItem('userData')
  },

  isAuthenticated: (): boolean => {
    const token = sessionStorage.getItem('authToken')
    if (!token) return false
    if (isTokenExpired(token)) {
      sessionStorage.removeItem('authToken')
      sessionStorage.removeItem('userData')
      return false
    }
    return true
  },
}

// Analytics API
export const analyticsApi = {
  trackPageView: async (pageUrl: string, referrerUrl: string) => {
    await api.post('/analytics/page-view', { pageUrl, referrerUrl })
  },

  trackPhoneClick: async (pageUrl: string) => {
    await api.post('/analytics/phone-click', { pageUrl })
  },

  trackEmailClick: async (pageUrl: string) => {
    await api.post('/analytics/email-click', { pageUrl })
  },
}

export default api
