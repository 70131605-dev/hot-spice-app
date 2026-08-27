import { Outlet, useLocation } from 'react-router'
import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const DASHBOARD_PATHS = ['/dashboard', '/admin']
const AUTH_PATHS = ['/login', '/signup']

export default function RootLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  const isDashboard = DASHBOARD_PATHS.some((p) => pathname.startsWith(p))
  const isAuth = AUTH_PATHS.includes(pathname)

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: 'var(--color-cream)' }}>
      {!isDashboard && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isDashboard && !isAuth && <Footer />}
    </div>
  )
}
