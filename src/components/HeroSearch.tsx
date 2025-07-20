"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search } from "lucide-react"
import { Button } from "./ui/button"
import type { SearchFilters } from "../lib/types"

const HeroSearch: React.FC = () => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    priceRange: [100, 1000],
    amenities: [],
    roomType: "Any type",
  })

  const handleSearch = () => {
    const searchParams = new URLSearchParams()
    if (filters.location) searchParams.set("location", filters.location)
    if (filters.checkIn) searchParams.set("checkIn", filters.checkIn)
    if (filters.checkOut) searchParams.set("checkOut", filters.checkOut)
    if (filters.guests > 1) searchParams.set("guests", filters.guests.toString())
    if (filters.priceRange[0] !== 100 || filters.priceRange[1] !== 1000) {
      searchParams.set("minPrice", filters.priceRange[0].toString())
      searchParams.set("maxPrice", filters.priceRange[1].toString())
    }
    navigate(`/rooms?${searchParams.toString()}`)
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="bg-white rounded-full shadow-lg border border-gray-300 p-2 max-w-4xl mx-auto">
      <div className="flex items-center">
        {/* Where */}
        <div className="search-section flex-1">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-900 mb-1">Where</label>
            <input
              type="text"
              placeholder="Search destinations"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="search-input text-sm text-gray-600"
            />
          </div>
        </div>

        {/* Check in */}
        <div className="search-section">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-900 mb-1">Check in</label>
            <input
              type="date"
              value={filters.checkIn}
              onChange={(e) => setFilters({ ...filters, checkIn: e.target.value })}
              min={today}
              className="search-input text-sm text-gray-600"
              placeholder="Add dates"
            />
          </div>
        </div>

        {/* Check out */}
        <div className="search-section">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-900 mb-1">Check out</label>
            <input
              type="date"
              value={filters.checkOut}
              onChange={(e) => setFilters({ ...filters, checkOut: e.target.value })}
              min={filters.checkIn || today}
              className="search-input text-sm text-gray-600"
              placeholder="Add dates"
            />
          </div>
        </div>

        {/* Who */}
        <div className="search-section">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-900 mb-1">Who</label>
            <select
              value={filters.guests}
              onChange={(e) => setFilters({ ...filters, guests: Number(e.target.value) })}
              className="search-input text-sm text-gray-600 bg-transparent"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num === 1 ? "Add guests" : `${num} guests`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="pl-4">
          <Button
            onClick={handleSearch}
            className="bg-pink-500 hover:bg-pink-600 text-white rounded-full w-12 h-12 p-0 shadow-md"
            size="icon"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HeroSearch
