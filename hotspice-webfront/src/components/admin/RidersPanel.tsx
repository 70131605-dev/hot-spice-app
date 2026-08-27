import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, X, Bike, Phone } from 'lucide-react'
import adminApiClient from '@/lib/adminApi'
import { formatPrice } from '@/lib/utils'
import type { AdminRider, AdminOrder } from '@/lib/adminTypes'

type RiderForm = { name: string; phone: string; is_active: boolean }
const EMPTY_FORM: RiderForm = { name: '', phone: '', is_active: true }

export default function RidersPanel() {
  const [riders, setRiders] = useState<AdminRider[]>([])
  const [unassigned, setUnassigned] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<RiderForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [deleteError, setDeleteError] = useState('')

  const load = async () => {
    try {
      setError('')
      const [ridersRes, unassignedRes] = await Promise.all([
        adminApiClient.get('/riders'),
        adminApiClient.get('/orders', { params: { unassigned: 1 } }),
      ])
      setRiders(ridersRes.data)
      setUnassigned(unassignedRes.data)
    } catch {
      setError('Could not load riders.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setModalOpen(true)
  }

  const openEdit = (rider: AdminRider) => {
    setEditingId(rider.id)
    setForm({ name: rider.name, phone: rider.phone, is_active: rider.is_active })
    setFormError('')
    setModalOpen(true)
  }

  const submitForm = async () => {
    setSaving(true)
    setFormError('')
    try {
      if (editingId) {
        await adminApiClient.put(`/riders/${editingId}`, form)
      } else {
        await adminApiClient.post('/riders', form)
      }
      setModalOpen(false)
      await load()
    } catch (err: any) {
      const msg = err.response?.data?.errors
        ? Object.values(err.response.data.errors)[0]
        : err.response?.data?.message
      setFormError(Array.isArray(msg) ? msg[0] : (msg || 'Could not save rider.'))
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async (id: number) => {
    setDeleteError('')
    try {
      await adminApiClient.delete(`/riders/${id}`)
      setDeleteConfirmId(null)
      await load()
    } catch (err: any) {
      setDeleteError(err.response?.data?.message || 'Could not delete rider.')
    }
  }

  const assignRider = async (orderId: number, riderId: number) => {
    try {
      await adminApiClient.patch(`/orders/${orderId}/rider`, { rider_id: riderId })
      await load()
    } catch {
      setError('Could not assign rider to that order.')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-white">Riders &amp; Delivery</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-colors">
          <Plus size={14} /> Add Rider
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="text-white/30 text-sm text-center py-10">Loading riders...</div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Riders list */}
          <div className="space-y-3">
            {riders.length === 0 && (
              <div className="bg-dark rounded-2xl p-6 border border-white/5 text-center text-white/30 text-sm">
                No riders yet. Add your first rider to start assigning deliveries.
              </div>
            )}
            {riders.map((rider) => (
              <div key={rider.id} className="bg-dark rounded-2xl p-5 border border-white/5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                      <Bike size={15} />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{rider.name}</p>
                      <p className="text-white/40 text-xs flex items-center gap-1"><Phone size={10} /> {rider.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${rider.is_active ? 'bg-success/10 text-success' : 'bg-white/5 text-white/40'}`}>
                      {rider.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <button onClick={() => openEdit(rider)} className="p-1.5 rounded-lg bg-white/5 hover:bg-secondary/20 text-white/40 hover:text-secondary transition-colors">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => { setDeleteConfirmId(rider.id); setDeleteError('') }} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {deleteConfirmId === rider.id && (
                  <div className="mt-3 p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                    <p className="text-xs text-white/60 mb-2">Delete {rider.name}? This can't be undone.</p>
                    {deleteError && <p className="text-xs text-red-400 mb-2">{deleteError}</p>}
                    <div className="flex gap-2">
                      <button onClick={() => confirmDelete(rider.id)} className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-semibold rounded-lg">Delete</button>
                      <button onClick={() => setDeleteConfirmId(null)} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/50 text-xs font-semibold rounded-lg">Cancel</button>
                    </div>
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-xs text-white/30 mb-2">{rider.active_orders_count ?? 0} active {(rider.active_orders_count ?? 0) === 1 ? 'delivery' : 'deliveries'}</p>
                  {rider.orders && rider.orders.length > 0 && (
                    <div className="space-y-1.5">
                      {rider.orders.map((o) => (
                        <div key={o.id} className="flex items-center justify-between text-xs">
                          <span className="text-white/60">{o.order_number} · {o.user?.name}</span>
                          <span className="text-white/30">{formatPrice(Number(o.total))}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Unassigned deliveries */}
          <div className="bg-dark rounded-2xl p-5 border border-white/5 h-fit">
            <h3 className="font-semibold text-white text-sm mb-4">Unassigned Deliveries</h3>
            {unassigned.length === 0 ? (
              <p className="text-white/30 text-xs">Nothing waiting on a rider right now.</p>
            ) : (
              <div className="space-y-3">
                {unassigned.map((o) => (
                  <div key={o.id} className="flex items-center justify-between gap-3 py-2.5 border-b border-white/5 last:border-0">
                    <div>
                      <p className="text-white text-xs font-medium">{o.order_number}</p>
                      <p className="text-white/30 text-xs">{o.user?.name} · {formatPrice(Number(o.total))}</p>
                    </div>
                    <select
                      defaultValue=""
                      onChange={(e) => e.target.value && assignRider(o.id, Number(e.target.value))}
                      className="bg-dark-deep border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
                    >
                      <option value="" disabled>Assign rider</option>
                      {riders.filter((r) => r.is_active).map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setModalOpen(false)}>
          <div className="bg-dark rounded-2xl border border-white/10 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-white font-semibold">{editingId ? 'Edit Rider' : 'Add Rider'}</h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {formError && <p className="text-red-400 text-xs">{formError}</p>}
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full bg-dark-deep border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full bg-dark-deep border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>
              {editingId && (
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                    className="accent-primary"
                  />
                  Active
                </label>
              )}
              <button
                onClick={submitForm}
                disabled={saving || !form.name || !form.phone}
                className="w-full py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-sm"
              >
                {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Rider'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
