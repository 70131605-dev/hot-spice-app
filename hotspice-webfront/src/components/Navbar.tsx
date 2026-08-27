import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Menu, X, User, LogOut, ChevronDown } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import CartDrawer from './CartDrawer'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Menu', to: '/menu' },
  { label: 'Reservation', to: '/reservation' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Chefs', to: '/chefs' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { totalItems } = useCart()
  const { user, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const isHome = pathname === '/'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setUserMenuOpen(false)
  }, [pathname])

  const navBg = isHome && !scrolled
    ? 'bg-transparent'
    : 'bg-dark/95 backdrop-blur-md shadow-lg'

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center group" aria-label="Hot and Spice home">
              <span
                style={{ fontFamily: "'Holtwood One SC', serif" }}
                className="text-[1.8rem] sm:text-[2.25rem] font-black tracking-[0.04em] group-hover:opacity-90 transition-opacity"
              >
                <span className="text-secondary">Hot</span>
                <span className="text-white">&amp;Spice</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.to || (link.to !== '/' && pathname.startsWith(link.to))
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                      active ? 'text-accent' : 'text-white/90 hover:text-white'
                    }`}
                  >
                    {link.label}
                    {active && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"
                      />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2.5 rounded-full text-white hover:bg-white/10 transition-colors"
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary rounded-full text-white text-xs font-bold flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>

              {/* User */}
              {user ? (
                <div className="relative hidden lg:block">
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.fullName} className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-xs font-bold">
                        {user.fullName.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm font-medium max-w-24 truncate">{user.fullName.split(' ')[0]}</span>
                    <ChevronDown size={14} />
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-dark border border-white/10 rounded-xl shadow-xl overflow-hidden"
                      >
                        <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2 px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors">
                          <User size={15} /> {user.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}
                        </Link>
                        <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-white/10 transition-colors border-t border-white/10">
                          <LogOut size={15} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-2">
                  <Link to="/login" className="px-4 py-2 text-sm font-medium text-white hover:text-accent transition-colors">
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-5 py-2 text-sm font-semibold bg-primary hover:bg-primary-dark text-white rounded-full transition-colors shadow-md"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Hamburger */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden p-2.5 rounded-full text-white hover:bg-white/10 transition-colors"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden bg-dark/98 backdrop-blur-md border-t border-white/10"
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      pathname === link.to
                        ? 'bg-primary/20 text-accent'
                        : 'text-white/90 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                  {user ? (
                    <>
                      <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="px-4 py-3 text-sm text-white bg-white/5 rounded-xl flex items-center gap-2">
                        <User size={15} /> Dashboard
                      </Link>
                      <button onClick={logout} className="px-4 py-3 text-sm text-red-400 bg-white/5 rounded-xl flex items-center gap-2">
                        <LogOut size={15} /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="px-4 py-3 text-center text-sm font-medium text-white bg-white/5 rounded-xl">
                        Login
                      </Link>
                      <Link to="/signup" className="px-4 py-3 text-center text-sm font-semibold bg-primary text-white rounded-xl">
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
