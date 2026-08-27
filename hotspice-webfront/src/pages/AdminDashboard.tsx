import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Utensils, Calendar, Users, MessageSquare, LogOut,
  TrendingUp, DollarSign, ShoppingBag, Star, Edit2,
  CheckCircle, Clock, XCircle, Bell, ClipboardList, Bike,
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { useAdminAuth } from '@/context/AdminAuthContext'
import OrdersPanel from '@/components/admin/OrdersPanel'
import RidersPanel from '@/components/admin/RidersPanel'
import ProductsPanel from '@/components/admin/ProductsPanel'
import { brand } from '../lib/theme'

const revenueData = [
  { month: 'Jan', revenue: 42000, orders: 380 },
  { month: 'Feb', revenue: 38000, orders: 345 },
  { month: 'Mar', revenue: 55000, orders: 490 },
  { month: 'Apr', revenue: 61000, orders: 540 },
  { month: 'May', revenue: 58000, orders: 510 },
  { month: 'Jun', revenue: 72000, orders: 620 },
  { month: 'Jul', revenue: 68000, orders: 595 },
]

const categoryData = [
  { name: 'Steak', value: 32, color: brand.primary },
  { name: 'Pizza', value: 22, color: brand.secondary },
  { name: 'BBQ', value: 18, color: brand.success },
  { name: 'Chinese', value: 14, color: brand.accent },
  { name: 'Others', value: 14, color: brand.muted },
]

const mockReservations = [
  { id: 'RF-001290', name: 'Alice Johnson', date: '2025-08-15', time: '7:30 PM', guests: 4, status: 'confirmed' },
  { id: 'RF-001289', name: 'Bob Martinez', date: '2025-08-15', time: '8:00 PM', guests: 2, status: 'pending' },
  { id: 'RF-001288', name: 'Carol White', date: '2025-08-14', time: '6:30 PM', guests: 6, status: 'confirmed' },
  { id: 'RF-001287', name: 'Dan Brown', date: '2025-08-14', time: '7:00 PM', guests: 3, status: 'cancelled' },
  { id: 'RF-001286', name: 'Emma Davis', date: '2025-08-13', time: '8:30 PM', guests: 2, status: 'completed' },
]

const mockMessages = [
  { id: 1, name: 'Sarah K.', subject: 'Private Event Inquiry', time: '2h ago', read: false },
  { id: 2, name: 'James W.', subject: 'Feedback - Excellent Experience', time: '5h ago', read: false },
  { id: 3, name: 'Priya M.', subject: 'Wedding Rehearsal Dinner', time: '1d ago', read: true },
]

const statusConfig: Record<string, { color: string; bg: string }> = {
  confirmed: { color: 'text-success', bg: 'bg-success/10' },
  pending: { color: 'text-secondary', bg: 'bg-secondary/10' },
  completed: { color: 'text-muted', bg: 'bg-muted/10' },
  cancelled: { color: 'text-red-500', bg: 'bg-red-500/10' },
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', Icon: ClipboardList },
  { id: 'menu', label: 'Manage Menu', Icon: Utensils },
  { id: 'riders', label: 'Riders', Icon: Bike },
  { id: 'reservations', label: 'Reservations', Icon: Calendar },
  { id: 'users', label: 'Users', Icon: Users },
  { id: 'messages', label: 'Messages', Icon: MessageSquare },
]

export default function AdminDashboard() {
  const { admin, loading, logout } = useAdminAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')

  if (loading) {
    return <div className="min-h-screen bg-dark-deep" />
  }

  if (!admin) {
    return (
      <div className="min-h-screen bg-dark-deep flex items-center justify-center text-white">
        <div className="text-center p-8">
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-white/40 mb-6">Admin access required. Please sign in with an admin account.</p>
          <Link to="/admin/login" className="px-6 py-3 bg-primary text-white rounded-full font-semibold text-sm">Sign In as Admin</Link>
        </div>
      </div>
    )
  }

  const stats = [
    { label: "Today's Revenue", value: '$4,280', change: '+12%', Icon: DollarSign, color: brand.primary },
    { label: 'Total Orders', value: '2,847', change: '+8%', Icon: ShoppingBag, color: brand.secondary },
    { label: 'Active Reservations', value: '34', change: '+5', Icon: Calendar, color: brand.primary },
    { label: 'Avg. Rating', value: '4.9★', change: '+0.1', Icon: Star, color: brand.secondary },
  ]

  return (
    <div className="min-h-screen bg-dark-deep flex text-white">
      {/* Sidebar */}
      <aside className="w-60 bg-dark flex-col hidden md:flex border-r border-white/5">
        <div className="p-5 border-b border-white/10">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Hot N Spice" className="h-7 w-auto object-contain" />
          </Link>
          <div className="mt-1 text-xs text-white/30 ml-10">Admin Panel</div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === id ? 'bg-primary text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}>
              <Icon size={15} /> {label}
              {id === 'messages' && mockMessages.filter((m) => !m.read).length > 0 && (
                <span className="ml-auto w-4 h-4 bg-primary rounded-full text-white text-xs flex items-center justify-center">
                  {mockMessages.filter((m) => !m.read).length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2.5 px-3 py-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-xs font-bold">A</div>
            <div>
              <p className="text-xs font-medium text-white">{admin.name}</p>
              <p className="text-xs text-white/30 capitalize">{admin.role}</p>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/admin/login') }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-white/5 transition-colors">
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-dark-deep">
        {/* Top Bar */}
        <div className="bg-dark border-b border-white/5 px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-10">
          <div className="md:hidden flex gap-1 overflow-x-auto no-scrollbar">
            {navItems.map(({ id, label }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${activeTab === id ? 'bg-primary text-white' : 'text-white/50 hover:text-white'}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-2">
            <LayoutDashboard size={15} className="text-primary" />
            <span className="text-white/60 text-sm capitalize">{activeTab}</span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button className="relative p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors">
              <Bell size={17} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
            <Link to="/" className="text-xs text-white/40 hover:text-white transition-colors">View Site →</Link>
          </div>
        </div>

        <div className="p-6">
          {/* ── Dashboard ── */}
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(({ label, value, change, Icon, color }) => (
                  <div key={label} className="bg-dark rounded-2xl p-5 border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                        <Icon size={16} style={{ color }} />
                      </div>
                      <span className="text-success text-xs font-semibold bg-success/10 px-2 py-0.5 rounded-full">{change}</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{value}</div>
                    <div className="text-xs text-white/40 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid lg:grid-cols-3 gap-5">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-dark rounded-2xl p-5 border border-white/5">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-semibold text-white text-sm">Revenue Trend</h3>
                    <span className="text-xs text-white/30">Last 7 months</span>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={brand.primary} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={brand.primary} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                      <Tooltip contentStyle={{ background: brand.darkCard, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 }} formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Revenue']} />
                      <Area type="monotone" dataKey="revenue" stroke={brand.primary} strokeWidth={2} fill="url(#revenueGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Category Pie */}
                <div className="bg-dark rounded-2xl p-5 border border-white/5">
                  <h3 className="font-semibold text-white text-sm mb-5">Sales by Category</h3>
                  <ResponsiveContainer width="100%" height={130}>
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
                        {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: brand.darkCard, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, color: '#fff' }} formatter={(v) => [`${v}%`, '']} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-3">
                    {categoryData.map((cat) => (
                      <div key={cat.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                          <span className="text-white/60">{cat.name}</span>
                        </div>
                        <span className="font-semibold text-white">{cat.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Orders Bar Chart */}
              <div className="bg-dark rounded-2xl p-5 border border-white/5">
                <h3 className="font-semibold text-white text-sm mb-5">Monthly Orders</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: brand.darkCard, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 }} />
                    <Bar dataKey="orders" fill={brand.secondary} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Recent Reservations */}
              <div className="bg-dark rounded-2xl p-5 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white text-sm">Recent Reservations</h3>
                  <button onClick={() => setActiveTab('reservations')} className="text-xs text-primary hover:underline">View All</button>
                </div>
                <div className="space-y-2">
                  {mockReservations.slice(0, 4).map((r) => {
                    const { color, bg } = statusConfig[r.status]
                    return (
                      <div key={r.id} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                          {r.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-xs font-medium">{r.name}</p>
                          <p className="text-white/30 text-xs">{r.date} · {r.time} · {r.guests} guests</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color} ${bg}`}>{r.status}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Orders ── */}
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <OrdersPanel />
            </motion.div>
          )}

          {/* ── Products ── */}
          {activeTab === 'menu' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ProductsPanel />
            </motion.div>
          )}

          {/* ── Riders ── */}
          {activeTab === 'riders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <RidersPanel />
            </motion.div>
          )}

          {/* ── Reservations ── */}
          {activeTab === 'reservations' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <h1 className="text-xl font-bold text-white">All Reservations</h1>
              <div className="grid grid-cols-4 gap-3 mb-5">
                {[
                  { label: 'Total', value: mockReservations.length, color: brand.primary },
                  { label: 'Confirmed', value: mockReservations.filter((r) => r.status === 'confirmed').length, color: brand.success },
                  { label: 'Pending', value: mockReservations.filter((r) => r.status === 'pending').length, color: brand.secondary },
                  { label: 'Cancelled', value: mockReservations.filter((r) => r.status === 'cancelled').length, color: brand.danger },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-dark rounded-xl p-4 border border-white/5 text-center">
                    <div className="text-2xl font-bold" style={{ color }}>{value}</div>
                    <div className="text-xs text-white/40 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {mockReservations.map((r) => {
                  const { color, bg } = statusConfig[r.status]
                  return (
                    <div key={r.id} className="bg-dark rounded-2xl p-5 border border-white/5 flex items-center gap-4 flex-wrap">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                        {r.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{r.name}</p>
                        <p className="text-white/40 text-xs">{r.date} at {r.time} · {r.guests} guests</p>
                        <p className="text-white/20 text-xs">#{r.id}</p>
                      </div>
                      <span className={`${bg} ${color} text-xs px-3 py-1 rounded-full font-medium capitalize`}>{r.status}</span>
                      <div className="flex gap-2">
                        <button className="p-1.5 bg-success/10 hover:bg-success/20 text-success rounded-lg transition-colors">
                          <CheckCircle size={14} />
                        </button>
                        <button className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                          <XCircle size={14} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* ── Users ── */}
          {activeTab === 'users' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <h1 className="text-xl font-bold text-white">User Management</h1>
              <div className="bg-dark rounded-2xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        {['User', 'Email', 'Phone', 'Role', 'Joined', 'Actions'].map((h) => (
                          <th key={h} className="text-left p-4 text-xs font-semibold text-white/30 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'John Doe', email: 'john@example.com', phone: '+1 555-0101', role: 'user', joined: '2024-03-15', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop' },
                        { name: 'Emily R.', email: 'emily@example.com', phone: '+1 555-0102', role: 'user', joined: '2024-05-20', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop' },
                        { name: 'Carlos M.', email: 'carlos@example.com', phone: '+1 555-0103', role: 'user', joined: '2024-07-11', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop' },
                        { name: 'Admin User', email: 'admin@hotandspice.pk', phone: '+1 555-0100', role: 'admin', joined: '2024-01-01', avatar: '' },
                      ].map((u) => (
                        <tr key={u.email} className="border-b border-white/5 hover:bg-white/2">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {u.avatar ? (
                                <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white">{u.name.charAt(0)}</div>
                              )}
                              <span className="text-white text-sm font-medium">{u.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-white/50 text-xs">{u.email}</td>
                          <td className="p-4 text-white/50 text-xs">{u.phone}</td>
                          <td className="p-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${u.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/50'}`}>{u.role}</span>
                          </td>
                          <td className="p-4 text-white/30 text-xs">{u.joined}</td>
                          <td className="p-4">
                            <button className="p-1.5 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-lg transition-colors">
                              <Edit2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Messages ── */}
          {activeTab === 'messages' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <h1 className="text-xl font-bold text-white">Messages</h1>
              <div className="space-y-3">
                {mockMessages.map((msg) => (
                  <div key={msg.id} className={`bg-dark rounded-2xl p-5 border transition-colors ${msg.read ? 'border-white/5' : 'border-primary/30'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                          {msg.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium flex items-center gap-2">
                            {msg.name}
                            {!msg.read && <span className="w-2 h-2 bg-primary rounded-full" />}
                          </p>
                          <p className="text-white/50 text-xs">{msg.subject}</p>
                        </div>
                      </div>
                      <span className="text-white/30 text-xs flex-shrink-0">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
