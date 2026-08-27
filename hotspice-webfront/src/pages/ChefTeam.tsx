import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Award, Clock, X, ChevronRight } from 'lucide-react'
import { InstagramIcon } from '@/components/SocialIcons'
import { fetchChefs, type Chef } from '@/lib/catalogApi'

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

export default function ChefTeam() {
  const [selected, setSelected] = useState<Chef | null>(null)
  const [chefs, setChefs] = useState<Chef[]>([])

  useEffect(() => { fetchChefs().then(setChefs) }, [])

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero */}
      <section className="relative h-64 flex items-end pb-12 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1400&h=500&fit=crop&auto=format&q=80"
          alt="Chefs" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-secondary text-sm font-semibold uppercase tracking-widest">The Talent</span>
            <h1 className="text-5xl font-bold text-white mt-1">Our Chef Team</h1>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <FadeIn className="max-w-3xl mx-auto text-center px-4 py-14">
        <span className="text-primary text-sm font-semibold uppercase tracking-widest">Artisans of Flavor</span>
        <h2 className="text-4xl font-bold text-primary mt-2 mb-4">Meet the Culinary Artists</h2>
        <p className="text-muted leading-relaxed">
          Each member of our kitchen has spent years mastering their craft at some of the world's finest institutions. Their stories, passions, and signature dishes define what Hot & Spice means to 50,000 guests each year.
        </p>
      </FadeIn>

      {/* Chef Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {chefs.map((chef, i) => (
            <FadeIn key={chef.id} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="bg-white rounded-3xl overflow-hidden shadow-warm group cursor-pointer"
                onClick={() => setSelected(chef)}
              >
                <div className="relative h-72 overflow-hidden">
                  <img src={chef.image} alt={chef.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-xs font-medium line-clamp-2">{chef.specialty}</p>
                  </div>
                  <div className="absolute top-3 right-3 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={16} className="text-white" />
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-primary text-lg">{chef.name}</h3>
                      <p className="text-primary text-sm mt-0.5">{chef.role}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-primary/10 rounded-lg px-2 py-1">
                      <Clock size={12} className="text-primary" />
                      <span className="text-primary text-xs font-semibold">{chef.experience}y</span>
                    </div>
                  </div>
                  <p className="text-muted text-xs mt-3 line-clamp-2 leading-relaxed">{chef.bio.split('.')[0]}.</p>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                    <Award size={13} className="text-secondary" />
                    <span className="text-xs text-muted truncate">{chef.specialty.split(',')[0]}</span>
                  </div>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Chef Modal */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm" onClick={() => setSelected(null)} />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-2xl sm:w-full z-50 bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 w-9 h-9 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center z-10 transition-colors">
                <X size={18} />
              </button>
              <div className="relative h-56 sm:h-72">
                <img src={selected.image} alt={selected.name} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
                <div className="absolute bottom-5 left-6 text-white">
                  <h2 className="text-2xl font-bold">{selected.name}</h2>
                  <p className="text-secondary text-sm">{selected.role}</p>
                </div>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 bg-primary/10 rounded-lg px-3 py-1.5 text-xs font-medium text-primary">
                    <Clock size={12} /> {selected.experience} Years Experience
                  </div>
                  <div className="flex items-center gap-2 bg-secondary/10 rounded-lg px-3 py-1.5 text-xs font-medium text-secondary">
                    <InstagramIcon size={12} /> {selected.instagram}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-2">About</h4>
                  <p className="text-muted text-sm leading-relaxed">{selected.bio}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-2">Specialty</h4>
                  <p className="text-muted text-sm">{selected.specialty}</p>
                </div>
                <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-4">
                  <p className="text-white/80 text-xs uppercase tracking-widest mb-1">Signature Dish</p>
                  <p className="text-white font-semibold">{selected.signature}</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
