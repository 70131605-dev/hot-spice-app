import { useEffect, useMemo, useState } from 'react'
import { Search, X, MapPin, Package, User as UserIcon, Bike } from 'lucide-react'
import adminApiClient from '@/lib/adminApi'
import { formatPrice } from '@/lib/utils'
import {
  type AdminOrder, type AdminRider, type AdminOrderStatus,
  ORDER_STATUSES, ORDER_STATUS_LABEL, ORDER_STATUS_COLOR,
} from '@/lib/adminTypes'

export default function OrdersPanel() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [riders, setRiders] = useState<AdminRider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [savingStatus, setSavingStatus] = useState(false)
  const [savingRider, setSavingRider] = useState(false)

  const loadOrders = async () => {
    try {
      setError('')
      const res = await adminApiClient.get('/orders')
      setOrders(res.data)
    } catch {
      setError('Could not load orders.')
    } finally {
      setLoading(false)
    }
  }

  const loadRiders = async () => {
    try {
      const res = await adminApiClient.get('/riders')
      setRiders(res.data)
    } catch {
      // rider assignment just won't be available; orders still usable
    }
  }

  useEffect(() => {
    loadOrders()
    loadRiders()
  }, [])

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter && o.status !== statusFilter) return false
      if (search) {
        const s = search.toLowerCase()
        const matches = o.order_number.toLowerCase().includes(s)
          || o.user?.name?.toLowerCase().includes(s)
          || o.user?.email?.toLowerCase().includes(s)
        if (!matches) return false
      }
      return true
    })
  }, [orders, statusFilter, search])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length }
    for (const status of ORDER_STATUSES) c[status] = orders.filter((o) => o.status === status).length
    return c
  }, [orders])

  const selected = orders.find((o) => o.id === selectedId) || null

  const updateStatus = async (id: number, status: AdminOrderStatus) => {
    setSavingStatus(true)
    try {
      const res = await adminApiClient.patch(`/orders/${id}/status`, { status })
      setOrders((prev) => prev.map((o) => (o.id === id ? res.data : o)))
    } catch {
      setError('Could not update order status.')
    } finally {
      setSavingStatus(false)
    }
  }

  const assignRider = async (id: number, riderId: number | null) => {
    setSavingRider(true)
    try {
      const res = await adminApiClient.patch(`/orders/${id}/rider`, { rider_id: riderId })
      setOrders((prev) => prev.map((o) => (o.id === id ? res.data : o)))
    } catch {
      setError('Could not assign rider.')
    } finally {
      setSavingRider(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-white">Orders</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Order # or customer..."
              className="bg-dark border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary w-56"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-dark border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
          >
            <option value="">All statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        <div className="bg-dark rounded-xl p-3 border border-white/5 text-center">
          <div className="text-lg font-bold text-white">{counts.all}</div>
          <div className="text-xs text-white/40 mt-0.5">All</div>
        </div>
        {ORDER_STATUSES.map((s) => (
          <div key={s} className="bg-dark rounded-xl p-3 border border-white/5 text-center">
            <div className={`text-lg font-bold ${ORDER_STATUS_COLOR[s].color}`}>{counts[s] ?? 0}</div>
            <div className="text-xs text-white/40 mt-0.5">{ORDER_STATUS_LABEL[s]}</div>
          </div>
        ))}
      </div>

      <div className="bg-dark rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-xs font-semibold text-white/30 uppercase tracking-wider">Order</th>
                <th className="text-left p-4 text-xs font-semibold text-white/30 uppercase tracking-wider">Customer</th>
                <th className="text-left p-4 text-xs font-semibold text-white/30 uppercase tracking-wider hidden sm:table-cell">Type</th>
                <th className="text-left p-4 text-xs font-semibold text-white/30 uppercase tracking-wider">Total</th>
                <th className="text-left p-4 text-xs font-semibold text-white/30 uppercase tracking-wider hidden md:table-cell">Rider</th>
                <th className="text-left p-4 text-xs font-semibold text-white/30 uppercase tracking-wider">Status</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} className="p-6 text-center text-white/30 text-sm">Loading orders...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={7} className="p-6 text-center text-white/30 text-sm">No orders match.</td></tr>
              )}
              {!loading && filtered.map((o) => {
                const { color, bg } = ORDER_STATUS_COLOR[o.status]
                return (
                  <tr key={o.id} className="border-b border-white/5 hover:bg-white/2 transition-colors cursor-pointer" onClick={() => setSelectedId(o.id)}>
                    <td className="p-4">
                      <span className="text-white text-sm font-medium">{o.order_number}</span>
                      <p className="text-white/30 text-xs mt-0.5">{new Date(o.created_at).toLocaleString()}</p>
                    </td>
                    <td className="p-4">
                      <span className="text-white/70 text-sm">{o.user?.name}</span>
                      <p className="text-white/30 text-xs">{o.user?.email}</p>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className="text-white/50 text-xs capitalize">{o.order_type}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-secondary text-sm font-semibold">{formatPrice(Number(o.total))}</span>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-white/50 text-xs">{o.rider?.name || '—'}</span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${color} ${bg}`}>{ORDER_STATUS_LABEL[o.status]}</span>
                    </td>
                    <td className="p-4">
                      <button onClick={(e) => { e.stopPropagation(); setSelectedId(o.id) }} className="text-xs text-primary hover:underline">View</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setSelectedId(null)}>
          <div className="bg-dark rounded-2xl border border-white/10 w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-white/5 flex items-center justify-between sticky top-0 bg-dark">
              <div>
                <h3 className="text-white font-semibold">{selected.order_number}</h3>
                <p className="text-white/30 text-xs">{new Date(selected.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedId(null)} className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div className="flex items-start gap-3">
                <UserIcon size={15} className="text-white/30 mt-0.5" />
                <div>
                  <p className="text-white text-sm font-medium">{selected.user?.name}</p>
                  <p className="text-white/40 text-xs">{selected.user?.email}</p>
                  <p className="text-white/40 text-xs">{selected.user?.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                {selected.order_type === 'delivery' ? <MapPin size={15} className="text-white/30 mt-0.5" /> : <Package size={15} className="text-white/30 mt-0.5" />}
                <div>
                  <p className="text-white text-sm font-medium capitalize">{selected.order_type}</p>
                  {selected.order_type === 'delivery' && (
                    <p className="text-white/40 text-xs">{selected.delivery_address || 'No address provided'}</p>
                  )}
                  {selected.notes && <p className="text-white/30 text-xs mt-1">Note: {selected.notes}</p>}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-2">Items</p>
                <div className="space-y-2">
                  {selected.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-white/70">{item.quantity}× {item.item_name}</span>
                      <span className="text-white/50">{formatPrice(Number(item.line_total))}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/5 mt-3 pt-3 space-y-1">
                  <div className="flex justify-between text-xs text-white/40"><span>Subtotal</span><span>{formatPrice(Number(selected.subtotal))}</span></div>
                  {Number(selected.discount_amount) > 0 && (
                    <div className="flex justify-between text-xs text-success"><span>Discount {selected.coupon_code ? `(${selected.coupon_code})` : ''}</span><span>-{formatPrice(Number(selected.discount_amount))}</span></div>
                  )}
                  {selected.order_type === 'delivery' && (
                    <div className="flex justify-between text-xs text-white/40"><span>Delivery Fee</span><span>{formatPrice(Number(selected.delivery_fee))}</span></div>
                  )}
                  <div className="flex justify-between text-sm font-semibold text-white pt-1"><span>Total</span><span className="text-secondary">{formatPrice(Number(selected.total))}</span></div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-2">Status</p>
                <select
                  value={selected.status}
                  disabled={savingStatus}
                  onChange={(e) => updateStatus(selected.id, e.target.value as AdminOrderStatus)}
                  className="w-full bg-dark-deep border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary disabled:opacity-50"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>
                  ))}
                </select>
              </div>

              {selected.order_type === 'delivery' && (
                <div>
                  <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Bike size={12} /> Assigned Rider
                  </p>
                  <select
                    value={selected.rider_id ?? ''}
                    disabled={savingRider}
                    onChange={(e) => assignRider(selected.id, e.target.value ? Number(e.target.value) : null)}
                    className="w-full bg-dark-deep border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary disabled:opacity-50"
                  >
                    <option value="">Unassigned</option>
                    {riders.filter((r) => r.is_active).map((r) => (
                      <option key={r.id} value={r.id}>{r.name} · {r.phone}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
