import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import {
  User, Calendar, ShoppingBag, Heart, Settings, LogOut,
  Edit2, Save, X, Phone, Mail, Clock, CheckCircle, XCircle,
  ChevronRight, Star, Utensils,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import apiClient from '@/lib/api'
import { fetchMenuItems, type MenuItem } from '@/lib/catalogApi'
import { formatPrice } from '@/lib/utils'

const mockReservations = [
  { id: 'RF-001234', date: '2025-08-15', time: '7:30 PM', guests: 4, status: 'confirmed', notes: 'Anniversary dinner' },
  { id: 'RF-001198', date: '2025-07-22', time: '8:00 PM', guests: 2, status: 'confirmed', notes: '' },
  { id: 'RF-001056', date: '2025-06-10', time: '6:00 PM', guests: 6, status: 'completed', notes: 'Birthday celebration' },
]

type OrderItem = { id: number; item_name: string; quantity: number; line_total: string }
type Order = { id: number; order_number: string; total: string; status: string; created_at: string; items: OrderItem[] }

const statusConfig: Record<string, { color: string; bg: string; icon: typeof CheckCircle }> = {
  confirmed: { color: 'text-[#2ECC71]', bg: 'bg-[#2ECC71]/10', icon: CheckCircle },
  pending: { color: 'text-[#F77F00]', bg: 'bg-[#F77F00]/10', icon: Clock },
  preparing: { color: 'text-[#3498DB]', bg: 'bg-[#3498DB]/10', icon: Clock },
  out_for_delivery: { color: 'text-[#0D5969]', bg: 'bg-[#0D5969]/10', icon: Clock },
  completed: { color: 'text-[#8B7355]', bg: 'bg-[#8B7355]/10', icon: CheckCircle },
  cancelled: { color: 'text-red-500', bg: 'bg-red-500/10', icon: XCircle },
  delivered: { color: 'text-[#2ECC71]', bg: 'bg-[#2ECC71]/10', icon: CheckCircle },
}

const tabs = [
  { id: 'overview', label: 'Overview', Icon: User },
  { id: 'reservations', label: 'Reservations', Icon: Calendar },
  { id: 'orders', label: 'My Orders', Icon: ShoppingBag },
  { id: 'favorites', label: 'Favorites', Icon: Heart },
  { id: 'settings', label: 'Settings', Icon: Settings },
]

export default function UserDashboard() {
  const { user, token, logout, updateProfile } = useAuth()
  const navigate = useNavigate()
  const { favorites } = useCart()
  const [activeTab, setActiveTab] = useState('overview')
  const [editing, setEditing] = useState(false)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  const displayName = user ? (user.fullName || (user as any).name || user.email || 'Guest') : 'Guest'
  const firstName = displayName.split(' ')[0]
  const [profileForm, setProfileForm] = useState({ fullName: displayName, phone: user?.phone || '' })

  useEffect(() => {
    fetchMenuItems().then(setMenuItems)
  }, [])

  useEffect(() => {
    if (!token) { setOrdersLoading(false); return }
    apiClient.get('/orders')
      .then((res) => setOrders(res.data))
      .catch(() => {})
      .finally(() => setOrdersLoading(false))
  }, [token])

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8B7355] mb-4">Please sign in to access your dashboard.</p>
          <Link to="/login" className="px-6 py-3 bg-[#0D5969] text-white rounded-full font-semibold">Sign In</Link>
        </div>
      </div>
    )
  }

  const handleSaveProfile = () => {
    updateProfile(profileForm)
    setEditing(false)
  }

  const favItems = menuItems.filter((m) => favorites.includes(m.id))

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A1A1A] flex-col hidden md:flex">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Hot N Spice" className="h-8 w-auto object-contain" />
          </Link>
        </div>

        {/* User */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={displayName} className="w-11 h-11 rounded-full object-cover" />
            ) : (
              <div className="w-11 h-11 rounded-full bg-[#0D5969] flex items-center justify-center text-white font-bold text-lg">
                {displayName.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-white font-medium text-sm">{user.fullName}</p>
              <p className="text-white/40 text-xs">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === id ? 'bg-[#0D5969] text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-white/5 transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Tabs */}
        <div className="md:hidden bg-[#1A1A1A] p-3 flex gap-1 overflow-x-auto no-scrollbar sticky top-0 z-10">
          {tabs.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
                activeTab === id ? 'bg-[#0D5969] text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}>
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        <div className="p-6 max-w-4xl mx-auto">
          {/* Overview */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h1 className="text-2xl font-bold text-[#0D5969]">Welcome back, {firstName}! 👋</h1>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Reservations', value: mockReservations.length, Icon: Calendar, color: '#0D5969' },
                  { label: 'Orders', value: orders.length, Icon: ShoppingBag, color: '#F77F00' },
                  { label: 'Favorites', value: favItems.length, Icon: Heart, color: '#0D5969' },
                  { label: 'Member Since', value: user.createdAt?.split('-')[0] || 'N/A', Icon: Star, color: '#F77F00' },
                ].map(({ label, value, Icon, color }) => (
                  <div key={label} className="bg-white rounded-2xl p-5 shadow-warm">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${color}15` }}>
                      <Icon size={17} style={{ color }} />
                    </div>
                    <div className="text-2xl font-bold text-[#0D5969]">{value}</div>
                    <div className="text-sm text-[#8B7355]">{label}</div>
                  </div>
                ))}
              </div>

              {/* Recent Reservation */}
              <div className="bg-white rounded-2xl shadow-warm p-6">
                <h3 className="font-semibold text-[#0D5969] mb-4 flex items-center gap-2">
                  <Calendar size={16} className="text-[#0D5969]" /> Upcoming Reservation
                </h3>
                {mockReservations.filter((r) => r.status === 'confirmed')[0] ? (() => {
                  const r = mockReservations.filter((r) => r.status === 'confirmed')[0]
                  return (
                    <div className="bg-[#FFF8F0] rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <p className="font-semibold text-[#0D5969]">{r.date} at {r.time}</p>
                        <p className="text-sm text-[#8B7355]">{r.guests} guests{r.notes ? ` · ${r.notes}` : ''}</p>
                        <p className="text-xs text-[#0D5969] font-medium mt-1">#{r.id}</p>
                      </div>
                      <span className="px-3 py-1 bg-[#2ECC71]/10 text-[#2ECC71] rounded-full text-xs font-semibold">
                        Confirmed
                      </span>
                    </div>
                  )
                })() : (
                  <div className="text-center py-6 text-[#8B7355]">
                    <Calendar size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No upcoming reservations</p>
                    <Link to="/reservation" className="text-[#0D5969] text-xs font-medium mt-1 hover:underline inline-block">Book a table →</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Reservations */}
          {activeTab === 'reservations' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#0D5969]">My Reservations</h1>
                <Link to="/reservation" className="px-4 py-2 bg-[#0D5969] text-white text-sm font-semibold rounded-full">+ New</Link>
              </div>
              {mockReservations.map((r) => {
                const { color, bg, icon: StatusIcon } = statusConfig[r.status as keyof typeof statusConfig]
                return (
                  <div key={r.id} className="bg-white rounded-2xl shadow-warm p-5 flex items-center gap-4 flex-wrap">
                    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                      <StatusIcon size={18} className={color} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#0D5969]">{r.date} at {r.time}</p>
                      <p className="text-sm text-[#8B7355]">{r.guests} guests{r.notes ? ` · ${r.notes}` : ''}</p>
                      <p className="text-xs text-[#8B7355]/60 mt-0.5">#{r.id}</p>
                    </div>
                    <span className={`px-3 py-1 ${bg} ${color} rounded-full text-xs font-semibold capitalize`}>{r.status}</span>
                  </div>
                )
              })}
            </motion.div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h1 className="text-2xl font-bold text-[#0D5969]">My Orders</h1>
              {ordersLoading ? (
                <div className="text-center py-16 text-[#8B7355]">Loading your orders...</div>
              ) : (
                <>
                  {orders.map((o) => {
                    const { color, bg } = statusConfig[o.status] || statusConfig.pending
                    return (
                      <div key={o.id} className="bg-white rounded-2xl shadow-warm p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-semibold text-[#0D5969]">#{o.order_number}</p>
                            <p className="text-xs text-[#8B7355]">{new Date(o.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#0D5969] text-lg">{formatPrice(Number(o.total))}</p>
                            <span className={`text-xs ${color} ${bg} px-2 py-0.5 rounded-full font-medium capitalize`}>{o.status.replace(/_/g, ' ')}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {o.items.map((item) => (
                            <span key={item.id} className="text-xs bg-[#FFF8F0] text-[#8B7355] px-2.5 py-1 rounded-lg">{item.quantity}× {item.item_name}</span>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                  {orders.length === 0 && (
                    <div className="text-center py-16 text-[#8B7355]">
                      <ShoppingBag size={40} className="mx-auto mb-3 opacity-20" />
                      <p>No orders yet</p>
                      <Link to="/menu" className="text-[#0D5969] text-sm font-medium mt-2 hover:underline inline-block">Browse Menu →</Link>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* Favorites */}
          {activeTab === 'favorites' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h1 className="text-2xl font-bold text-[#0D5969]">My Favorites</h1>
              {favItems.length === 0 ? (
                <div className="text-center py-16 text-[#8B7355]">
                  <Heart size={40} className="mx-auto mb-3 opacity-20" />
                  <p>No favorites yet</p>
                  <Link to="/menu" className="text-[#0D5969] text-sm font-medium mt-2 hover:underline inline-block">Explore Menu →</Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {favItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl shadow-warm flex gap-4 p-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[#0D5969] text-sm">{item.name}</h4>
                        <p className="text-xs text-[#8B7355] line-clamp-2 mt-0.5">{item.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[#0D5969] font-bold">{formatPrice(item.price)}</span>
                          <Link to="/menu" className="text-xs text-[#0D5969] font-medium flex items-center gap-1 hover:underline">
                            Order <ChevronRight size={11} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <h1 className="text-2xl font-bold text-[#0D5969]">Profile Settings</h1>
              <div className="bg-white rounded-2xl shadow-warm p-6">
                <div className="flex items-center gap-5 mb-6">
                  <div className="relative">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={displayName} className="w-20 h-20 rounded-full object-cover" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-[#0D5969] flex items-center justify-center text-white text-3xl font-bold">
                        {displayName.charAt(0)}
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#0D5969] rounded-full flex items-center justify-center border-2 border-white cursor-pointer">
                      <Edit2 size={10} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0D5969] text-lg">{displayName}</h3>
                    <p className="text-[#8B7355] text-sm">{user.email}</p>
                    <span className="text-xs bg-[#0D5969]/10 text-[#0D5969] px-2 py-0.5 rounded-full font-medium capitalize mt-1 inline-block">{user.role}</span>
                  </div>
                  {!editing && (
                    <button onClick={() => setEditing(true)} className="ml-auto flex items-center gap-2 px-4 py-2 border border-gray-200 hover:border-[#0D5969] text-[#0D5969] text-sm rounded-xl transition-colors">
                      <Edit2 size={13} /> Edit
                    </button>
                  )}
                </div>

                {editing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0D5969] mb-1.5 flex items-center gap-2"><User size={13} className="text-[#0D5969]" /> Full Name</label>
                      <input value={profileForm.fullName} onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0D5969] focus:outline-none focus:border-[#0D5969]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0D5969] mb-1.5 flex items-center gap-2"><Phone size={13} className="text-[#0D5969]" /> Phone</label>
                      <input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0D5969] focus:outline-none focus:border-[#0D5969]" />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleSaveProfile} className="flex items-center gap-2 px-5 py-2.5 bg-[#0D5969] text-white text-sm font-semibold rounded-xl hover:bg-[#093E4A] transition-colors">
                        <Save size={14} /> Save Changes
                      </button>
                      <button onClick={() => setEditing(false)} className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-[#0D5969] text-sm rounded-xl hover:border-gray-300 transition-colors">
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[
                      { Icon: User, label: 'Full Name', value: user.fullName },
                      { Icon: Mail, label: 'Email', value: user.email },
                      { Icon: Phone, label: 'Phone', value: user.phone || '—' },
                    ].map(({ Icon, label, value }) => (
                      <div key={label} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                        <Icon size={15} className="text-[#0D5969] flex-shrink-0" />
                        <span className="text-sm text-[#8B7355] w-24">{label}</span>
                        <span className="text-sm font-medium text-[#0D5969]">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-warm p-6">
                <h3 className="font-semibold text-[#0D5969] mb-4">Danger Zone</h3>
                <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 border border-red-200 text-red-500 text-sm rounded-xl hover:bg-red-50 transition-colors">
                  <LogOut size={14} /> Sign Out of Account
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
