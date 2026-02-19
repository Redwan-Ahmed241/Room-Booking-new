// Vite environment variable typing for TypeScript
/// <reference types="vite/client" />

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://room-booking-pjo6.onrender.com/api"

// Auth response types
interface LoginResponse {
  access: string
  refresh: string
  user_id: number
  username: string
  phone?: string
  role?: string
  user?: {
    id: number
    username: string
    email: string
    role?: string
  }
}

interface RegisterResponse {
  success: boolean
  message: string
  user?: any
}

// Room type
interface Room {
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


// Token management helpers
const getAccessToken = (): string | null => localStorage.getItem("access")
const getRefreshToken = (): string | null => localStorage.getItem("refresh")

// API request wrapper with automatic token refresh
async function apiRequest(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAccessToken()

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  let response = await fetch(url, { ...options, headers })

  // If unauthorized, try to refresh token
  if (response.status === 401) {
    const refreshToken = getRefreshToken()
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        })

        if (refreshResponse.ok) {
          const data = await refreshResponse.json()
          localStorage.setItem("access", data.access)

          // Retry original request with new token
          headers['Authorization'] = `Bearer ${data.access}`
          response = await fetch(url, { ...options, headers })
        } else {
          // Refresh failed, logout
          logout()
          throw new Error("Session expired. Please login again.")
        }
      } catch (error) {
        logout()
        throw error
      }
    }
  }

  return response
}

// Room API functions
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

    const response = await fetch(`${API_BASE_URL}/rooms/?${params}`)
    if (!response.ok) {
      throw new Error("Failed to fetch rooms")
    }
    return response.json()
  },

  // Get single room by ID
  getRoom: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}/`)
    if (!response.ok) {
      throw new Error("Failed to fetch room")
    }
    return response.json()
  },

  // Create new room (admin only)
  createRoom: async (roomData: Partial<Room>) => {
    const response = await apiRequest(`${API_BASE_URL}/rooms/`, {
      method: "POST",
      body: JSON.stringify(roomData),
    })
    if (!response.ok) {
      throw new Error("Failed to create room")
    }
    return response.json()
  },

  // Update room (admin only)
  updateRoom: async (id: string, roomData: Partial<Room>) => {
    const response = await apiRequest(`${API_BASE_URL}/rooms/${id}/`, {
      method: "PUT",
      body: JSON.stringify(roomData),
    })
    if (!response.ok) {
      throw new Error("Failed to update room")
    }
    return response.json()
  },

  // Delete room (admin only)
  deleteRoom: async (id: string) => {
    const response = await apiRequest(`${API_BASE_URL}/rooms/${id}/`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error("Failed to delete room")
    }
    // Handle cases where response may have no body (204)
    const text = await response.text()
    return text ? JSON.parse(text) : { success: true }
  },
}

// Booking API functions
export const bookingsApi = {
  // Create new booking (requires authentication)
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
    const response = await apiRequest(`${API_BASE_URL}/bookings/`, {
      method: "POST",
      body: JSON.stringify(bookingData),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || "Failed to create booking")
    }
    return response.json()
  },

  // Get all bookings (admin only)
  getBookings: async () => {
    const response = await apiRequest(`${API_BASE_URL}/bookings/`)
    if (!response.ok) {
      throw new Error("Failed to fetch bookings")
    }
    return response.json()
  },

  // Update booking status (admin only)
  updateBookingStatus: async (id: string, status: string) => {
    const response = await apiRequest(`${API_BASE_URL}/bookings/${id}/status/`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
    if (!response.ok) {
      throw new Error("Failed to update booking status")
    }
    return response.json()
  },

  // Get user booking history
  getUserBookings: async (): Promise<any> => {
    const response = await apiRequest(`${API_BASE_URL}/bookings/user-bookings/`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || "Failed to fetch user bookings")
    }
    return response.json()
  },
}

// Auth API functions - JWT only
export async function login(username: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || errorData.error || "Invalid credentials")
  }

  const data = await response.json()
  const { access, refresh } = data

  if (access && refresh) {
    localStorage.setItem("access", access)
    localStorage.setItem("refresh", refresh)

    // Store user info from the custom JWT response (flat fields)
    const userInfo = {
      id: data.user_id,
      username: data.username,
      phone: data.phone,
      role: data.role,
    }
    localStorage.setItem("user", JSON.stringify(userInfo))
  }

  return data
}

// Registration API function
export async function register(data: {
  username?: string;
  email?: string;
  mobile_no: string;
  password: string;
  confirm_password: string;
}): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.detail || 'Registration failed');
  }

  return response.json();
}

export async function logout(): Promise<void> {
  const refresh = getRefreshToken()
  if (refresh) {
    try {
      await apiRequest(`${API_BASE_URL}/auth/logout/`, {
        method: 'POST',
        body: JSON.stringify({ refresh }),
      })
    } catch (error) {
      console.warn('Logout API call failed:', error)
    }
  }

  // Always clear local storage
  localStorage.removeItem("access")
  localStorage.removeItem("refresh")
  localStorage.removeItem("user")
  localStorage.removeItem("token") // Remove old token if it exists
}

// User Profile API functions - Updated to use JWT
export const userProfileApi = {
  // Get user profile by username
  getUserProfile: async (username: string): Promise<any> => {
    const response = await apiRequest(`${API_BASE_URL}/auth/user-info/${username}/`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || "Failed to fetch user profile")
    }
    return response.json()
  },

  // Get current user profile
  getCurrentUserProfile: async (): Promise<any> => {
    const user = getCurrentUser()
    if (!user) throw new Error("No user logged in")

    return userProfileApi.getUserProfile(user.username)
  },

  // Update user profile
  updateUserProfile: async (profileData: {
    first_name?: string;
    last_name?: string;
    email?: string;
    mobile_no?: string;
    profile_image?: string;
    bio?: string;
  }): Promise<any> => {
    const response = await apiRequest(`${API_BASE_URL}/auth/profile/`, {
      method: "PUT",
      body: JSON.stringify(profileData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || "Failed to update user profile")
    }
    return response.json()
  },

  // Change password
  changePassword: async (passwordData: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }): Promise<any> => {
    const response = await apiRequest(`${API_BASE_URL}/auth/change-password/`, {
      method: "POST",
      body: JSON.stringify(passwordData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || "Failed to change password")
    }
    return response.json()
  },

  // Upload profile image
  uploadProfileImage: async (imageFile: File): Promise<any> => {
    const formData = new FormData()
    formData.append("profile_image", imageFile)

    const response = await apiRequest(`${API_BASE_URL}/auth/upload-profile-image/`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || "Failed to upload profile image")
    }
    return response.json()
  },
}

// Backward compatibility
export async function getUserProfile(username: string): Promise<any> {
  return userProfileApi.getUserProfile(username)
}

// Upload API functions
export const uploadApi = {
  // Upload room images
  uploadImages: async (files: FileList) => {
    const formData = new FormData()
    Array.from(files).forEach((file) => {
      formData.append("images", file)
    })

    const response = await apiRequest(`${API_BASE_URL}/upload/images`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload images")
    }

    return response.json()
  },
}

// Token refresh function
export async function refreshToken(): Promise<{ access: string }> {
  const refresh = getRefreshToken()
  if (!refresh) {
    throw new Error("No refresh token available")
  }

  const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  })

  if (!response.ok) {
    throw new Error("Failed to refresh token")
  }

  const data = await response.json()
  localStorage.setItem("access", data.access)

  return data
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!(getAccessToken() && getRefreshToken())
}

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user")
  return userStr ? JSON.parse(userStr) : null
}
