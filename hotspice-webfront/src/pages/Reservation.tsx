import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Calendar, Clock, Users, Phone, Mail, User, MessageSquare, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { timeSlots } from '@/lib/utils'

type FormData = {
  name: string; phone: string; email: string
  date: string; time: string; guests: string; notes: string
}

const steps = ['Contact Info', 'Date & Time', 'Confirmation']

export default function Reservation() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [reservationId, setReservationId] = useState('')

  const { register, handleSubmit, watch, trigger, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: { guests: '2' }
  })
  const formValues = watch()

  const nextStep = async () => {
    const fields: (keyof FormData)[][] = [
      ['name', 'phone', 'email'],
      ['date', 'time', 'guests'],
    ]
    const valid = await trigger(fields[step] as (keyof FormData)[])
    if (valid) setStep((s) => s + 1)
  }

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 1500))
    const id = `RF-${Date.now().toString().slice(-6)}`
    setReservationId(id)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-warm-lg p-10 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-success" />
          </div>
          <h2 className="text-3xl font-bold text-primary mb-2">Reservation Confirmed!</h2>
          <p className="text-muted mb-6">Your table has been reserved. We'll send a confirmation to <strong>{formValues.email}</strong></p>
          <div className="bg-cream rounded-2xl p-5 mb-6 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Confirmation #</span>
              <span className="font-semibold text-primary">{reservationId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Name</span>
              <span className="font-medium text-primary">{formValues.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Date</span>
              <span className="font-medium text-primary">{formValues.date}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Time</span>
              <span className="font-medium text-primary">{formValues.time}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Guests</span>
              <span className="font-medium text-primary">{formValues.guests} people</span>
            </div>
          </div>
          <button
            onClick={() => { setSubmitted(false); setStep(0) }}
            className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors"
          >
            Make Another Reservation
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero */}
      <section className="relative h-64 flex items-end pb-12 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&h=500&fit=crop&auto=format&q=80"
          alt="Reservation" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-secondary text-sm font-semibold uppercase tracking-widest">Secure Your Seat</span>
            <h1 className="text-5xl font-bold text-white mt-1">Make a Reservation</h1>
          </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3">
            {/* Progress */}
            <div className="flex items-center gap-3 mb-8">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <div className={`flex items-center gap-2 ${i <= step ? 'text-primary' : 'text-muted'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      i < step ? 'bg-primary text-white' : i === step ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                    }`}>
                      {i < step ? <CheckCircle size={16} /> : i + 1}
                    </div>
                    <span className="text-sm font-medium hidden sm:block">{s}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-px w-8 ${i < step ? 'bg-primary' : 'bg-primary/20'}`} />
                  )}
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl shadow-warm p-8">
              <form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  {step === 0 && (
                    <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
                      <h2 className="text-2xl font-bold text-primary mb-6">Contact Information</h2>
                      <div>
                        <label className="text-sm font-medium text-primary mb-1.5 flex items-center gap-2">
                          <User size={14} className="text-primary" /> Full Name *
                        </label>
                        <input {...register('name', { required: 'Name is required' })}
                          placeholder="John Doe"
                          className={`w-full border rounded-xl px-4 py-3 text-primary text-sm focus:outline-none transition-colors ${errors.name ? 'border-red-400' : 'border-gray-200 focus:border-primary'}`} />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-primary mb-1.5 flex items-center gap-2">
                          <Phone size={14} className="text-primary" /> Phone Number *
                        </label>
                        <input {...register('phone', { required: 'Phone is required' })}
                          placeholder="+1 (555) 000-0000"
                          className={`w-full border rounded-xl px-4 py-3 text-primary text-sm focus:outline-none transition-colors ${errors.phone ? 'border-red-400' : 'border-gray-200 focus:border-primary'}`} />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-primary mb-1.5 flex items-center gap-2">
                          <Mail size={14} className="text-primary" /> Email Address *
                        </label>
                        <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/, message: 'Invalid email' } })}
                          type="email" placeholder="john@example.com"
                          className={`w-full border rounded-xl px-4 py-3 text-primary text-sm focus:outline-none transition-colors ${errors.email ? 'border-red-400' : 'border-gray-200 focus:border-primary'}`} />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                      </div>
                      <button type="button" onClick={nextStep} className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                        Next Step <ChevronRight size={16} />
                      </button>
                    </motion.div>
                  )}

                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
                      <h2 className="text-2xl font-bold text-primary mb-6">Date, Time & Guests</h2>
                      <div>
                        <label className="text-sm font-medium text-primary mb-1.5 flex items-center gap-2">
                          <Calendar size={14} className="text-primary" /> Preferred Date *
                        </label>
                        <input {...register('date', { required: 'Date is required' })}
                          type="date" min={new Date().toISOString().split('T')[0]}
                          className={`w-full border rounded-xl px-4 py-3 text-primary text-sm focus:outline-none transition-colors ${errors.date ? 'border-red-400' : 'border-gray-200 focus:border-primary'}`} />
                        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
                          <Clock size={14} className="text-primary" /> Preferred Time *
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.slice(6).map((t) => (
                            <label key={t} className="cursor-pointer">
                              <input type="radio" {...register('time', { required: true })} value={t} className="sr-only" />
                              <div className={`text-center py-2 px-1 rounded-xl border text-xs font-medium transition-colors ${
                                formValues.time === t ? 'bg-primary text-white border-primary' : 'border-gray-200 text-primary hover:border-primary'
                              }`}>
                                {t}
                              </div>
                            </label>
                          ))}
                        </div>
                        {errors.time && <p className="text-red-500 text-xs mt-1">Please select a time</p>}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
                          <Users size={14} className="text-primary" /> Number of Guests *
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                            <label key={n} className="cursor-pointer">
                              <input type="radio" {...register('guests', { required: true })} value={String(n)} className="sr-only" />
                              <div className={`w-11 h-11 rounded-xl border flex items-center justify-center text-sm font-semibold transition-colors ${
                                formValues.guests === String(n) ? 'bg-primary text-white border-primary' : 'border-gray-200 text-primary hover:border-primary'
                              }`}>
                                {n}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-primary mb-1.5 flex items-center gap-2">
                          <MessageSquare size={14} className="text-primary" /> Special Requests
                        </label>
                        <textarea {...register('notes')}
                          rows={3} placeholder="Allergies, dietary restrictions, special occasion, seating preferences..."
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-primary text-sm focus:outline-none focus:border-primary resize-none" />
                      </div>
                      <div className="flex gap-3">
                        <button type="button" onClick={() => setStep(0)} className="flex-1 py-3.5 border border-gray-200 hover:border-primary text-primary font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                          <ChevronLeft size={16} /> Back
                        </button>
                        <button type="button" onClick={nextStep} className="flex-1 py-3.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                          Review <ChevronRight size={16} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
                      <h2 className="text-2xl font-bold text-primary mb-6">Review & Confirm</h2>
                      <div className="bg-cream rounded-2xl p-5 space-y-3">
                        {[
                          { label: 'Name', value: formValues.name },
                          { label: 'Email', value: formValues.email },
                          { label: 'Phone', value: formValues.phone },
                          { label: 'Date', value: formValues.date },
                          { label: 'Time', value: formValues.time },
                          { label: 'Guests', value: `${formValues.guests} people` },
                          formValues.notes ? { label: 'Notes', value: formValues.notes } : null,
                        ].filter(Boolean).map((row) => (
                          <div key={row!.label} className="flex justify-between text-sm">
                            <span className="text-muted">{row!.label}</span>
                            <span className="font-medium text-primary max-w-48 text-right">{row!.value}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-muted text-xs">By confirming, you agree to our cancellation policy. Reservations can be modified up to 2 hours before your booking.</p>
                      <div className="flex gap-3">
                        <button type="button" onClick={() => setStep(1)} className="flex-1 py-3.5 border border-gray-200 hover:border-primary text-primary font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                          <ChevronLeft size={16} /> Edit
                        </button>
                        <button type="submit" disabled={isSubmitting} className="flex-1 py-3.5 bg-primary hover:bg-primary-dark disabled:opacity-70 text-white font-semibold rounded-xl transition-colors">
                          {isSubmitting ? 'Confirming...' : 'Confirm Reservation'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-dark rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-4">Reservation Info</h3>
              <div className="space-y-3 text-sm text-white/70">
                <div className="flex items-start gap-3">
                  <Clock size={14} className="text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-white mb-0.5">Dining Hours</p>
                    <p>Mon–Fri: 11am–11pm</p>
                    <p>Sat–Sun: 10am–12am</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users size={14} className="text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-white mb-0.5">Group Dining</p>
                    <p>For parties of 10+, please call us at 042-111-000-111</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={14} className="text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-white mb-0.5">Phone Reservations</p>
                    <p>042-111-000-111</p>
                    <p>Available 10am–9pm daily</p>
                  </div>
                </div>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop&auto=format&q=80"
              alt="Dining experience"
              className="w-full rounded-2xl object-cover h-52"
            />
            <div className="bg-white rounded-2xl shadow-warm p-5">
              <h4 className="font-semibold text-primary mb-3 text-sm">Available for Private Events?</h4>
              <p className="text-muted text-sm mb-4">Our private dining room seats up to 24 guests and features a dedicated sommelier and custom menu.</p>
              <a href="tel:+12125550100" className="block text-center py-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-white font-medium text-sm rounded-xl transition-colors">
                Enquire Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
