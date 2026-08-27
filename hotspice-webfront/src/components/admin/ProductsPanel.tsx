import { useEffect, useMemo, useState } from 'react'
import { Plus, Edit2, Trash2, X, Search, Star } from 'lucide-react'
import adminApiClient from '@/lib/adminApi'
import { formatPrice } from '@/lib/utils'
import type { AdminCategory, AdminMenuItem } from '@/lib/adminTypes'

type CategoryForm = { name: string; icon: string; description: string; is_active: boolean }
const EMPTY_CATEGORY_FORM: CategoryForm = { name: '', icon: '', description: '', is_active: true }

type ItemForm = {
  category_id: string; name: string; description: string; price: string; image: string
  calories: string; prep_time: string; tags: string
  is_available: boolean; is_featured: boolean; is_special: boolean
}
const EMPTY_ITEM_FORM: ItemForm = {
  category_id: '', name: '', description: '', price: '', image: '',
  calories: '', prep_time: '', tags: '',
  is_available: true, is_featured: false, is_special: false,
}

export default function ProductsPanel() {
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [items, setItems] = useState<AdminMenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null)

  const [catModalOpen, setCatModalOpen] = useState(false)
  const [editingCatId, setEditingCatId] = useState<number | null>(null)
  const [catForm, setCatForm] = useState<CategoryForm>(EMPTY_CATEGORY_FORM)
  const [catSaving, setCatSaving] = useState(false)
  const [catError, setCatError] = useState('')
  const [catDeleteError, setCatDeleteError] = useState<{ id: number; message: string } | null>(null)

  const [itemModalOpen, setItemModalOpen] = useState(false)
  const [editingItemId, setEditingItemId] = useState<number | null>(null)
  const [itemForm, setItemForm] = useState<ItemForm>(EMPTY_ITEM_FORM)
  const [itemSaving, setItemSaving] = useState(false)
  const [itemError, setItemError] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [itemDeleteError, setItemDeleteError] = useState('')

  const load = async () => {
    try {
      setError('')
      const [catsRes, itemsRes] = await Promise.all([
        adminApiClient.get('/categories'),
        adminApiClient.get('/menu-items'),
      ])
      setCategories(catsRes.data)
      setItems(itemsRes.data)
    } catch {
      setError('Could not load products.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (categoryFilter !== null && item.category_id !== categoryFilter) return false
      if (search) {
        const s = search.toLowerCase()
        if (!item.name.toLowerCase().includes(s) && !(item.category?.name || '').toLowerCase().includes(s)) return false
      }
      return true
    })
  }, [items, search, categoryFilter])

  // ── Categories ──
  const openAddCategory = () => {
    setEditingCatId(null)
    setCatForm(EMPTY_CATEGORY_FORM)
    setCatError('')
    setCatModalOpen(true)
  }

  const openEditCategory = (cat: AdminCategory) => {
    setEditingCatId(cat.id)
    setCatForm({ name: cat.name, icon: cat.icon || '', description: cat.description || '', is_active: cat.is_active })
    setCatError('')
    setCatModalOpen(true)
  }

  const submitCategory = async () => {
    setCatSaving(true)
    setCatError('')
    try {
      if (editingCatId) {
        await adminApiClient.put(`/categories/${editingCatId}`, catForm)
      } else {
        await adminApiClient.post('/categories', catForm)
      }
      setCatModalOpen(false)
      await load()
    } catch (err: any) {
      const msg = err.response?.data?.errors ? Object.values(err.response.data.errors)[0] : err.response?.data?.message
      setCatError(Array.isArray(msg) ? msg[0] : (msg || 'Could not save category.'))
    } finally {
      setCatSaving(false)
    }
  }

  const deleteCategory = async (id: number) => {
    setCatDeleteError(null)
    try {
      await adminApiClient.delete(`/categories/${id}`)
      if (categoryFilter === id) setCategoryFilter(null)
      await load()
    } catch (err: any) {
      setCatDeleteError({ id, message: err.response?.data?.message || 'Could not delete category.' })
    }
  }

  // ── Items ──
  const openAddItem = () => {
    setEditingItemId(null)
    setItemForm({ ...EMPTY_ITEM_FORM, category_id: categories[0] ? String(categories[0].id) : '' })
    setItemError('')
    setItemModalOpen(true)
  }

  const openEditItem = (item: AdminMenuItem) => {
    setEditingItemId(item.id)
    setItemForm({
      category_id: String(item.category_id),
      name: item.name,
      description: item.description || '',
      price: String(item.price),
      image: item.image || '',
      calories: item.calories != null ? String(item.calories) : '',
      prep_time: item.prep_time != null ? String(item.prep_time) : '',
      tags: (item.tags || []).join(', '),
      is_available: item.is_available,
      is_featured: item.is_featured,
      is_special: item.is_special,
    })
    setItemError('')
    setItemModalOpen(true)
  }

  const submitItem = async () => {
    setItemSaving(true)
    setItemError('')
    const payload = {
      category_id: Number(itemForm.category_id),
      name: itemForm.name,
      description: itemForm.description || undefined,
      price: Number(itemForm.price),
      image: itemForm.image || undefined,
      calories: itemForm.calories ? Number(itemForm.calories) : undefined,
      prep_time: itemForm.prep_time ? Number(itemForm.prep_time) : undefined,
      tags: itemForm.tags ? itemForm.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      is_available: itemForm.is_available,
      is_featured: itemForm.is_featured,
      is_special: itemForm.is_special,
    }
    try {
      if (editingItemId) {
        await adminApiClient.put(`/menu-items/${editingItemId}`, payload)
      } else {
        await adminApiClient.post('/menu-items', payload)
      }
      setItemModalOpen(false)
      await load()
    } catch (err: any) {
      const msg = err.response?.data?.errors ? Object.values(err.response.data.errors)[0] : err.response?.data?.message
      setItemError(Array.isArray(msg) ? msg[0] : (msg || 'Could not save item.'))
    } finally {
      setItemSaving(false)
    }
  }

  const toggleField = async (item: AdminMenuItem, field: 'is_available' | 'is_featured') => {
    try {
      const res = await adminApiClient.put(`/menu-items/${item.id}`, {
        category_id: item.category_id,
        name: item.name,
        price: item.price,
        [field]: !item[field],
      })
      setItems((prev) => prev.map((i) => (i.id === item.id ? res.data : i)))
    } catch {
      setError('Could not update item.')
    }
  }

  const confirmDeleteItem = async (id: number) => {
    setItemDeleteError('')
    try {
      await adminApiClient.delete(`/menu-items/${id}`)
      setDeleteConfirmId(null)
      await load()
    } catch (err: any) {
      setItemDeleteError(err.response?.data?.message || 'Could not delete item.')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-white">Products</h1>
        <div className="flex items-center gap-3">
          <button onClick={openAddCategory} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-xl transition-colors">
            <Plus size={14} /> Category
          </button>
          <button onClick={openAddItem} className="flex items-center gap-2 px-4 py-2 bg-[#0D5969] hover:bg-[#093E4A] text-white text-sm font-semibold rounded-xl transition-colors">
            <Plus size={14} /> Add Item
          </button>
        </div>
      </div>

      {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>}

      {/* Category chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setCategoryFilter(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${categoryFilter === null ? 'bg-[#0D5969] text-white' : 'bg-white/5 text-white/50 hover:text-white'}`}
        >
          All ({items.length})
        </button>
        {categories.map((cat) => (
          <div key={cat.id} className="relative flex-shrink-0 group">
            <button
              onClick={() => setCategoryFilter(cat.id)}
              className={`flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${categoryFilter === cat.id ? 'bg-[#0D5969] text-white' : 'bg-white/5 text-white/50 hover:text-white'}`}
            >
              <span>{cat.icon}</span> {cat.name} ({cat.menu_items_count ?? 0})
              <span onClick={(e) => { e.stopPropagation(); openEditCategory(cat) }} className="ml-1 p-0.5 rounded hover:bg-white/20">
                <Edit2 size={10} />
              </span>
              <span onClick={(e) => { e.stopPropagation(); deleteCategory(cat.id) }} className="p-0.5 rounded hover:bg-red-500/30">
                <Trash2 size={10} />
              </span>
            </button>
            {catDeleteError?.id === cat.id && (
              <div className="absolute top-full left-0 mt-1 w-56 p-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs z-10">
                {catDeleteError.message}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-64">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search items..."
          className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#0D5969]"
        />
      </div>

      <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-xs font-semibold text-white/30 uppercase tracking-wider">Item</th>
                <th className="text-left p-4 text-xs font-semibold text-white/30 uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="text-left p-4 text-xs font-semibold text-white/30 uppercase tracking-wider">Price</th>
                <th className="text-left p-4 text-xs font-semibold text-white/30 uppercase tracking-wider hidden md:table-cell">Rating</th>
                <th className="text-left p-4 text-xs font-semibold text-white/30 uppercase tracking-wider">Status</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={6} className="p-6 text-center text-white/30 text-sm">Loading products...</td></tr>}
              {!loading && filteredItems.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center text-white/30 text-sm">No items match.</td></tr>
              )}
              {!loading && filteredItems.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={item.image || undefined} alt={item.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0 bg-white/5" />
                      <div>
                        <span className="text-white text-sm font-medium">{item.name}</span>
                        {item.is_featured && <span className="ml-2 text-[10px] text-[#F77F00]">★ Featured</span>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className="text-white/50 text-xs">{item.category?.icon} {item.category?.name}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-[#F77F00] text-sm font-semibold">{formatPrice(Number(item.price))}</span>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="text-white/60 text-xs flex items-center gap-1"><Star size={11} className="fill-white/40" /> {item.rating} ({item.rating_count})</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleField(item, 'is_available')}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${item.is_available ? 'bg-[#2ECC71]/10 text-[#2ECC71]' : 'bg-red-500/10 text-red-400'}`}
                      >
                        {item.is_available ? 'Available' : 'Sold Out'}
                      </button>
                      <button
                        onClick={() => toggleField(item, 'is_featured')}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${item.is_featured ? 'bg-[#F77F00]/10 text-[#F77F00]' : 'bg-white/5 text-white/30'}`}
                      >
                        Featured
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEditItem(item)} className="p-1.5 rounded-lg bg-white/5 hover:bg-[#F77F00]/20 text-white/40 hover:text-[#F77F00] transition-colors">
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => { setDeleteConfirmId(deleteConfirmId === item.id ? null : item.id); setItemDeleteError('') }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    {deleteConfirmId === item.id && (
                      <div className="absolute right-6 mt-2 p-3 bg-[#1A1A1A] border border-red-500/30 rounded-xl z-10 w-56">
                        <p className="text-xs text-white/60 mb-2">Delete {item.name}?</p>
                        {itemDeleteError && <p className="text-xs text-red-400 mb-2">{itemDeleteError}</p>}
                        <div className="flex gap-2">
                          <button onClick={() => confirmDeleteItem(item.id)} className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-semibold rounded-lg">Delete</button>
                          <button onClick={() => setDeleteConfirmId(null)} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/50 text-xs font-semibold rounded-lg">Cancel</button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category modal */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setCatModalOpen(false)}>
          <div className="bg-[#1A1A1A] rounded-2xl border border-white/10 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-white font-semibold">{editingCatId ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setCatModalOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              {catError && <p className="text-red-400 text-xs">{catError}</p>}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Name</label>
                <input value={catForm.name} onChange={(e) => setCatForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full bg-[#111111] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#0D5969]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Icon (emoji)</label>
                <input value={catForm.icon} onChange={(e) => setCatForm((f) => ({ ...f, icon: e.target.value }))} placeholder="🍕"
                  className="w-full bg-[#111111] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#0D5969]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Description</label>
                <textarea value={catForm.description} onChange={(e) => setCatForm((f) => ({ ...f, description: e.target.value }))} rows={2}
                  className="w-full bg-[#111111] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#0D5969]" />
              </div>
              {editingCatId && (
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input type="checkbox" checked={catForm.is_active} onChange={(e) => setCatForm((f) => ({ ...f, is_active: e.target.checked }))} className="accent-[#0D5969]" />
                  Active (visible to customers)
                </label>
              )}
              <button onClick={submitCategory} disabled={catSaving || !catForm.name} className="w-full py-3 bg-[#0D5969] hover:bg-[#093E4A] disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-sm">
                {catSaving ? 'Saving...' : editingCatId ? 'Save Changes' : 'Add Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Item modal */}
      {itemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setItemModalOpen(false)}>
          <div className="bg-[#1A1A1A] rounded-2xl border border-white/10 w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#1A1A1A]">
              <h3 className="text-white font-semibold">{editingItemId ? 'Edit Item' : 'Add Item'}</h3>
              <button onClick={() => setItemModalOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              {itemError && <p className="text-red-400 text-xs">{itemError}</p>}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Category</label>
                <select value={itemForm.category_id} onChange={(e) => setItemForm((f) => ({ ...f, category_id: e.target.value }))}
                  className="w-full bg-[#111111] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#0D5969]">
                  <option value="" disabled>Select category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Name</label>
                <input value={itemForm.name} onChange={(e) => setItemForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full bg-[#111111] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#0D5969]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Description</label>
                <textarea value={itemForm.description} onChange={(e) => setItemForm((f) => ({ ...f, description: e.target.value }))} rows={2}
                  className="w-full bg-[#111111] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#0D5969]" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Price</label>
                  <input type="number" step="0.01" value={itemForm.price} onChange={(e) => setItemForm((f) => ({ ...f, price: e.target.value }))}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#0D5969]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Calories</label>
                  <input type="number" value={itemForm.calories} onChange={(e) => setItemForm((f) => ({ ...f, calories: e.target.value }))}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#0D5969]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Prep (min)</label>
                  <input type="number" value={itemForm.prep_time} onChange={(e) => setItemForm((f) => ({ ...f, prep_time: e.target.value }))}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#0D5969]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Image URL</label>
                <input value={itemForm.image} onChange={(e) => setItemForm((f) => ({ ...f, image: e.target.value }))} placeholder="https://..."
                  className="w-full bg-[#111111] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#0D5969]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Tags (comma separated)</label>
                <input value={itemForm.tags} onChange={(e) => setItemForm((f) => ({ ...f, tags: e.target.value }))} placeholder="vegetarian, bestseller"
                  className="w-full bg-[#111111] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#0D5969]" />
              </div>
              <div className="flex items-center gap-5">
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input type="checkbox" checked={itemForm.is_available} onChange={(e) => setItemForm((f) => ({ ...f, is_available: e.target.checked }))} className="accent-[#0D5969]" />
                  Available
                </label>
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input type="checkbox" checked={itemForm.is_featured} onChange={(e) => setItemForm((f) => ({ ...f, is_featured: e.target.checked }))} className="accent-[#0D5969]" />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input type="checkbox" checked={itemForm.is_special} onChange={(e) => setItemForm((f) => ({ ...f, is_special: e.target.checked }))} className="accent-[#0D5969]" />
                  Today's Special
                </label>
              </div>
              <button
                onClick={submitItem}
                disabled={itemSaving || !itemForm.name || !itemForm.price || !itemForm.category_id}
                className="w-full py-3 bg-[#0D5969] hover:bg-[#093E4A] disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-sm"
              >
                {itemSaving ? 'Saving...' : editingItemId ? 'Save Changes' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
