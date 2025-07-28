// Vite environment variable typing for TypeScript
/// <reference types="vite/client" />

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api"

// API response types
interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

// Room API functions
type Room = {}

export const roomsApi = {
  // Get all rooms with filters
  getRooms: async (filters?: {
    location?: string
    checkIn?: string
    checkOut?: string
    guests?: number
    minPrice?: number
    maxPrice?: number
    roomType?: string
    amenities?: string[]
  }) => {
    const params = new URLSearchParams()

    if (filters?.location) params.append("location", filters.location)
    if (filters?.checkIn) params.append("check_in", filters.checkIn)
    if (filters?.checkOut) params.append("check_out", filters.checkOut)
    if (filters?.guests) params.append("guests", filters.guests.toString())
    if (filters?.minPrice) params.append("min_price", filters.minPrice.toString())
    if (filters?.maxPrice) params.append("max_price", filters.maxPrice.toString())
    if (filters?.roomType) params.append("room_type", filters.roomType)
    if (filters?.amenities) {
      filters.amenities.forEach((amenity) => params.append("amenities", amenity))
    }

    const response = await fetch(`${API_BASE_URL}/rooms?${params}`)
    if (!response.ok) {
      throw new Error("Failed to fetch rooms")
    }
    return response.json()
  },

  // Get single room by ID
  getRoom: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`)
    if (!response.ok) {
      throw new Error("Failed to fetch room")
    }
    return response.json()
  },

  // Create new room (admin only)
  createRoom: async (roomData: Partial<Room>) => {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
      body: JSON.stringify(roomData),
    })
    if (!response.ok) {
      throw new Error("Failed to create room")
    }
    return response.json()
  },

  // Update room (admin only)
  updateRoom: async (id: string, roomData: Partial<Room>) => {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
      body: JSON.stringify(roomData),
    })
    if (!response.ok) {
      throw new Error("Failed to update room")
    }
    return response.json()
  },

  // Delete room (admin only)
  deleteRoom: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    })
    if (!response.ok) {
      throw new Error("Failed to delete room")
    }
    return response.json()
  },
}

// Booking API functions
export const bookingsApi = {
  // Create new booking
  createBooking: async (bookingData: {
    roomId: string
    checkIn: string
    checkOut: string
    guests: number
    guestInfo: {
      name: string
      email: string
      phone: string
    }
  }) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    })
    if (!response.ok) {
      throw new Error("Failed to create booking")
    }
    return response.json()
  },

  // Get all bookings (admin only)
  getBookings: async () => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    })
    if (!response.ok) {
      throw new Error("Failed to fetch bookings")
    }
    return response.json()
  },

  // Update booking status (admin only)
  updateBookingStatus: async (id: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
      body: JSON.stringify({ status }),
    })
    if (!response.ok) {
      throw new Error("Failed to update booking status")
    }
    return response.json()
  },
}

// Auth API functions
export const authApi = {
  // Admin login
  login: async (credentials: { username: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
    if (!response.ok) {
      throw new Error("Invalid credentials")
    }
    const data = await response.json()
    if (data.token) {
      localStorage.setItem("adminToken", data.token)
    }
    return data
  },

  // Verify token
  verifyToken: async () => {
    const token = localStorage.getItem("adminToken")
    if (!token) return false

    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.ok
  },

  // Logout
  logout: () => {
    localStorage.removeItem("adminToken")
  },
}

// Upload API functions
export const uploadApi = {
  // Upload room images
  uploadImages: async (files: FileList) => {
    const formData = new FormData()
    Array.from(files).forEach((file) => {
      formData.append("images", file)
    })

    const response = await fetch(`${API_BASE_URL}/upload/images`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
      body: formData,
    })
    if (!response.ok) {
      throw new Error("Failed to upload images")
    }
    return response.json()
  },
}
