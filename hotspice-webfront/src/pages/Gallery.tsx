import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'

type GalleryItem = { id: string; src: string; alt: string; category: string; aspect: 'tall' | 'wide' | 'square' }

const galleryItems: GalleryItem[] = [
  { id: 'g1', src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=1000&fit=crop&auto=format&q=85', alt: 'Restaurant Ambiance', category: 'interior', aspect: 'tall' },
  { id: 'g2', src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format&q=85', alt: 'Dry-Aged Ribeye', category: 'food', aspect: 'wide' },
  { id: 'g3', src: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=700&h=700&fit=crop&auto=format&q=85', alt: 'Chocolate Lava Cake', category: 'food', aspect: 'square' },
  { id: 'g4', src: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=1100&fit=crop&auto=format&q=85', alt: 'BBQ Ribs', category: 'food', aspect: 'tall' },
  { id: 'g5', src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop&auto=format&q=85', alt: 'Dining Room', category: 'interior', aspect: 'wide' },
  { id: 'g6', src: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=700&h=700&fit=crop&auto=format&q=85', alt: 'Chef Plating', category: 'chefs', aspect: 'square' },
  { id: 'g7', src: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&h=1000&fit=crop&auto=format&q=85', alt: 'Margherita Pizza', category: 'food', aspect: 'tall' },
  { id: 'g8', src: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&auto=format&q=85', alt: 'Wagyu Burger', category: 'food', aspect: 'wide' },
  { id: 'g9', src: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=700&h=700&fit=crop&auto=format&q=85', alt: 'Signature Cocktail', category: 'drinks', aspect: 'square' },
  { id: 'g10', src: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&h=1000&fit=crop&auto=format&q=85', alt: 'Peking Duck', category: 'food', aspect: 'tall' },
  { id: 'g11', src: 'https://images.unsplash.com/photo-1550966871-3ed6593773e5?w=800&h=600&fit=crop&auto=format&q=85', alt: 'Chef Cooking', category: 'chefs', aspect: 'wide' },
  { id: 'g12', src: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=700&h=700&fit=crop&auto=format&q=85', alt: 'Tiramisu', category: 'food', aspect: 'square' },
  { id: 'g13', src: 'https://images.unsplash.com/photo-1546964124-0cce460949c5?w=800&h=1100&fit=crop&auto=format&q=85', alt: 'Filet Mignon', category: 'food', aspect: 'tall' },
  { id: 'g14', src: 'https://images.unsplash.com/photo-1553979459-d02b1cfac37f?w=800&h=600&fit=crop&auto=format&q=85', alt: 'Gourmet Burger', category: 'food', aspect: 'wide' },
  { id: 'g15', src: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=700&h=700&fit=crop&auto=format&q=85', alt: 'Mango Smoothie', category: 'drinks', aspect: 'square' },
]

const categoryTabs = [
  { id: 'all', label: 'All' },
  { id: 'food', label: 'Food' },
  { id: 'interior', label: 'Interior' },
  { id: 'chefs', label: 'Our Chefs' },
  { id: 'drinks', label: 'Drinks' },
]

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const filtered = activeCategory === 'all' ? galleryItems : galleryItems.filter((i) => i.category === activeCategory)

  const openLightbox = (idx: number) => setLightboxIdx(idx)
  const closeLightbox = () => setLightboxIdx(null)
  const prevItem = () => setLightboxIdx((i) => (i === null || i === 0) ? filtered.length - 1 : i - 1)
  const nextItem = () => setLightboxIdx((i) => (i === null) ? 0 : (i + 1) % filtered.length)

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero */}
      <section className="relative h-64 flex items-end pb-12 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&h=500&fit=crop&auto=format&q=80"
          alt="Gallery" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-darkest/88 via-primary-darkest/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-secondary text-sm font-semibold uppercase tracking-widest">Visual Journey</span>
            <h1 className="text-5xl font-bold text-white mt-1">Our Gallery</h1>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categoryTabs.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-primary hover:bg-primary/10 shadow-sm'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="masonry-grid">
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className="masonry-item"
              >
                <div
                  className="relative group cursor-pointer overflow-hidden rounded-2xl"
                  onClick={() => openLightbox(i)}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <ZoomIn size={22} className="text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium">{item.alt}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X size={20} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prevItem() }}
              className="absolute left-4 sm:left-8 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft size={22} />
            </button>
            <motion.div
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl max-h-[85vh] px-16"
            >
              <img
                src={filtered[lightboxIdx].src}
                alt={filtered[lightboxIdx].alt}
                className="max-w-full max-h-[80vh] object-contain rounded-xl"
              />
              <p className="text-white/60 text-sm text-center mt-4">{filtered[lightboxIdx].alt}</p>
            </motion.div>
            <button
              onClick={(e) => { e.stopPropagation(); nextItem() }}
              className="absolute right-4 sm:right-8 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight size={22} />
            </button>
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-sm">
              {lightboxIdx + 1} / {filtered.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
