import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

type LoginForm = { email: string; password: string }

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setError('')
    const { error: err } = await login(data.email, data.password)
    if (err) { setError(err); return }
    const state: any = (location as any).state
    if (state && state.from) navigate(state.from)
    else navigate('/')
  }

  return (
    <div className="min-h-screen bg-cream flex ">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&h=1100&fit=crop&auto=format&q=85"
          alt="Restaurant"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-16 left-10 right-10 text-white">
          <div className="flex items-center mb-6">
            <img src="/logo.png" alt="Hot N Spice" className="h-10 w-auto object-contain" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Welcome back to an unforgettable dining journey.</h2>
          <p className="text-white/60">Sign in to manage your reservations, view your order history, and access exclusive member offers.</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 lg:max-w-lg flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Mobile Logo */}
          <div className="flex items-center mb-8 lg:hidden">
            <img src="/logo.png" alt="Hot N Spice" className="h-8 w-auto object-contain" />
          </div>

          <h1 className="text-3xl font-bold text-primary mb-2">Sign In</h1>
          <p className="text-muted mb-8 text-sm">Welcome back! Please enter your credentials.</p>

          {/* Demo Hint */}
          <div className="mb-6 p-3 bg-secondary/10 border border-secondary/30 rounded-xl text-xs text-muted">
            <strong>Demo:</strong> admin@hotandspice.pk / HotSpice#2026Admin <br/>
            Or: john@example.com / anypassword6+
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  {...register('email', { required: 'Email is required' })}
                  type="email"
                  placeholder="john@example.com"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm text-primary focus:outline-none transition-colors ${errors.email ? 'border-red-400' : 'border-gray-200 focus:border-primary'}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-primary">Password</label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-11 py-3 border rounded-xl text-sm text-primary focus:outline-none transition-colors ${errors.password ? 'border-red-400' : 'border-gray-200 focus:border-primary'}`}
                />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-primary">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-primary hover:bg-primary-dark disabled:opacity-70 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-muted">or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 hover:border-gray-300 rounded-xl text-sm font-medium text-primary transition-colors hover:bg-gray-50">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-muted">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-semibold hover:underline">Sign up free</Link>
          </p>

          <p className="mt-3 text-center">
            <Link to="/" className="text-xs text-muted hover:text-primary">← Back to Home</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
