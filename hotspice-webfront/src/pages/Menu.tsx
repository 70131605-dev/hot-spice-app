import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Star, Clock, Flame, Heart, ShoppingCart, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { fetchMenuItems, fetchCategories, type MenuItem, type Category } from '@/lib/catalogApi'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { useSearchParams } from 'react-router'

const ITEMS_PER_PAGE = 9

const sortOptions = [
  { label: 'Popular', value: 'popular' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Rating', value: 'rating' },
  { label: 'Prep Time', value: 'time' },
]

export default function Menu() {
  const [params] = useSearchParams()
  const initialCat = params.get('cat') || 'all'
  const [activeCategory, setActiveCategory] = useState(initialCat)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('popular')
  const [page, setPage] = useState(1)
  const [toast, setToast] = useState('')
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const { add, toggleFavorite, isFavorite } = useCart()

  useEffect(() => {
    Promise.all([fetchMenuItems(), fetchCategories()])
      .then(([items, cats]) => { setMenuItems(items); setCategories(cats) })
      .finally(() => setLoading(false))
  }, [])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const filtered = useMemo(() => {
    let items = [...menuItems]
    if (activeCategory !== 'all') items = items.filter((i) => i.category === activeCategory)
    if (search) items = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase()))
    switch (sort) {
      case 'price-asc': items.sort((a, b) => a.price - b.price); break
      case 'price-desc': items.sort((a, b) => b.price - a.price); break
      case 'rating': items.sort((a, b) => b.rating - a.rating); break
      case 'time': items.sort((a, b) => a.prepTime - b.prepTime); break
      case 'popular': items.sort((a, b) => b.ratingCount - a.ratingCount); break
    }
    return items
  }, [menuItems, activeCategory, search, sort])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat)
    setPage(1)
  }

  return (
    <div className="bg-cream-dark min-h-screen">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-dark text-white px-6 py-3 rounded-full shadow-xl text-sm font-medium"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="relative h-64 flex items-end pb-12 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&h=500&fit=crop&auto=format&q=80"
          alt="Menu" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-darkest/88 via-primary-darkest/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-secondary text-sm font-semibold uppercase tracking-widest">Explore</span>
            <h1 className="text-5xl font-bold text-white mt-1">Our Menu</h1>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-20 z-30 bg-cream-dark/95 backdrop-blur-md border-b border-primary/10 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                placeholder="Search dishes..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-primary/20 rounded-xl text-sm focus:outline-none focus:border-primary text-primary"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary">
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <SlidersHorizontal size={14} className="text-muted flex-shrink-0" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-white border border-primary/20 rounded-xl px-3 py-2.5 text-sm text-primary focus:outline-none focus:border-primary flex-shrink-0"
              >
                {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <span className="text-sm text-muted flex-shrink-0">{filtered.length} items</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Category Sidebar */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-warm p-4 sticky top-40">
              <h3 className="font-semibold text-primary text-sm uppercase tracking-wider mb-3 px-2">Categories</h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      activeCategory === cat.slug
                        ? 'bg-primary text-white'
                        : 'text-primary hover:bg-cream-dark'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Mobile Category Pills */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar col-span-full w-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                  activeCategory === cat.slug ? 'bg-primary text-white' : 'bg-white text-primary shadow-sm'
                }`}
              >
                <span>{cat.icon}</span> {cat.name}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="text-center py-24 text-muted">Loading menu...</div>
            ) : paginated.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-4xl mb-4">🍽️</p>
                <p className="text-muted text-lg">No dishes match your search.</p>
                <button onClick={() => { setSearch(''); setActiveCategory('all') }} className="mt-4 text-primary text-sm font-medium hover:underline">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                <AnimatePresence mode="popLayout">
                  {paginated.map((item, i) => (
                    <MenuCard key={item.id} item={item} index={i}
                      onAdd={() => { add(item); showToast(`${item.name} added!`) }}
                      onFavorite={() => toggleFavorite(item.id)}
                      isFav={isFavorite(item.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center text-primary disabled:opacity-30 hover:bg-primary hover:text-white transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-full text-sm font-semibold transition-colors ${
                      p === page ? 'bg-primary text-white' : 'border border-primary/20 text-primary hover:bg-primary/10'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center text-primary disabled:opacity-30 hover:bg-primary hover:text-white transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function MenuCard({ item, index, onAdd, onFavorite, isFav }: {
  item: MenuItem; index: number
  onAdd: () => void; onFavorite: () => void; isFav: boolean
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="bg-white rounded-2xl shadow-warm overflow-hidden group hover-lift border border-primary/10"
    >
      <div className="relative h-48 overflow-hidden">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white text-sm font-semibold bg-black/50 px-4 py-2 rounded-full">Sold Out</span>
          </div>
        )}
        {item.isSpecial && (
          <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Flame size={10} /> Today's Special
          </div>
        )}
        <button
          onClick={onFavorite}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md ${
            isFav ? 'bg-primary text-white' : 'bg-white/90 text-muted hover:bg-primary hover:text-white'
          }`}
        >
          <Heart size={15} className={isFav ? 'fill-white' : ''} />
        </button>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} size={11} className={i < Math.floor(item.rating) ? 'text-secondary fill-secondary' : 'text-muted-light fill-muted-light'} />
            ))}
            <span className="text-xs text-muted ml-1">{item.rating} ({item.ratingCount})</span>
          </div>
          {!item.isAvailable ? (
            <span className="text-xs text-muted font-medium">Unavailable</span>
          ) : (
            <span className="text-xs text-success font-medium">Available</span>
          )}
        </div>
        <h3 className="font-semibold text-primary text-base mb-1">{item.name}</h3>
        <p className="text-muted text-xs line-clamp-2 mb-3 leading-relaxed">{item.description}</p>
        <div className="flex items-center gap-3 text-xs text-muted mb-4">
          <span className="flex items-center gap-1"><Clock size={11} /> {item.prepTime}m</span>
          <span className="flex items-center gap-1"><Flame size={11} /> {item.calories} cal</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="inline-block bg-secondary text-white text-sm font-bold px-3.5 py-1.5 rounded-full">{formatPrice(item.price)}</span>
          <button
            onClick={onAdd}
            disabled={!item.isAvailable}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-dark disabled:bg-gray-200 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            <ShoppingCart size={13} /> Add
          </button>
        </div>
      </div>
    </motion.div>
  )
}
