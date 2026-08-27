import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Utensils } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="text-center max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-[180px] leading-none font-black select-none mb-4"
          style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
        >
          404
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Utensils size={20} className="text-primary" />
            <span className="text-primary font-semibold uppercase tracking-widest text-sm">Hot & Spice</span>
          </div>
          <h1 className="text-4xl font-bold text-primary mb-3">Page Not Found</h1>
          <p className="text-muted mb-8 leading-relaxed">
            It seems this page wandered off the menu. The dish you're looking for may have been moved, renamed, or is simply unavailable today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 px-7 py-3.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-all hover:-translate-y-0.5"
            >
              <Home size={16} /> Back to Home
            </Link>
            <Link
              to="/menu"
              className="flex items-center gap-2 px-7 py-3.5 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-full transition-all"
            >
              <Utensils size={16} /> Browse Menu
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid grid-cols-3 gap-4 max-w-xs mx-auto"
        >
          {['🍕', '🥩', '🍰'].map((emoji, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
              className="text-4xl text-center"
            >
              {emoji}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
