export interface Room {
  id: string
  name: string
  type: string
  price: number
  rating: number
  reviews: number
  images: string[]
  amenities: string[]
  description: string
  location: string
  maxGuests: number
  bedrooms: number
  bathrooms: number
  size: number
  available: boolean
  createdAt?: string
  updatedAt?: string
}

export interface SearchFilters {
  location: string
  checkIn: string
  checkOut: string
  guests: number
  priceRange: [number, number]
  roomType: string
  amenities: string[]
}

export interface BookingData {
  roomId: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  guestInfo: {
    name: string
    email: string
    phone: string
  }
}

export interface Booking {
  id: string
  roomId: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  guestInfo: {
    name: string
    email: string
    phone: string
  }
  createdAt: string
  updatedAt: string
  room?: Room
}

export interface AdminStats {
  totalRooms: number
  totalBookings: number
  totalRevenue: number
  occupancyRate: number
}

export interface ApiError {
  message: string
  status: number
}
