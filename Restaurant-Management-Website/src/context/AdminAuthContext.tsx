import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import adminApiClient, { setAdminAuthToken, setAdminUnauthorizedHandler } from '@/lib/adminApi'

export type AdminUser = {
  id: number
  name: string
  email: string
  role: string
}

type AdminAuthContextType = {
  admin: AdminUser | null
  loading: boolean
  token: string | null
  login: (email: string, password: string) => Promise<{ error: string | null }>
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null)

const ADMIN_USER_KEY = 'hs_admin_user'

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem(ADMIN_USER_KEY)
    const storedToken = localStorage.getItem('hs_admin_token')

    if (storedUser && storedToken) {
      try {
        setAdmin(JSON.parse(storedUser))
        setToken(storedToken)
        setAdminAuthToken(storedToken)
      } catch {}
    }

    setAdminUnauthorizedHandler(() => {
      setAdmin(null)
      setToken(null)
      setAdminAuthToken(null)
      localStorage.removeItem(ADMIN_USER_KEY)
      window.location.href = '/admin/login'
    })

    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const response = await adminApiClient.post('/login', { email, password })
      const { admin: adminFromServer, token: tokenFromServer } = response.data

      setAdmin(adminFromServer)
      setToken(tokenFromServer)
      setAdminAuthToken(tokenFromServer)
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(adminFromServer))

      return { error: null }
    } catch (error: any) {
      if (error.response?.data?.message) {
        return { error: error.response.data.message }
      }
      return { error: 'Unable to sign in. Please try again.' }
    }
  }

  const logout = () => {
    adminApiClient.post('/logout').catch(() => {})
    setAdmin(null)
    setToken(null)
    setAdminAuthToken(null)
    localStorage.removeItem(ADMIN_USER_KEY)
  }

  return (
    <AdminAuthContext.Provider value={{ admin, loading, token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used inside AdminAuthProvider')
  return ctx
}
