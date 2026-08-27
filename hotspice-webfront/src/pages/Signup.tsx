import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

type SignupForm = { fullName: string; email: string; phone: string; password: string; confirmPassword: string; agree: boolean }

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<SignupForm>()
  const password = watch('password')

  const onSubmit = async (data: SignupForm) => {
    setError('')
    const { error: err } = await signup({ email: data.email, password: data.password, fullName: data.fullName, phone: data.phone })
    if (err) { setError(err); return }
    navigate('/dashboard')
  }

  const passwordStrength = (pw = '') => {
    if (!pw) return 0
    let strength = 0
    if (pw.length >= 8) strength++
    if (/[A-Z]/.test(pw)) strength++
    if (/[0-9]/.test(pw)) strength++
    if (/[^A-Za-z0-9]/.test(pw)) strength++
    return strength
  }

  const strength = passwordStrength(password)
  const strengthColors = ['', 'bg-red-400', 'bg-[#F77F00]', 'bg-yellow-400', 'bg-[#2ECC71]']
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong']

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&h=1100&fit=crop&auto=format&q=85"
          alt="Food"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-16 left-10 right-10 text-white">
          <div className="flex items-center mb-6">
            <img src="/logo.png" alt="Hot N Spice" className="h-10 w-auto object-contain" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Join the Hot & Spice family today.</h2>
          <div className="space-y-2.5 mt-6">
            {['Exclusive member-only offers & early access', 'Manage reservations with one click', 'Save favorite dishes and reorder instantly', 'Priority table booking for special events'].map((b) => (
              <div key={b} className="flex items-center gap-2 text-white/80 text-sm">
                <CheckCircle size={14} className="text-[#2ECC71] flex-shrink-0" /> {b}
              </div>
            ))}
          </div>
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
          <div className="flex items-center mb-8 lg:hidden">
            <img src="/logo.png" alt="Hot N Spice" className="h-8 w-auto object-contain" />
          </div>

          <h1 className="text-3xl font-bold text-[#0D5969] mb-2">Create Account</h1>
          <p className="text-[#8B7355] mb-7 text-sm">Join thousands of satisfied guests today.</p>

          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0D5969] mb-1.5">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B7355]" />
                <input {...register('fullName', { required: 'Full name is required' })}
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm text-[#0D5969] focus:outline-none transition-colors ${errors.fullName ? 'border-red-400' : 'border-gray-200 focus:border-[#0D5969]'}`} />
              </div>
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0D5969] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B7355]" />
                <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/, message: 'Invalid email' } })}
                  type="email" placeholder="john@example.com"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm text-[#0D5969] focus:outline-none transition-colors ${errors.email ? 'border-red-400' : 'border-gray-200 focus:border-[#0D5969]'}`} />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0D5969] mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B7355]" />
                <input {...register('phone', { required: 'Phone is required' })}
                  placeholder="+1 (555) 000-0000"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm text-[#0D5969] focus:outline-none transition-colors ${errors.phone ? 'border-red-400' : 'border-gray-200 focus:border-[#0D5969]'}`} />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0D5969] mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B7355]" />
                <input {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } })}
                  type={showPw ? 'text' : 'password'} placeholder="••••••••"
                  className={`w-full pl-10 pr-11 py-3 border rounded-xl text-sm text-[#0D5969] focus:outline-none transition-colors ${errors.password ? 'border-red-400' : 'border-gray-200 focus:border-[#0D5969]'}`} />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B7355]">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= strength ? strengthColors[strength] : 'bg-gray-200'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-[#8B7355] mt-1">Password strength: <span className="font-medium">{strengthLabels[strength]}</span></p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0D5969] mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B7355]" />
                <input {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (v) => v === password || 'Passwords do not match',
                })}
                  type="password" placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm text-[#0D5969] focus:outline-none transition-colors ${errors.confirmPassword ? 'border-red-400' : 'border-gray-200 focus:border-[#0D5969]'}`} />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-start gap-2.5">
              <input {...register('agree', { required: true })} type="checkbox" id="agree" className="mt-0.5 accent-[#0D5969]" />
              <label htmlFor="agree" className="text-xs text-[#8B7355]">
                I agree to the <a href="#" className="text-[#0D5969] hover:underline">Terms of Service</a> and <a href="#" className="text-[#0D5969] hover:underline">Privacy Policy</a>
              </label>
            </div>
            {errors.agree && <p className="text-red-500 text-xs -mt-2">Please agree to the terms</p>}

            <button type="submit" disabled={isSubmitting}
              className="w-full py-3.5 bg-[#0D5969] hover:bg-[#093E4A] disabled:opacity-70 text-white font-semibold rounded-xl transition-colors text-sm">
              {isSubmitting ? 'Creating Account...' : 'Create My Account'}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-[#8B7355]">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 hover:border-gray-300 rounded-xl text-sm font-medium text-[#0D5969] transition-colors hover:bg-gray-50">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>

          <p className="mt-5 text-center text-sm text-[#8B7355]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#0D5969] font-semibold hover:underline">Sign in</Link>
          </p>
          <p className="mt-2 text-center">
            <Link to="/" className="text-xs text-[#8B7355] hover:text-[#0D5969]">← Back to Home</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
