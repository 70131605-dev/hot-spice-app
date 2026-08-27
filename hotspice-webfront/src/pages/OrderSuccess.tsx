import { useLocation, Link } from 'react-router'

export default function OrderSuccess(){
  const loc = useLocation()
  const order = (loc.state as any)?.order

  return (
    <div className="pt-28 pb-16 px-6 max-w-3xl mx-auto text-center">
      <h1 className="text-2xl font-bold">Order Confirmed</h1>
      {order ? (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <p className="text-lg">Order Number: <strong>{order.order_number}</strong></p>
          <p className="mt-2">Subtotal: Rs. {order.subtotal}</p>
          <p>Delivery: Rs. {order.delivery_fee}</p>
          <p className="font-semibold mt-2">Total: Rs. {order.total}</p>
        </div>
      ) : (
        <p className="mt-6 text-gray-600">We received your order — details available in your dashboard.</p>
      )}

      <div className="mt-6">
        <Link to="/" className="text-primary">Back to Home</Link>
      </div>
    </div>
  )
}
