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
    minPrice: filters.priceRange[0],
    maxPrice: filters.priceRange[1],
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
    </div>
  )
}

export default HomePage
