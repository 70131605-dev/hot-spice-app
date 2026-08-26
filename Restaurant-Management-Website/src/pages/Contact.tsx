import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { MapPin, Phone, Mail, Clock, MessageSquare, Send } from 'lucide-react'
import { InstagramIcon, FacebookIcon, TwitterIcon } from '@/components/SocialIcons'
import { useState } from 'react'

type ContactForm = { name: string; email: string; phone?: string; subject: string; message: string }

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }} className={className}>
      {children}
    </motion.div>
  )
}

const contactInfo = [
  { Icon: MapPin, label: 'Address', value: 'Lahore, Pakistan', href: null },
  { Icon: Phone, label: 'Phone', value: '042-111-000-111', href: 'tel:042111000111' },
  { Icon: Mail, label: 'Email', value: 'support@hotandspice.pk', href: 'mailto:support@hotandspice.pk' },
  { Icon: Phone, label: 'WhatsApp', value: '042-111-000-111', href: 'https://wa.me/9242111000111' },
]

const hours = [
  { day: 'Monday – Friday', time: '11:00 AM – 11:00 PM' },
  { day: 'Saturday', time: '10:00 AM – 12:00 AM' },
  { day: 'Sunday', time: '10:00 AM – 10:00 PM' },
  { day: 'Public Holidays', time: 'By reservation only' },
]

export default function Contact() {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactForm>()

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 1200))
    setSent(true)
    reset()
    setTimeout(() => setSent(false), 5000)
  }

  return (
    <div className="bg-[#FFF8F0] min-h-screen">
      {/* Hero */}
      <section className="relative h-64 flex items-end pb-12 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&h=500&fit=crop&auto=format&q=80"
          alt="Contact" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#F77F00] text-sm font-semibold uppercase tracking-widest">Get In Touch</span>
            <h1 className="text-5xl font-bold text-white mt-1">Contact Us</h1>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Info Panel */}
          <div className="lg:col-span-2 space-y-5">
            <FadeIn>
              <h2 className="text-2xl font-bold text-[#0D5969] mb-6">Visit or Reach Out</h2>
              <div className="space-y-4">
                {contactInfo.map(({ Icon, label, value, href }) => (
                  <div key={label} className="bg-white rounded-2xl p-4 shadow-warm flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#0D5969]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-[#0D5969]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#8B7355] font-medium uppercase tracking-wider mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} className="text-[#0D5969] text-sm font-medium hover:text-[#093E4A] transition-colors whitespace-pre-line">{value}</a>
                      ) : (
                        <p className="text-[#0D5969] text-sm font-medium whitespace-pre-line">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="bg-[#1A1A1A] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={16} className="text-[#0D5969]" />
                  <h3 className="font-semibold text-white text-sm">Business Hours</h3>
                </div>
                <div className="space-y-2.5">
                  {hours.map((h) => (
                    <div key={h.day} className="flex justify-between text-sm">
                      <span className="text-white/60">{h.day}</span>
                      <span className="text-white font-medium">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-white rounded-2xl p-5 shadow-warm">
                <h3 className="font-semibold text-[#0D5969] mb-4 text-sm">Follow Us</h3>
                <div className="flex gap-3">
                  {[
                    { Icon: InstagramIcon, href: '#', label: 'Instagram' },
                    { Icon: FacebookIcon, href: '#', label: 'Facebook' },
                    { Icon: TwitterIcon, href: '#', label: 'Twitter' },
                  ].map(({ Icon, href, label }) => (
                    <a key={label} href={href} aria-label={label}
                      className="flex-1 py-2.5 bg-[#FFF8F0] hover:bg-[#0D5969] rounded-xl flex items-center justify-center transition-colors group">
                      <Icon size={18} className="text-[#8B7355] group-hover:text-white transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Contact Form */}
          <FadeIn delay={0.15} className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-warm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0D5969]/10 rounded-xl flex items-center justify-center">
                  <MessageSquare size={18} className="text-[#0D5969]" />
                </div>
                <h2 className="text-2xl font-bold text-[#0D5969]">Send Us a Message</h2>
              </div>

              {sent && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-[#2ECC71]/10 border border-[#2ECC71]/30 rounded-xl text-[#2ECC71] text-sm font-medium"
                >
                  ✓ Your message has been sent! We'll respond within 24 hours.
                </motion.div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#0D5969] mb-1.5">Full Name *</label>
                    <input {...register('name', { required: 'Name is required' })}
                      placeholder="John Doe"
                      className={`w-full border rounded-xl px-4 py-3 text-sm text-[#0D5969] focus:outline-none transition-colors ${errors.name ? 'border-red-400' : 'border-gray-200 focus:border-[#0D5969]'}`} />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0D5969] mb-1.5">Email Address *</label>
                    <input {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+$/, message: 'Invalid email' } })}
                      type="email" placeholder="john@example.com"
                      className={`w-full border rounded-xl px-4 py-3 text-sm text-[#0D5969] focus:outline-none transition-colors ${errors.email ? 'border-red-400' : 'border-gray-200 focus:border-[#0D5969]'}`} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0D5969] mb-1.5">Phone Number</label>
                  <input {...register('phone')} placeholder="+1 (555) 000-0000"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0D5969] focus:outline-none focus:border-[#0D5969] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0D5969] mb-1.5">Subject *</label>
                  <select {...register('subject', { required: 'Please select a subject' })}
                    className={`w-full border rounded-xl px-4 py-3 text-sm text-[#0D5969] focus:outline-none transition-colors ${errors.subject ? 'border-red-400' : 'border-gray-200 focus:border-[#0D5969]'}`}>
                    <option value="">Select a subject</option>
                    <option value="reservation">Reservation Enquiry</option>
                    <option value="private">Private Event</option>
                    <option value="catering">Catering</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0D5969] mb-1.5">Message *</label>
                  <textarea {...register('message', { required: 'Message is required', minLength: { value: 20, message: 'Message must be at least 20 characters' } })}
                    rows={5} placeholder="Tell us how we can help..."
                    className={`w-full border rounded-xl px-4 py-3 text-sm text-[#0D5969] focus:outline-none transition-colors resize-none ${errors.message ? 'border-red-400' : 'border-gray-200 focus:border-[#0D5969]'}`} />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>
                <button type="submit" disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#0D5969] hover:bg-[#093E4A] disabled:opacity-70 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                  <Send size={16} />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Map */}
      <div className="h-96">
        <iframe
          src="https://www.google.com/maps?q=Lahore,+Pakistan&output=embed"
          className="w-full h-full grayscale"
          allowFullScreen loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Hot & Spice Location"
        />
      </div>
    </div>
  )
}
