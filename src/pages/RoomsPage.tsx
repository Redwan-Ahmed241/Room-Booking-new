"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import RoomCard from "../components/RoomCard"
import FilterChips from "../components/FilterChips"
import { mockRooms } from "../lib/mockData"
import type { Room, SearchFilters } from "../lib/types"

const RoomsPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [filteredRooms, setFilteredRooms] = useState<Room[]>(mockRooms)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const filters: SearchFilters = {
    location: searchParams.get("location") || "",
    checkIn: searchParams.get("checkIn") || "",
    checkOut: searchParams.get("checkOut") || "",
    guests: Number(searchParams.get("guests")) || 1,
    priceRange: [Number(searchParams.get("minPrice")) || 100, Number(searchParams.get("maxPrice")) || 1000],
    amenities: selectedFilters,
    roomType: searchParams.get("roomType") || "Any type",
  }

  useEffect(() => {
    let filtered = mockRooms

    // Filter by location
    if (filters.location) {
      filtered = filtered.filter(
        (room) =>
          room.location.toLowerCase().includes(filters.location.toLowerCase()) ||
          room.name.toLowerCase().includes(filters.location.toLowerCase()),
      )
    }

    // Filter by guests
    if (filters.guests > 1) {
      filtered = filtered.filter((room) => room.maxGuests >= filters.guests)
    }

    // Filter by price range
    filtered = filtered.filter((room) => room.price >= filters.priceRange[0] && room.price <= filters.priceRange[1])

    // Filter by room type
    if (filters.roomType !== "Any type") {
      filtered = filtered.filter((room) => room.type === filters.roomType.toLowerCase())
    }

    // Filter by amenities
    if (selectedFilters.length > 0) {
      filtered = filtered.filter((room) =>
        selectedFilters.every((filter) =>
          room.amenities.some((amenity) => amenity.toLowerCase().includes(filter.toLowerCase())),
        ),
      )
    }

    setFilteredRooms(filtered)
  }, [filters.location, filters.guests, filters.priceRange, filters.roomType, selectedFilters])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          {filteredRooms.length} stays {filters.location && `in ${filters.location}`}
        </h1>
        <p className="text-gray-600">
          {filters.checkIn && filters.checkOut && (
            <>
              {new Date(filters.checkIn).toLocaleDateString()} - {new Date(filters.checkOut).toLocaleDateString()} •
            </>
          )}
          {filters.guests > 1 && ` ${filters.guests} guests`}
        </p>
      </div>

      <FilterChips selectedFilters={selectedFilters} onFilterChange={setSelectedFilters} />

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
  )
}

export default RoomsPage
