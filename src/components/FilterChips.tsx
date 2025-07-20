"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Wifi, Car, Coffee, Waves, Snowflake, Utensils, Dumbbell, SpadeIcon as Spa } from "lucide-react"

interface FilterChipsProps {
  selectedAmenities: string[]
  onAmenityToggle: (amenity: string) => void
  onClearAll: () => void
}

const amenityOptions = [
  { name: "WiFi", icon: Wifi, color: "bg-blue-50 text-blue-700 border-blue-200" },
  { name: "Pool", icon: Waves, color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  { name: "Air Conditioning", icon: Snowflake, color: "bg-sky-50 text-sky-700 border-sky-200" },
  { name: "Restaurant", icon: Utensils, color: "bg-orange-50 text-orange-700 border-orange-200" },
  { name: "Parking", icon: Car, color: "bg-slate-50 text-slate-700 border-slate-200" },
  { name: "Coffee Machine", icon: Coffee, color: "bg-amber-50 text-amber-700 border-amber-200" },
  { name: "Gym", icon: Dumbbell, color: "bg-red-50 text-red-700 border-red-200" },
  { name: "Spa", icon: Spa, color: "bg-purple-50 text-purple-700 border-purple-200" },
]

export default function FilterChips({ selectedAmenities, onAmenityToggle, onClearAll }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm font-medium text-slate-700 mr-2">Filters:</span>

      {amenityOptions.map((amenity) => {
        const isSelected = selectedAmenities.includes(amenity.name)
        const Icon = amenity.icon

        return (
          <Badge
            key={amenity.name}
            variant={isSelected ? "default" : "outline"}
            className={`cursor-pointer transition-all hover:scale-105 border ${
              isSelected
                ? "bg-primary-600 text-white hover:bg-primary-700 border-primary-600"
                : `${amenity.color} hover:shadow-sm`
            }`}
            onClick={() => onAmenityToggle(amenity.name)}
          >
            <Icon className="w-3 h-3 mr-1" />
            {amenity.name}
          </Badge>
        )
      })}

      {selectedAmenities.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 p-1 h-auto"
        >
          <X className="w-4 h-4 mr-1" />
          Clear all
        </Button>
      )}
    </div>
  )
}
