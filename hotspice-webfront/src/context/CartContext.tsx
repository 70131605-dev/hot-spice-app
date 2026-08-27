import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { MenuItem } from '@/lib/catalogApi'

export type CartItem = MenuItem & { qty: number }

type CartState = {
  items: CartItem[]
  favorites: string[]
}

type CartAction =
  | { type: 'ADD'; item: MenuItem }
  | { type: 'REMOVE'; id: string }
  | { type: 'INCREMENT'; id: string }
  | { type: 'DECREMENT'; id: string }
  | { type: 'CLEAR' }
  | { type: 'TOGGLE_FAVORITE'; id: string }

type CartContextType = {
  items: CartItem[]
  favorites: string[]
  totalItems: number
  totalPrice: number
  add: (item: MenuItem) => void
  remove: (id: string) => void
  increment: (id: string) => void
  decrement: (id: string) => void
  clear: () => void
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
}

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((i) => i.id === action.item.id)
      if (existing) {
        return { ...state, items: state.items.map((i) => i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i) }
      }
      return { ...state, items: [...state.items, { ...action.item, qty: 1 }] }
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) }
    case 'INCREMENT':
      return { ...state, items: state.items.map((i) => i.id === action.id ? { ...i, qty: i.qty + 1 } : i) }
    case 'DECREMENT':
      return {
        ...state,
        items: state.items
          .map((i) => i.id === action.id ? { ...i, qty: i.qty - 1 } : i)
          .filter((i) => i.qty > 0),
      }
    case 'CLEAR':
      return { ...state, items: [] }
    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.includes(action.id)
          ? state.favorites.filter((id) => id !== action.id)
          : [...state.favorites, action.id],
      }
    default:
      return state
  }
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], favorites: [] })

  const totalItems = state.items.reduce((sum, i) => sum + i.qty, 0)
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        favorites: state.favorites,
        totalItems,
        totalPrice,
        add: (item) => dispatch({ type: 'ADD', item }),
        remove: (id) => dispatch({ type: 'REMOVE', id }),
        increment: (id) => dispatch({ type: 'INCREMENT', id }),
        decrement: (id) => dispatch({ type: 'DECREMENT', id }),
        clear: () => dispatch({ type: 'CLEAR' }),
        toggleFavorite: (id) => dispatch({ type: 'TOGGLE_FAVORITE', id }),
        isFavorite: (id) => state.favorites.includes(id),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
