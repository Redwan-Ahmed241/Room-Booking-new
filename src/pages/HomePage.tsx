"use client"

import type React from "react"
import { useState } from "react"
import HeroSearch from "../components/HeroSearch"
import RoomCard from "../components/RoomCard"
import FilterChips from "../components/FilterChips"
import { useRooms } from "../hooks/useRooms"
import type { SearchFilters } from "../lib/types"

const HomePage: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    priceRange: [0, 1000],
    roomType: "",
    amenities: [],
  })

  const { rooms, loading, error } = useRooms({
    location: filters.location,
    checkIn: filters.checkIn,
    checkOut: filters.checkOut,
    guests: filters.guests,
    priceRange: filters.priceRange,
    roomType: filters.roomType,
    amenities: filters.amenities,
  })

  const handleSearch = (searchFilters: SearchFilters) => {
    setFilters(searchFilters)
  }

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading rooms...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">Find your perfect stay</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Discover amazing places to stay around the world</p>
          </div>

          <HeroSearch onSearch={handleSearch} />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <FilterChips filters={filters} onFilterChange={handleFilterChange} />
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">{rooms.length} stays found</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>

        {rooms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No rooms found matching your criteria.</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>

      {/* Featured Accommodations Section (from app/page.tsx) */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Featured Accommodations</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Discover our most popular rooms with exceptional ratings and stunning amenities
          </p>
        </div>
        {/* You can use rooms.filter(...) or a separate featuredRooms state if you want to show only featured */}
        {rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.slice(0, 6).map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">No rooms available at the moment.</p>
            <p className="text-sm text-slate-500">Please check back later or contact us for availability.</p>
          </div>
        )}
      </section>

      {/* Stats Section (from app/page.tsx) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Example stat cards, you can adjust values as needed */}
            <div className="text-center border-0 shadow-sm p-6 rounded-lg bg-white">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {/* MapPin icon placeholder */}
                <span role="img" aria-label="MapPin">📍</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">1+</h3>
              <p className="text-slate-600">Premium Villas</p>
            </div>
            <div className="text-center border-0 shadow-sm p-6 rounded-lg bg-white">
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {/* Users icon placeholder */}
                <span role="img" aria-label="Users">👥</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">9+</h3>
              <p className="text-slate-600">Luxury Rooms</p>
            </div>
            <div className="text-center border-0 shadow-sm p-6 rounded-lg bg-white">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {/* Star icon placeholder */}
                <span role="img" aria-label="Star">⭐</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">4.8</h3>
              <p className="text-slate-600">Average Rating</p>
            </div>
            <div className="text-center border-0 shadow-sm p-6 rounded-lg bg-white">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {/* Award icon placeholder */}
                <span role="img" aria-label="Award">🏆</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">100%</h3>
              <p className="text-slate-600">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section (from app/page.tsx) */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose VillaEase?</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Experience luxury, comfort, and exceptional service in every stay
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span role="img" aria-label="Star">⭐</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Premium Quality</h3>
            <p className="text-slate-600">
              Every room is carefully selected and maintained to ensure the highest standards of luxury and comfort.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span role="img" aria-label="Users">👥</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">24/7 Support</h3>
            <p className="text-slate-600">
              Our dedicated team is available around the clock to ensure your stay is perfect from start to finish.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span role="img" aria-label="MapPin">📍</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Prime Locations</h3>
            <p className="text-slate-600">
              All our villas are located in the most desirable destinations with easy access to attractions and amenities.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
