"use client";

import type React from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import type { SearchFilters } from "../lib/types";
import { popularAmenities } from "../lib/mockData";

interface FilterChipsProps {
  filters: SearchFilters;
  onFilterChange: (filters: Partial<SearchFilters>) => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({
  filters,
  onFilterChange,
}) => {
  const roomTypes = ["Delux", "Double Delux"];

  const toggleRoomType = (type: string) => {
    onFilterChange({
      roomType: filters.roomType === type ? "" : type,
    });
  };

  const toggleAmenity = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];

    onFilterChange({ amenities: newAmenities });
  };

  const clearAllFilters = () => {
    onFilterChange({
      roomType: "",
      amenities: [],
      priceRange: [0, 1000],
    });
  };

  const hasActiveFilters = filters.roomType || filters.amenities.length > 0;

  return (
    <div className="space-y-4">
      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Active Filters
          </span>
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear all
          </Button>
        </div>
      )}

      {/* Room Types */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Room Type</h4>
        <div className="flex flex-wrap gap-2">
          {roomTypes.map((type) => (
            <Badge
              key={type}
              variant={filters.roomType === type ? "default" : "outline"}
              className="cursor-pointer capitalize hover:bg-gray-100"
              onClick={() => toggleRoomType(type)}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Amenities</h4>
        <div className="flex flex-wrap gap-2">
          {popularAmenities.slice(0, 8).map((amenity) => (
            <Badge
              key={amenity}
              variant={
                filters.amenities.includes(amenity) ? "default" : "outline"
              }
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => toggleAmenity(amenity)}
            >
              {amenity}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterChips;
