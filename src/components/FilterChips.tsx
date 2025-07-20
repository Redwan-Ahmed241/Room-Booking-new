"use client"

import type React from "react"
import { Badge } from "./ui/badge"

interface FilterChipsProps {
  selectedFilters: string[]
  onFilterChange: (filters: string[]) => void
}

const filterOptions = [
  "WiFi",
  "Pool",
  "Beach Access",
  "Air Conditioning",
  "Kitchen",
  "Parking",
  "Pet Friendly",
  "Gym",
  "Spa",
  "Restaurant",
]

const FilterChips: React.FC<FilterChipsProps> = ({ selectedFilters, onFilterChange }) => {
  const toggleFilter = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      onFilterChange(selectedFilters.filter((f) => f !== filter))
    } else {
      onFilterChange([...selectedFilters, filter])
    }
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filterOptions.map((filter) => (
        <Badge
          key={filter}
          variant={selectedFilters.includes(filter) ? "default" : "outline"}
          className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-full transition-colors ${
            selectedFilters.includes(filter)
              ? "bg-gray-900 text-white hover:bg-gray-800"
              : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
          }`}
          onClick={() => toggleFilter(filter)}
        >
          {filter}
        </Badge>
      ))}
    </div>
  )
}

export default FilterChips
