export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatPrice(price: number): string {
  return `Rs ${new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 }).format(Math.round(price))}`
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(date))
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
}

export function truncate(text: string, length: number): string {
  return text.length > length ? text.slice(0, length) + '...' : text
}

export function unsplashUrl(id: string, w = 800, h = 600): string {
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`
}

export function generateStars(rating: number): string {
  return Array.from({ length: 5 }, (_, i) => (i < Math.floor(rating) ? '★' : '☆')).join('')
}

export const timeSlots = [
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM',
  '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM',
  '9:00 PM', '9:30 PM', '10:00 PM',
]

export const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
