import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { Link } from 'react-router'

type Props = { open: boolean; onClose: () => void }

export default function CartDrawer({ open, onClose }: Props) {
  const { items, totalItems, totalPrice, increment, decrement, remove, clear } = useCart()

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#1A1A1A] z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-[#0D5969]" size={22} />
                <h2 className="text-white font-semibold text-lg">Your Order</h2>
                <span className="bg-[#0D5969] text-white text-xs font-bold px-2 py-0.5 rounded-full">{totalItems}</span>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                    <ShoppingBag size={32} className="text-white/20" />
                  </div>
                  <p className="text-white/40 text-sm">Your cart is empty</p>
                  <Link
                    to="/menu"
                    onClick={onClose}
                    className="px-6 py-2.5 bg-[#0D5969] text-white text-sm font-semibold rounded-full hover:bg-[#093E4A] transition-colors"
                  >
                    Browse Menu
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3 bg-white/5 rounded-xl p-3"
                  >
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{item.name}</p>
                      <p className="text-[#F77F00] text-sm font-semibold">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decrement(item.id)}
                        className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#0D5969] text-white flex items-center justify-center transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-white font-semibold text-sm w-6 text-center">{item.qty}</span>
                      <button
                        onClick={() => increment(item.id)}
                        className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#0D5969] text-white flex items-center justify-center transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => remove(item.id)}
                        className="w-7 h-7 rounded-full bg-white/10 hover:bg-red-600/60 text-white/40 hover:text-white flex items-center justify-center transition-colors ml-1"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 space-y-4">
                <div className="flex justify-between text-sm text-white/60">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-white/60">
                  <span>Tax (8%)</span>
                  <span className="text-white font-medium">{formatPrice(totalPrice * 0.08)}</span>
                </div>
                <div className="flex justify-between text-base text-white font-semibold pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-[#F77F00]">{formatPrice(totalPrice * 1.08)}</span>
                </div>
                <Link to="/checkout" onClick={onClose} className="w-full inline-block text-center py-3.5 bg-[#0D5969] hover:bg-[#093E4A] text-white font-semibold rounded-xl transition-colors shadow-lg">
                  Proceed to Checkout
                </Link>
                <button
                  onClick={clear}
                  className="w-full py-2.5 border border-white/10 hover:border-white/20 text-white/60 hover:text-white text-sm rounded-xl transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
