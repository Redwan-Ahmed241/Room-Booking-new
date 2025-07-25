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
