"use client"

import type React from "react"
import { useState } from "react"
import HeroSearch from "../components/HeroSearch"
import RoomCard from "../components/RoomCard"
import FilterChips from "../components/FilterChips"
import { mockRooms } from "../lib/mockData"
import type { Room, SearchFilters } from "../lib/types"

const HomePage: React.FC = () => {
  const [filteredRooms, setFilteredRooms] = useState<Room[]>(mockRooms)
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    priceRange: [0, 1000],
    roomType: "",
    amenities: [],
  })

  const handleSearch = (searchFilters: SearchFilters) => {
    setFilters(searchFilters)

    const filtered = mockRooms.filter((room) => {
      const matchesLocation =
        !searchFilters.location || room.location.toLowerCase().includes(searchFilters.location.toLowerCase())

      const matchesGuests = room.maxGuests >= searchFilters.guests

      const matchesPrice = room.price >= searchFilters.priceRange[0] && room.price <= searchFilters.priceRange[1]

      const matchesType = !searchFilters.roomType || room.type === searchFilters.roomType

      const matchesAmenities =
        searchFilters.amenities.length === 0 ||
        searchFilters.amenities.every((amenity) => room.amenities.includes(amenity))

      return matchesLocation && matchesGuests && matchesPrice && matchesType && matchesAmenities
    })

    setFilteredRooms(filtered)
  }

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    handleSearch(updatedFilters)
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
          <h2 className="text-2xl font-semibold text-gray-900">{filteredRooms.length} stays found</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>

        {filteredRooms.length === 0 && (
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
