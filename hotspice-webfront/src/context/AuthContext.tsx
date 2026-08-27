import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import apiClient, { setAuthToken, setUnauthorizedHandler } from '@/lib/api'

export type User = {
  id: string
  email: string
  fullName: string
  phone: string
  role: 'user' | 'admin'
  avatarUrl?: string
  createdAt: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  token: string | null
  login: (email: string, password: string) => Promise<{ error: string | null }>
  signup: (data: { email: string; password: string; fullName: string; phone: string }) => Promise<{ error: string | null }>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
  setToken: (token: string | null) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const MOCK_USERS: User[] = [
  {
    id: 'admin-1',
    email: 'admin@hotandspice.pk',
    fullName: 'Admin User',
    phone: '+1 555-0100',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&h=150&fit=crop&auto=format',
    createdAt: '2024-01-01',
  },
  {
    id: 'user-1',
    email: 'john@example.com',
    fullName: 'John Doe',
    phone: '+1 555-0101',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&auto=format',
    createdAt: '2024-03-15',
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('rf_user')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setUser({
          ...parsed,
          fullName: parsed.fullName || parsed.name || parsed.email || '',
        })
      } catch {}
    }
    const storedToken = localStorage.getItem('rf_token')
    if (storedToken) {
      setToken(storedToken)
      setAuthToken(storedToken)
    }

    setUnauthorizedHandler(() => {
      setUser(null)
      setToken(null)
      setAuthToken(null)
      localStorage.removeItem('rf_user')
      window.location.href = '/login'
    })

    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const response = await apiClient.post('/login', {
        email,
        password,
      })

      const data = response.data
      const serverUser = data.user
      const userFromServer = {
        ...serverUser,
        fullName: serverUser.fullName || serverUser.name || '',
      }
      const tokenFromServer = data.token
      setUser(userFromServer)
      setToken(tokenFromServer)
      setAuthToken(tokenFromServer)
      localStorage.setItem('rf_user', JSON.stringify(userFromServer))
      return { error: null }
    } catch (error: any) {
      if (error.response?.data?.message) {
        return { error: error.response.data.message }
      }
      // fallback to mock behavior when backend isn't unreachable
      await new Promise((r) => setTimeout(r, 800))
      const found = MOCK_USERS.find((u) => u.email === email)
      if (!found) return { error: 'No account found with that email.' }
      if (password.length < 6) return { error: 'Invalid password.' }
      setUser(found)
      localStorage.setItem('rf_user', JSON.stringify(found))
      const mockToken = `mock-token-${found.id}`
      setToken(mockToken)
      setAuthToken(mockToken)
      return { error: null }
    }
  }

  const signup = async (data: { email: string; password: string; fullName: string; phone: string }): Promise<{ error: string | null }> => {
    try {
      const response = await apiClient.post('/register', {
        name: data.fullName,
        email: data.email,
        password: data.password,
        password_confirmation: data.password,
        phone: data.phone,
      })

      const responseData = response.data
      const serverUser = responseData.user
      const userFromServer = {
        ...serverUser,
        fullName: serverUser.fullName || serverUser.name || '',
      }
      const tokenFromServer = responseData.token
      setUser(userFromServer)
      setToken(tokenFromServer)
      setAuthToken(tokenFromServer)
      localStorage.setItem('rf_user', JSON.stringify(userFromServer))
      return { error: null }
    } catch (error: any) {
      if (error.response?.data?.message) {
        return { error: error.response.data.message }
      }
      if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0]
        return { error: Array.isArray(firstError) ? firstError[0] : String(firstError) }
      }
      return { error: 'Registration failed. Please try again.' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('rf_user')
    setToken(null)
    setAuthToken(null)
  }

  const updateProfile = (data: Partial<User>) => {
    if (!user) return
    const updated = { ...user, ...data }
    setUser(updated)
    localStorage.setItem('rf_user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, loading, token, login, signup, logout, updateProfile, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
