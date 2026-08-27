import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAdminAuth } from '@/context/AdminAuthContext'

type LoginForm = { email: string; password: string }

export default function AdminLogin() {
  const { login } = useAdminAuth()
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setError('')
    const { error: err } = await login(data.email, data.password)
    if (err) { setError(err); return }
    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="flex items-center justify-center mb-8">
          <img src="/logo.png" alt="Hot N Spice" className="h-8 w-auto object-contain" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2 text-center">Admin Sign In</h1>
        <p className="text-white/40 mb-8 text-sm text-center">Restricted access. Staff credentials only.</p>

        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                placeholder="admin@hotandspice.pk"
                className={`w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border rounded-xl text-sm text-white placeholder-white/20 focus:outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-white/10 focus:border-[#0D5969]'}`}
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                {...register('password', { required: 'Password is required' })}
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                className={`w-full pl-10 pr-11 py-3 bg-[#1A1A1A] border rounded-xl text-sm text-white placeholder-white/20 focus:outline-none transition-colors ${errors.password ? 'border-red-500' : 'border-white/10 focus:border-[#0D5969]'}`}
              />
              <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#0D5969] hover:bg-[#093E4A] disabled:opacity-70 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center">
          <Link to="/" className="text-xs text-white/30 hover:text-white/60">← Back to Home</Link>
        </p>
      </motion.div>
    </div>
  )
}
