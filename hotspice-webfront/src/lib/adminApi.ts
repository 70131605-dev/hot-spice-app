import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const ADMIN_TOKEN_KEY = 'hs_admin_token'

const adminApiClient = axios.create({
  baseURL: `${BASE_URL}/api/admin`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

let onUnauthorized: (() => void) | null = null

adminApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY)
  if (token) {
    if (!config.headers) config.headers = {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

adminApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      onUnauthorized?.()
    }
    return Promise.reject(error)
  },
)

export function setAdminUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler
}

export function setAdminAuthToken(token: string | null) {
  if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token)
  else localStorage.removeItem(ADMIN_TOKEN_KEY)
}

export function getAdminAuthToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY)
}

export default adminApiClient
