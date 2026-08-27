import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          created_at: string
        }
      }
      menu_categories: {
        Row: {
          id: string
          name: string
          slug: string
          icon: string
          image_url: string | null
          order: number
        }
      }
      menu_items: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          image_url: string
          category_id: string
          rating: number
          is_available: boolean
          is_featured: boolean
          is_special: boolean
          calories: number | null
          prep_time: number | null
          tags: string[]
          created_at: string
        }
      }
      reservations: {
        Row: {
          id: string
          user_id: string | null
          name: string
          email: string
          phone: string
          date: string
          time: string
          guests: number
          notes: string | null
          status: 'pending' | 'confirmed' | 'cancelled'
          created_at: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          items: { item_id: string; name: string; price: number; qty: number }[]
          total: number
          status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
          created_at: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string | null
          name: string
          avatar_url: string | null
          rating: number
          comment: string
          is_approved: boolean
          created_at: string
        }
      }
      gallery: {
        Row: {
          id: string
          image_url: string
          caption: string | null
          category: string
          order: number
        }
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          created_at: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          subject: string
          message: string
          is_read: boolean
          created_at: string
        }
      }
    }
  }
}
