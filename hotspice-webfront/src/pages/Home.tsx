import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  ChevronDown, Star, Clock, Award, Flame, ArrowRight,
  Phone, CheckCircle, Quote, ChevronLeft, ChevronRight,
  Utensils, Wine, Shield, MapPin,
} from 'lucide-react'
import { fetchMenuItems, fetchChefs, fetchTestimonials, type MenuItem, type Chef, type Testimonial } from '@/lib/catalogApi'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { useForm } from 'react-hook-form'

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function Counter({ target, suffix = '', label }: { target: number; suffix?: string; label: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 2000
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl lg:text-5xl font-bold text-white mb-1">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-white/50 uppercase tracking-widest">{label}</div>
    </div>
  )
}

const whyChooseUs = [
  { Icon: Utensils, title: 'Premium Quality', desc: 'Only USDA Prime and hand-selected ingredients make it to your plate. Zero compromise.' },
  { Icon: Award, title: 'Award-Winning Chefs', desc: 'A team of internationally trained chefs with Michelin-star experience.' },
  { Icon: Wine, title: 'Curated Wine List', desc: '400+ labels from boutique vineyards across four continents, expertly paired.' },
  { Icon: Shield, title: 'Hygiene Certified', desc: 'Five-star health and safety rating. Our kitchen is open for tours, every day.' },
]

const galleryImages = [
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=450&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=450&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&h=450&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=350&fit=crop&auto=format&q=80',
]

type ReservationForm = {
  name: string; email: string; phone: string
  date: string; time: string; guests: string
}

export default function Home() {
  const { add } = useCart()
  const [testimonialIdx, setTestimonialIdx] = useState(0)
  const [toastMsg, setToastMsg] = useState('')
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [chefs, setChefs] = useState<Chef[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ReservationForm>()

  useEffect(() => {
    fetchMenuItems().then(setMenuItems)
    fetchChefs().then(setChefs)
    fetchTestimonials().then(setTestimonials)
  }, [])

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  const handleAddToCart = (item: MenuItem) => {
    if (!item.isAvailable) return
    add(item)
    showToast(`${item.name} added to cart!`)
  }

  const onReservationSubmit = async (_data: ReservationForm) => {
    await new Promise((r) => setTimeout(r, 1200))
    showToast('Reservation request sent! We\'ll confirm within 24 hours.')
    reset()
  }

  const featuredItems = menuItems.filter((item) => item.isFeatured).slice(0, 6)
  const todaySpecial = menuItems.find((m) => m.category === 'steak' && m.isFeatured)

  return (
    <div className="overflow-x-hidden">
      {/* Toast */}
      {toastMsg && (
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#1A1A1A] text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 text-sm font-medium"
        >
          <CheckCircle size={16} className="text-[#2ECC71]" />
          {toastMsg}
        </motion.div>
      )}

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=1080&fit=crop&auto=format&q=90"
            alt="Hot & Spice Restaurant"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-[#0D5969]/20 border border-[#0D5969]/40 backdrop-blur-sm rounded-full px-5 py-2 mb-8"
          >
            <Flame size={14} className="text-[#F77F00]" />
            <span className="text-[#F77F00] text-sm font-medium">Award-Winning Restaurant Since 2003</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
          >
            Delicious Food,{' '}
            <span className="relative">
              <span className="text-[#0D5969]">Great</span>
            </span>{' '}
            Experience
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Where world-class chefs transform the finest ingredients into unforgettable dining moments. Every plate tells a story worth savoring.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/reservation"
              className="w-full sm:w-auto sm:min-w-[210px] px-8 py-4 bg-[#0D5969] hover:bg-[#093E4A] text-white font-semibold rounded-full transition-all duration-200 shadow-lg shadow-[#0D5969]/40 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Phone size={16} /> Book A Table
            </Link>
            <Link
              to="/menu"
              className="w-full sm:w-auto sm:min-w-[210px] px-8 py-4 bg-[#0D5969]/20 hover:bg-[#0D5969] border-2 border-[#0D5969]/70 hover:border-[#0D5969] text-white font-semibold rounded-full transition-all duration-200 backdrop-blur-sm flex items-center justify-center gap-2"
            >
              <Utensils size={16} /> Explore Menu
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 grid grid-cols-3 gap-6 max-w-xl mx-auto"
          >
            {[
              { value: '4.9', label: 'Rating', suffix: '★' },
              { value: '50K+', label: 'Happy Guests' },
              { value: '120+', label: 'Menu Items' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold text-white">{s.value}{s.suffix}</div>
                <div className="text-xs text-white/50 mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown size={18} />
        </motion.div>
      </section>

      {/* ═══ FEATURED DISHES ═══ */}
      <section className="section-padding bg-[#FFF8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <span className="text-[#0D5969] text-sm font-semibold uppercase tracking-widest">Handpicked Favorites</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#0D5969] mt-2 mb-4">Our Popular Dishes</h2>
            <p className="text-[#8B7355] max-w-xl mx-auto">Each dish is a masterpiece — crafted with passion, plated with precision, and served with pride.</p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map((item, i) => (
              <FadeIn key={item.id} delay={i * 0.08}>
                <div className="bg-white rounded-2xl shadow-warm hover-lift overflow-hidden group">
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {item.isSpecial && (
                      <div className="absolute top-3 left-3 bg-[#0D5969] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Flame size={10} /> Special
                      </div>
                    )}
                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm bg-black/50 px-4 py-2 rounded-full">Sold Out</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }, (_, idx) => (
                        <Star
                          key={idx}
                          size={13}
                          className={idx < Math.floor(item.rating) ? 'text-[#F77F00] fill-[#F77F00]' : 'text-gray-200 fill-gray-200'}
                        />
                      ))}
                      <span className="text-xs text-[#8B7355] ml-1">({item.ratingCount})</span>
                    </div>
                    <h3 className="font-semibold text-[#0D5969] text-lg mb-1">{item.name}</h3>
                    <p className="text-[#8B7355] text-sm line-clamp-2 mb-4">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-[#0D5969]">{formatPrice(item.price)}</span>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-[#8B7355]">
                          <span className="flex items-center gap-1"><Clock size={11} /> {item.prepTime}m</span>
                          <span className="flex items-center gap-1"><Flame size={11} /> {item.calories} cal</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.isAvailable}
                        className="px-4 py-2.5 bg-[#0D5969] hover:bg-[#093E4A] disabled:bg-gray-200 text-white text-sm font-semibold rounded-xl transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="text-center mt-10">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-[#0D5969] text-[#0D5969] hover:bg-[#0D5969] hover:text-white font-semibold rounded-full transition-all duration-200"
            >
              View Full Menu <ArrowRight size={16} />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ═══ TODAY'S SPECIAL ═══ */}
      {todaySpecial && (
      <section className="section-padding bg-[#1A1A1A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#0D5969] blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#F77F00] blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div className="relative">
                <img
                  src={todaySpecial.image}
                  alt={todaySpecial.name}
                  className="w-full max-w-lg mx-auto rounded-3xl shadow-2xl animate-float"
                />
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#0D5969] rounded-full flex flex-col items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-bold">TODAY'S</span>
                  <span className="text-white text-xs font-bold">SPECIAL</span>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="text-white space-y-5 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-[#0D5969]/20 border border-[#0D5969]/40 rounded-full px-4 py-1.5">
                  <Flame size={12} className="text-[#F77F00]" />
                  <span className="text-[#F77F00] text-xs font-semibold">Chef's Recommendation</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold leading-tight">{todaySpecial.name}</h2>
                <p className="text-white/60 text-base leading-relaxed">{todaySpecial.description}</p>
                <div className="flex items-center justify-center lg:justify-start gap-6">
                  <div>
                    <span className="text-3xl font-bold text-[#0D5969]">{formatPrice(todaySpecial.price)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} size={14} className="text-[#F77F00] fill-[#F77F00]" />
                    ))}
                    <span className="text-white/50 text-sm ml-1">({todaySpecial.ratingCount} reviews)</span>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 text-sm text-white/60">
                  <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg">
                    <Clock size={13} /> {todaySpecial.prepTime} min prep
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg">
                    <Flame size={13} /> {todaySpecial.calories} calories
                  </span>
                </div>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
                  <button
                    onClick={() => handleAddToCart(todaySpecial)}
                    className="px-8 py-3.5 bg-[#0D5969] hover:bg-[#093E4A] text-white font-semibold rounded-full transition-all hover:-translate-y-0.5"
                  >
                    Order Now
                  </button>
                  <Link to="/menu" className="px-8 py-3.5 border border-white/20 hover:border-white/40 text-white rounded-full transition-colors font-medium">
                    See More
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      )}

      {/* ═══ WHY CHOOSE US ═══ */}
      <section className="section-padding bg-[#FFF8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-14">
            <span className="text-[#0D5969] text-sm font-semibold uppercase tracking-widest">Our Promise</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#0D5969] mt-2 mb-4">Why Choose Hot & Spice?</h2>
            <p className="text-[#8B7355] max-w-xl mx-auto">More than a meal — an experience engineered to exceed every expectation.</p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map(({ Icon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-7 shadow-warm hover-lift group text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#0D5969]/10 group-hover:bg-[#0D5969] flex items-center justify-center mx-auto mb-5 transition-colors duration-300">
                    <Icon size={26} className="text-[#0D5969] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-bold text-[#0D5969] text-lg mb-2">{title}</h3>
                  <p className="text-[#8B7355] text-sm leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATISTICS ═══ */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-[#0D5969] via-[#0A4A56] to-[#062F38]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_white_0%,transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            <Counter target={120} suffix="+" label="Menu Items" />
            <Counter target={50000} suffix="+" label="Happy Guests" />
            <Counter target={22} label="Years of Excellence" />
            <Counter target={4} label="Award-Winning Chefs" />
          </div>
        </div>
      </section>

      {/* ═══ CHEF PREVIEW ═══ */}
      <section className="section-padding bg-[#FFF8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <span className="text-[#0D5969] text-sm font-semibold uppercase tracking-widest">The Talent</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#0D5969] mt-2 mb-4">Meet Our Amazing Chefs</h2>
            <p className="text-[#8B7355] max-w-xl mx-auto">Internationally trained artisans who bring passion, precision, and soul to every plate.</p>
          </FadeIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {chefs.map((chef, i) => (
              <FadeIn key={chef.id} delay={i * 0.1}>
                <div className="group text-center">
                  <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square">
                    <img
                      src={chef.image}
                      alt={chef.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div>
                        <p className="text-white text-xs font-medium">{chef.specialty.split(',')[0]}</p>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-bold text-[#0D5969] text-base">{chef.name}</h3>
                  <p className="text-[#0D5969] text-sm">{chef.role}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn className="text-center mt-10">
            <Link
              to="/chefs"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-[#0D5969] text-[#0D5969] hover:bg-[#0D5969] hover:text-white font-semibold rounded-full transition-all duration-200"
            >
              Meet The Team <ArrowRight size={16} />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      {testimonials.length > 0 && (
      <section className="section-padding bg-[#1A1A1A] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#0D5969]/10 rounded-full blur-3xl" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn className="text-center mb-12">
            <span className="text-[#F77F00] text-sm font-semibold uppercase tracking-widest">Guest Reviews</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mt-2 mb-4">What Our Customers Say</h2>
          </FadeIn>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIdx}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.4 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 lg:p-12"
              >
                <Quote className="text-[#0D5969] mb-6" size={36} />
                <p className="text-white/80 text-lg leading-relaxed mb-8 italic">
                  "{testimonials[testimonialIdx].comment}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonials[testimonialIdx].avatar}
                    alt={testimonials[testimonialIdx].name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#0D5969]"
                  />
                  <div>
                    <h4 className="font-semibold text-white text-base">{testimonials[testimonialIdx].name}</h4>
                    <p className="text-[#8B7355] text-sm">{testimonials[testimonialIdx].role}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} size={13} className="text-[#F77F00] fill-[#F77F00]" />
                      ))}
                    </div>
                  </div>
                  <div className="ml-auto text-right">
                    <span className="text-[#0D5969] text-sm font-medium">{testimonials[testimonialIdx].dish}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setTestimonialIdx((i) => (i - 1 + testimonials.length) % testimonials.length)}
                className="w-11 h-11 rounded-full border border-white/20 hover:border-[#0D5969] hover:bg-[#0D5969] text-white flex items-center justify-center transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIdx(i)}
                    className={`h-2 rounded-full transition-all ${i === testimonialIdx ? 'w-8 bg-[#0D5969]' : 'w-2 bg-white/20'}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setTestimonialIdx((i) => (i + 1) % testimonials.length)}
                className="w-11 h-11 rounded-full border border-white/20 hover:border-[#0D5969] hover:bg-[#0D5969] text-white flex items-center justify-center transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ═══ RESERVATION CTA ═══ */}
      <section className="section-padding bg-[#FFF8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&h=700&fit=crop&auto=format&q=80"
              alt="Restaurant Interior"
              className="w-full h-full object-cover absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
            <div className="relative z-10 grid lg:grid-cols-2 gap-8 p-8 lg:p-14">
              <FadeIn>
                <div className="text-white space-y-4">
                  <span className="text-[#F77F00] text-sm font-semibold uppercase tracking-widest">Reserve Your Experience</span>
                  <h2 className="text-4xl lg:text-5xl font-bold">Book Your Table Today</h2>
                  <p className="text-white/60 text-base leading-relaxed max-w-md">
                    Secure your seat at New York's most celebrated dining destination. Special occasions made extraordinary — intimate booths, private dining rooms, and chef's table experiences available.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="flex -space-x-2">
                      {chefs.slice(0, 3).map((c) => (
                        <img key={c.id} src={c.image} alt={c.name} className="w-9 h-9 rounded-full border-2 border-black object-cover" />
                      ))}
                    </div>
                    <span className="text-white/60 text-sm">Our chefs are ready to create your moment</span>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <form
                  onSubmit={handleSubmit(onReservationSubmit)}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 space-y-4"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-white/70 text-xs font-medium mb-1.5 block">Full Name</label>
                      <input
                        {...register('name', { required: true })}
                        placeholder="John Doe"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#0D5969]"
                      />
                    </div>
                    <div>
                      <label className="text-white/70 text-xs font-medium mb-1.5 block">Phone</label>
                      <input
                        {...register('phone', { required: true })}
                        placeholder="+1 555-0100"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#0D5969]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-white/70 text-xs font-medium mb-1.5 block">Email</label>
                    <input
                      {...register('email', { required: true })}
                      type="email"
                      placeholder="john@example.com"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#0D5969]"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-white/70 text-xs font-medium mb-1.5 block">Date</label>
                      <input
                        {...register('date', { required: true })}
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#0D5969] [color-scheme:dark]"
                      />
                    </div>
                    <div>
                      <label className="text-white/70 text-xs font-medium mb-1.5 block">Time</label>
                      <select
                        {...register('time', { required: true })}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#0D5969] [color-scheme:dark]"
                      >
                        <option value="">Select</option>
                        {['6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-white/70 text-xs font-medium mb-1.5 block">Guests</label>
                      <select
                        {...register('guests', { required: true })}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#0D5969] [color-scheme:dark]"
                      >
                        {[1,2,3,4,5,6,7,8].map((n) => (
                          <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#0D5969] hover:bg-[#093E4A] disabled:opacity-70 text-white font-semibold rounded-xl transition-colors text-sm"
                  >
                    {isSubmitting ? 'Reserving...' : 'Reserve My Table'}
                  </button>
                </form>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ INSTAGRAM GALLERY ═══ */}
      <section className="section-padding bg-[#FFF8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-10">
            <span className="text-[#0D5969] text-sm font-semibold uppercase tracking-widest">@HotAndSpice</span>
            <h2 className="text-4xl font-bold text-[#0D5969] mt-2 mb-2">Follow Our Journey</h2>
            <p className="text-[#8B7355]">Tag us in your dining photos for a chance to be featured.</p>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {galleryImages.map((src, i) => (
              <FadeIn key={i} delay={i * 0.07}>
                <div className="aspect-square rounded-xl overflow-hidden group cursor-pointer">
                  <img
                    src={src}
                    alt={`Gallery ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NEWSLETTER ═══ */}
      <section className="py-16 bg-gradient-to-r from-[#0D5969] to-[#F77F00]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <FadeIn>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">Get Exclusive Offers & Updates</h2>
            <p className="text-white/80 mb-8">Subscribe to our newsletter for seasonal menus, exclusive events, and 15% off your first order.</p>
            <form onSubmit={(e) => { e.preventDefault(); showToast('You\'re subscribed! 🎉') }} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-white/20 border border-white/30 rounded-full px-6 py-3.5 text-white placeholder-white/60 text-sm focus:outline-none focus:bg-white/30 focus:border-white/50"
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-white text-[#0D5969] font-semibold rounded-full hover:shadow-lg transition-all hover:-translate-y-0.5 text-sm whitespace-nowrap"
              >
                Subscribe Now
              </button>
            </form>
          </FadeIn>
        </div>
      </section>

      {/* ═══ GOOGLE MAP ═══ */}
      <section className="h-80 relative">
        <iframe
          src="https://www.google.com/maps?q=Lahore,+Pakistan&output=embed"
          className="w-full h-full grayscale"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Hot & Spice Location"
        />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
          <MapPin size={14} className="text-[#0D5969]" />
          Lahore, Pakistan
        </div>
      </section>
    </div>
  )
}

