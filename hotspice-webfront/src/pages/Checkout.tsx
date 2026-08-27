import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import apiClient from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'

const DELIVERY_FEE = 150

export default function Checkout() {
  const { items, totalPrice, clear } = useCart()
  const { token, user, loading: authLoading } = useAuth()
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery')
  const [notes, setNotes] = useState('')
  const [showCoupon, setShowCoupon] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [couponError, setCouponError] = useState('')
  const [addresses, setAddresses] = useState<Array<any>>([])
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [useNewAddress, setUseNewAddress] = useState(false)
  const [newAddressText, setNewAddressText] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (authLoading || !token) return

    // try to fetch saved addresses from backend (optional)
    apiClient.get('/addresses')
      .then((response) => {
        const list = Array.isArray(response.data) ? response.data : []
        setAddresses(list)
        const def = list.find((a: any) => a.is_default) || list[0]
        if (def) setSelectedAddressId(def.id)
      })
      .catch(() => {})
  }, [authLoading, token])

  const deliveryFee = orderType === 'delivery' ? DELIVERY_FEE : 0
  const total = totalPrice + deliveryFee

  const handlePlaceOrder = async () => {
    if (authLoading) {
      alert('Restoring your session, please try again in a moment.')
      return
    }
    if (!token) {
      // redirect to login so the user can authenticate and obtain a token
      navigate('/login', { state: { from: '/checkout', message: 'Please sign in to place your order.' } })
      return
    }
    if (orderType === 'delivery') {
      if (useNewAddress && !newAddressText.trim()) {
        alert('Please enter a delivery address.')
        return
      }
      if (!useNewAddress && !selectedAddressId) {
        alert('Please select or add a delivery address.')
        return
      }
    }

    const orderItems = items.map((i: any) => ({
      menu_item_id: (i.backendId ?? Number(String(i.id).replace(/\D/g, ''))) || null,
      quantity: i.qty,
    }))

    if (orderItems.some((item) => !item.menu_item_id || item.menu_item_id <= 0)) {
      alert('One or more cart items are invalid for checkout. Please refresh the page and try again.')
      setLoading(false)
      return
    }

    const payload: any = {
      order_type: orderType,
      delivery_address: orderType === 'delivery' ? (useNewAddress ? newAddressText.trim() : addresses.find((a:any)=>a.id===selectedAddressId)?.address_line) : undefined,
      notes: notes || undefined,
      items: orderItems,
    }
    if (couponCode.trim()) payload.coupon_code = couponCode.trim()

    setCouponError('')
    setLoading(true)
    try {
      const response = await apiClient.post('/orders', payload)
      const order = response.data
      clear()
      navigate('/order-success', { state: { order } })
    } catch (e: any) {
      const err = e?.response?.data || {}
      const couponMessage = err?.errors?.coupon_code?.[0]
      if (couponMessage) {
        setShowCoupon(true)
        setCouponError(couponMessage)
        setLoading(false)
        return
      }
      alert(err?.message || e.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="pt-28 pb-16 px-6">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="mt-4 text-gray-600">Your cart is empty.</p>
      </div>
    )
  }

  return (
    <div className="pt-28 pb-16 px-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <div className="mt-6">
        <h2 className="font-semibold">Order Type</h2>
        <div className="flex gap-3 mt-3">
          <button onClick={() => setOrderType('delivery')} className={`px-4 py-2 rounded ${orderType==='delivery'? 'bg-primary text-white': 'bg-white border'}`}>Delivery</button>
          <button onClick={() => setOrderType('pickup')} className={`px-4 py-2 rounded ${orderType==='pickup'? 'bg-primary text-white': 'bg-white border'}`}>Pickup</button>
        </div>
      </div>

      {orderType === 'delivery' && (
        <div className="mt-6">
          <h2 className="font-semibold">Delivery Address</h2>
          <div className="mt-3 space-y-2">
            {addresses.map((a:any) => (
              <label key={a.id} className={`block p-3 rounded border ${!useNewAddress && selectedAddressId===a.id ? 'border-primary bg-primary/10' : 'border-gray-200'}`}>
                <input type="radio" name="addr" checked={!useNewAddress && selectedAddressId===a.id} onChange={() => { setUseNewAddress(false); setSelectedAddressId(a.id)}} />
                <span className="ml-2 font-medium">{a.label}</span>
                <div className="text-xs text-gray-500">{a.address_line}</div>
              </label>
            ))}
            <label className={`block p-3 rounded border ${useNewAddress ? 'border-primary bg-primary/10' : 'border-gray-200'}`}>
              <input type="radio" name="addr" checked={useNewAddress} onChange={() => setUseNewAddress(true)} />
              <span className="ml-2 font-medium">Use a different address</span>
              {useNewAddress && (
                <textarea className="mt-2 w-full border rounded p-2" value={newAddressText} onChange={(e)=>setNewAddressText(e.target.value)} rows={3} />
              )}
            </label>
          </div>
        </div>
      )}

      <div className="mt-6">
        <h2 className="font-semibold">Order Notes (Optional)</h2>
        <textarea className="mt-2 w-full border rounded p-2" value={notes} onChange={(e)=>setNotes(e.target.value)} rows={3} />
      </div>

      <div className="mt-6">
        {showCoupon ? (
          <div>
            <h2 className="font-semibold">Coupon Code</h2>
            <input className="mt-2 w-full border rounded p-2" value={couponCode} onChange={(e)=>{ setCouponCode(e.target.value); setCouponError('')}} />
            {couponError && <div className="text-sm text-red-600 mt-2">{couponError}</div>}
          </div>
        ) : (
          <button className="mt-2 text-sm text-primary" onClick={()=>setShowCoupon(true)}>Have a coupon?</button>
        )}
      </div>

      <div className="mt-6 bg-white shadow rounded p-4">
        <h3 className="font-semibold mb-3">Order Summary</h3>
        <div className="space-y-2">
          {items.map((i:any) => (
            <div key={i.id} className="flex justify-between">
              <div className="text-sm text-gray-700">{i.qty}x {i.name}</div>
              <div className="text-sm font-medium">Rs. {Math.round(i.price * i.qty)}</div>
            </div>
          ))}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between text-sm"><div>Subtotal</div><div>Rs. {Math.round(totalPrice)}</div></div>
            <div className="flex justify-between text-sm"><div>Delivery Fee</div><div>Rs. {deliveryFee}</div></div>
            <div className="flex justify-between font-bold mt-2"><div>Total</div><div>Rs. {Math.round(total)}</div></div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button onClick={handlePlaceOrder} disabled={loading} className="bg-primary text-white px-6 py-3 rounded">
          {loading ? 'Placing...' : `Place Order — Rs. ${Math.round(total)}`}
        </button>
      </div>
    </div>
  )
}
