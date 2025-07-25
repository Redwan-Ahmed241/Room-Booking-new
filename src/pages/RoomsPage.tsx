"use client"

import type React from "react"
import { useState } from "react"
import RoomCard from "../components/RoomCard"
import FilterChips from "../components/FilterChips"
import PriceRangeSlider from "../components/PriceRangeSlider"
import { mockRooms } from "../lib/mockData"
import type { Room, SearchFilters } from "../lib/types"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Filter } from "lucide-react"

const RoomsPage: React.FC = () => {
  const [filteredRooms, setFilteredRooms] = useState<Room[]>(mockRooms)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    priceRange: [0, 1000],
    roomType: "",
    amenities: [],
  })

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)

    const filtered = mockRooms.filter((room) => {
      const matchesLocation =
        !updatedFilters.location || room.location.toLowerCase().includes(updatedFilters.location.toLowerCase())

      const matchesGuests = room.maxGuests >= updatedFilters.guests

      const matchesPrice = room.price >= updatedFilters.priceRange[0] && room.price <= updatedFilters.priceRange[1]

      const matchesType = !updatedFilters.roomType || room.type === updatedFilters.roomType

      const matchesAmenities =
        updatedFilters.amenities.length === 0 ||
        updatedFilters.amenities.every((amenity) => room.amenities.includes(amenity))

      return matchesLocation && matchesGuests && matchesPrice && matchesType && matchesAmenities
    })

    setFilteredRooms(filtered)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Rooms</h1>
            <p className="text-gray-600 mt-1">{filteredRooms.length} rooms available</p>
          </div>

          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Filters</h3>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <PriceRangeSlider
                    value={filters.priceRange}
                    onChange={(range) => handleFilterChange({ priceRange: range })}
                    min={0}
                    max={1000}
                  />
                </div>

                {/* Filter Chips */}
                <FilterChips filters={filters} onFilterChange={handleFilterChange} />
              </CardContent>
            </Card>
          </div>

          {/* Rooms Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>

            {filteredRooms.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No rooms found matching your criteria.</p>
                <p className="text-gray-400 mt-2">Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomsPage
