import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Award, Users, Heart, Globe, ArrowRight } from 'lucide-react'
import { Link } from 'react-router'

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }} className={className}>
      {children}
    </motion.div>
  )
}

const timeline = [
  { year: '2003', title: 'The Beginning', desc: 'Chef Marco Rossetti opens a 30-seat trattoria in Lower Manhattan with a $40,000 loan and a dream.' },
  { year: '2008', title: 'First Accolade', desc: 'Awarded Best New Italian Restaurant by New York Magazine. The waiting list hits six weeks.' },
  { year: '2013', title: 'Expansion', desc: 'We open our flagship two-floor space on Royal Avenue, adding the first wood-fired grill and Asian kitchen.' },
  { year: '2018', title: 'Michelin Recognition', desc: 'Featured in the Michelin Guide New York for the first time — a milestone that changed everything.' },
  { year: '2023', title: 'New Chapter', desc: 'Celebrating 20 years of excellence with a fully renovated private dining wing and a new seasonal tasting menu.' },
]

const values = [
  { Icon: Heart, title: 'Passion First', desc: 'Every dish begins with genuine love for the craft. We cook the way we wish we were cooked for.' },
  { Icon: Award, title: 'Uncompromising Quality', desc: 'We source ingredients the same way luxury jewelers source gemstones — only the finest make the cut.' },
  { Icon: Users, title: 'Community', desc: 'We partner with local farmers, train the next generation of chefs, and give back to the neighborhood that raised us.' },
  { Icon: Globe, title: 'Global Palate', desc: 'Our team has cooked on four continents. Every culture teaches us something. Our menu is the proof.' },
]

export default function About() {
  return (
    <div className="bg-[#FFF8F0]">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-80 flex items-end pb-16 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&h=700&fit=crop&auto=format&q=85"
          alt="Hot & Spice Interior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="text-[#F77F00] text-sm font-semibold uppercase tracking-widest">Our Story</span>
            <h1 className="text-5xl lg:text-7xl font-bold text-white mt-2">About Hot & Spice</h1>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=700&h=850&fit=crop&auto=format&q=85"
                  alt="Chef Marco at work"
                  className="w-full rounded-3xl shadow-warm-lg object-cover"
                />
                <div className="absolute -bottom-6 -right-6 bg-[#0D5969] text-white rounded-2xl p-5 shadow-lg">
                  <div className="text-4xl font-bold">22+</div>
                  <div className="text-sm text-white/80 mt-0.5">Years of Culinary Excellence</div>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.2} className="space-y-6">
              <span className="text-[#0D5969] text-sm font-semibold uppercase tracking-widest">Who We Are</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#0D5969] leading-tight">A Restaurant Born from Pure Passion</h2>
              <p className="text-[#8B7355] leading-relaxed">
                Hot & Spice began in 2003 as a 30-seat Italian-American trattoria in Lower Manhattan. What started as Chef Marco Rossetti's dream — to bring the warmth and artistry of European fine dining to New York — has grown into one of the city's most celebrated culinary destinations.
              </p>
              <p className="text-[#8B7355] leading-relaxed">
                Today, Hot & Spice spans four uniquely designed dining spaces, employs a team of award-winning international chefs, and serves over 50,000 guests annually. But our philosophy hasn't changed in 22 years: every guest deserves to feel like the only guest. Every plate deserves to be our best work.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                {[
                  { val: '50K+', label: 'Happy Guests Served' },
                  { val: '120+', label: 'Dishes on the Menu' },
                  { val: '4', label: 'Award-Winning Chefs' },
                  { val: '12', label: 'Industry Awards' },
                ].map(({ val, label }) => (
                  <div key={label} className="bg-white rounded-xl p-4 shadow-warm">
                    <div className="text-2xl font-bold text-[#0D5969]">{val}</div>
                    <div className="text-sm text-[#8B7355] mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <span className="text-[#F77F00] text-sm font-semibold uppercase tracking-widest">What Drives Us</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mt-2 mb-4">Our Core Values</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ Icon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.1}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#0D5969]/40 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-[#0D5969]/10 flex items-center justify-center mb-4 group-hover:bg-[#0D5969] transition-colors">
                    <Icon size={22} className="text-[#0D5969] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-[#FFF8F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-14">
            <span className="text-[#0D5969] text-sm font-semibold uppercase tracking-widest">Our Journey</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#0D5969] mt-2">Two Decades of Excellence</h2>
          </FadeIn>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-0.5 top-0 bottom-0 w-px bg-gradient-to-b from-[#0D5969] via-[#F77F00] to-transparent" />
            <div className="space-y-12">
              {timeline.map((event, i) => (
                <FadeIn key={event.year} delay={i * 0.1}>
                  <div className={`flex items-start gap-8 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                      <div className="bg-white rounded-2xl p-6 shadow-warm inline-block max-w-xs w-full">
                        <div className="text-[#0D5969] font-bold text-3xl mb-1">{event.year}</div>
                        <h3 className="font-bold text-[#0D5969] text-lg mb-2">{event.title}</h3>
                        <p className="text-[#8B7355] text-sm leading-relaxed">{event.desc}</p>
                      </div>
                    </div>
                    <div className="relative flex-shrink-0 w-5 h-5 rounded-full bg-[#0D5969] border-4 border-[#FFF8F0] shadow-md z-10 mt-6" />
                    <div className="flex-1" />
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#0D5969] to-[#F77F00]">
        <FadeIn className="text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Experience Hot & Spice?</h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto">A table is waiting. A memory is ready to be made.</p>
          <Link
            to="/reservation"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-[#0D5969] font-bold rounded-full hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            Book Your Table <ArrowRight size={18} />
          </Link>
        </FadeIn>
      </section>
    </div>
  )
}
