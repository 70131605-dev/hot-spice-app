import apiClient from '@/lib/api'

export type MenuItem = {
  id: string
  backendId: number
  name: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  ratingCount: number
  isAvailable: boolean
  isFeatured: boolean
  isSpecial: boolean
  calories: number
  prepTime: number
  tags: string[]
}

export type Category = {
  id: string
  name: string
  slug: string
  icon: string
  count: number
}

export type Chef = {
  id: string
  name: string
  role: string
  bio: string
  specialty: string
  experience: number
  image: string
  instagram: string
  signature: string
}

export type Testimonial = {
  id: string
  name: string
  role: string
  avatar: string
  rating: number
  comment: string
  date: string
  dish: string
}

function mapMenuItem(item: any): MenuItem {
  return {
    id: String(item.id),
    backendId: item.id,
    name: item.name,
    description: item.description || '',
    price: Number(item.price),
    image: item.image || '',
    category: item.category?.slug || '',
    rating: Number(item.rating) || 0,
    ratingCount: item.rating_count || 0,
    isAvailable: !!item.is_available,
    isFeatured: !!item.is_featured,
    isSpecial: !!item.is_special,
    calories: item.calories || 0,
    prepTime: item.prep_time || 0,
    tags: item.tags || [],
  }
}

function mapCategory(cat: any): Category {
  return {
    id: cat.slug,
    name: cat.name,
    slug: cat.slug,
    icon: cat.icon || '🍽️',
    count: cat.count || 0,
  }
}

function mapChef(chef: any): Chef {
  return {
    id: String(chef.id),
    name: chef.name,
    role: chef.role,
    bio: chef.bio,
    specialty: chef.specialty,
    experience: chef.experience,
    image: chef.image,
    instagram: chef.instagram || '',
    signature: chef.signature || '',
  }
}

function mapTestimonial(t: any): Testimonial {
  return {
    id: String(t.id),
    name: t.name,
    role: t.role,
    avatar: t.avatar,
    rating: t.rating,
    comment: t.comment,
    date: t.date,
    dish: t.dish || '',
  }
}

export async function fetchMenuItems(): Promise<MenuItem[]> {
  const res = await apiClient.get('/menu-items')
  return (res.data as any[]).map(mapMenuItem)
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await apiClient.get('/categories')
  const categories = (res.data as any[]).map(mapCategory)
  const total = categories.reduce((sum, c) => sum + c.count, 0)
  return [{ id: 'all', name: 'All Items', slug: 'all', icon: '🍽️', count: total }, ...categories]
}

export async function fetchChefs(): Promise<Chef[]> {
  const res = await apiClient.get('/chefs')
  return (res.data as any[]).map(mapChef)
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const res = await apiClient.get('/testimonials')
  return (res.data as any[]).map(mapTestimonial)
}
