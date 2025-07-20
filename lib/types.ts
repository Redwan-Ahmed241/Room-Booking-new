export interface Villa {
  id: string
  name: string
  description: string
  location: string
  address?: string
  amenities: string[]
  images: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Room {
  id: string
  villa_id: string
  name: string
  description: string
  price_per_night: number
  max_guests: number
  room_type?: string
  size_sqm?: number
  amenities: string[]
  images: string[]
  is_available: boolean
  rating: number
  created_at: string
  updated_at: string
  villa?: Villa
}

export interface Booking {
  id: string
  room_id: string
  villa_id: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  check_in: string
  check_out: string
  guests: number
  total_price: number
  status: "pending" | "confirmed" | "cancelled"
  special_requests?: string
  created_at: string
  room?: Room
  villa?: Villa
}

export interface SearchFilters {
  check_in?: string
  check_out?: string
  guests?: number
  villa_name?: string
  min_price?: number
  max_price?: number
  amenities?: string[]
  room_type?: string
}

export interface AdminUser {
  id: string
  email: string
  name: string
  role: string
  is_active: boolean
  created_at: string
}
