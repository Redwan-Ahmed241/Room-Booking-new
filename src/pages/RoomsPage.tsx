"use client"

import type React from "react"
import { useState } from "react"
import { useRooms } from "../hooks/useRooms"
import RoomCard from "../components/RoomCard"
import FilterChips from "../components/FilterChips"
import type { SearchFilters } from "../lib/types"

const RoomsPage: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    priceRange: [0, 1000],
    minPrice: 0,
    maxPrice: 1000,
    roomType: "",
    amenities: [],
  })

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { rooms, loading, error } = useRooms({
    location: filters.location,
    checkIn: filters.checkIn,
    checkOut: filters.checkOut,
    guests: filters.guests,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    roomType: filters.roomType,
    amenities: filters.amenities,
  })

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
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Rooms</h1>
          <p className="text-gray-600">Discover our collection of beautiful accommodations</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <FilterChips filters={filters} onFilterChange={handleFilterChange} />
          <div className="flex items-center gap-2 mt-4">

            <div className="flex border border-slate-300 rounded-lg">
              <button
                className={`rounded-r-none border-0 px-3 py-1 ${viewMode === 'grid' ? 'bg-gray-200' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </button>
              <button
                className={`rounded-l-none border-0 px-3 py-1 ${viewMode === 'list' ? 'bg-gray-200' : ''}`}
                onClick={() => setViewMode('list')}
              >
                List
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">{rooms.length} rooms available</h2>
        </div>
        {loading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-6'}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse border-0 shadow-sm bg-gray-100 rounded-lg h-64" />
            ))}
          </div>
        ) : rooms.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-6'}>
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No rooms found matching your criteria.</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RoomsPage
