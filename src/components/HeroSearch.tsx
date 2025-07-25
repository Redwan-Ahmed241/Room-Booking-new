"use client"

import type React from "react"
import { useState } from "react"
import { Search, MapPin, Calendar, Users } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import type { SearchFilters } from "../lib/types"

interface HeroSearchProps {
  onSearch: (filters: SearchFilters) => void
}

const HeroSearch: React.FC<HeroSearchProps> = ({ onSearch }) => {
  const [searchData, setSearchData] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch({
      ...searchData,
      priceRange: [0, 1000],
      roomType: "",
      amenities: [],
    })
  }

  return (
    <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center">
        {/* Location */}
        <div className="flex-1 px-6 py-4 border-r border-gray-200">
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-900 mb-1">Where</label>
              <Input
                type="text"
                placeholder="Search destinations"
                value={searchData.location}
                onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                className="border-0 p-0 text-sm placeholder-gray-500 focus:ring-0"
              />
            </div>
          </div>
        </div>

        {/* Check-in */}
        <div className="flex-1 px-6 py-4 border-r border-gray-200">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-900 mb-1">Check in</label>
              <Input
                type="date"
                value={searchData.checkIn}
                onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
                className="border-0 p-0 text-sm focus:ring-0"
              />
            </div>
          </div>
        </div>

        {/* Check-out */}
        <div className="flex-1 px-6 py-4 border-r border-gray-200">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-900 mb-1">Check out</label>
              <Input
                type="date"
                value={searchData.checkOut}
                onChange={(e) => setSearchData({ ...searchData, checkOut: e.target.value })}
                className="border-0 p-0 text-sm focus:ring-0"
              />
            </div>
          </div>
        </div>

        {/* Guests */}
        <div className="flex-1 px-6 py-4">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-900 mb-1">Who</label>
              <select
                value={searchData.guests}
                onChange={(e) => setSearchData({ ...searchData, guests: Number(e.target.value) })}
                className="border-0 p-0 text-sm bg-transparent focus:ring-0 w-full"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} guest{num > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="px-2">
          <Button type="submit" size="icon" className="bg-pink-500 hover:bg-pink-600 text-white rounded-full h-12 w-12">
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  )
}

export default HeroSearch
