"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "@/components/navbar"
import RoomCard from "@/components/room-card"
import FilterChips from "@/components/filter-chips"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal, Grid, List } from "lucide-react"
import type { Room, SearchFilters } from "@/lib/types"
import PriceRangeSlider from "@/components/price-range-slider"

export default function RoomsPage() {
  const searchParams = useSearchParams()
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState<SearchFilters>({
    check_in: searchParams.get("check_in") || "",
    check_out: searchParams.get("check_out") || "",
    guests: searchParams.get("guests") ? Number.parseInt(searchParams.get("guests")!) : undefined,
    villa_name: searchParams.get("villa_name") || "",
    min_price: searchParams.get("min_price") ? Number.parseInt(searchParams.get("min_price")!) : 0,
    max_price: searchParams.get("max_price") ? Number.parseInt(searchParams.get("max_price")!) : 1000,
    amenities: [],
    room_type: "",
  })

  useEffect(() => {
    fetchRooms()
  }, [filters])

  const fetchRooms = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "" && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v))
          } else {
            params.set(key, value.toString())
          }
        }
      })

      const response = await fetch(`/api/rooms?${params.toString()}`)
      const data = await response.json()
      setRooms(data)
    } catch (error) {
      console.error("Error fetching rooms:", error)
      setRooms([])
    } finally {
      setLoading(false)
    }
  }

  const handleAmenityToggle = (amenity: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities?.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...(prev.amenities || []), amenity],
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      check_in: "",
      check_out: "",
      guests: undefined,
      villa_name: "",
      min_price: 0,
      max_price: 1000,
      amenities: [],
      room_type: "",
    })
  }

  const handlePriceRangeChange = (range: [number, number]) => {
    setFilters({ ...filters, min_price: range[0], max_price: range[1] })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Available Rooms</h1>
          <p className="text-slate-600">{loading ? "Loading..." : `${rooms.length} rooms available`}</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Check-in</Label>
                <Input
                  type="date"
                  value={filters.check_in}
                  onChange={(e) => setFilters({ ...filters, check_in: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  className="border-slate-300 focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Check-out</Label>
                <Input
                  type="date"
                  value={filters.check_out}
                  onChange={(e) => setFilters({ ...filters, check_out: e.target.value })}
                  min={filters.check_in || new Date().toISOString().split("T")[0]}
                  className="border-slate-300 focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Guests</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={filters.guests || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, guests: e.target.value ? Number.parseInt(e.target.value) : undefined })
                  }
                  className="border-slate-300 focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Room Type</Label>
                <Select
                  value={filters.room_type}
                  onValueChange={(value) => setFilters({ ...filters, room_type: value })}
                >
                  <SelectTrigger className="border-slate-300 focus:border-primary-500 focus:ring-primary-500">
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any type</SelectItem>
                    <SelectItem value="Standard Room">Standard Room</SelectItem>
                    <SelectItem value="Deluxe Room">Deluxe Room</SelectItem>
                    <SelectItem value="Suite">Suite</SelectItem>
                    <SelectItem value="Family Suite">Family Suite</SelectItem>
                    <SelectItem value="Presidential Suite">Presidential Suite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <FilterChips
                selectedAmenities={filters.amenities || []}
                onAmenityToggle={handleAmenityToggle}
                onClearAll={() => setFilters({ ...filters, amenities: [] })}
              />

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
                <div className="flex border border-slate-300 rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none border-0"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none border-0"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Additional Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-slate-200 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium">Villa Name</Label>
                    <Input
                      placeholder="Search villa..."
                      value={filters.villa_name}
                      onChange={(e) => setFilters({ ...filters, villa_name: e.target.value })}
                      className="border-slate-300 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <PriceRangeSlider
                      min={0}
                      max={1000}
                      value={[filters.min_price || 0, filters.max_price || 1000]}
                      onChange={handlePriceRangeChange}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse border-0 shadow-sm">
                <div className="h-64 bg-slate-200" />
                <CardContent className="p-4">
                  <div className="h-4 bg-slate-200 rounded mb-2" />
                  <div className="h-4 bg-slate-200 rounded w-2/3 mb-4" />
                  <div className="h-8 bg-slate-200 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : rooms.length > 0 ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12 border-0 shadow-sm">
            <CardContent>
              <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No rooms found</h3>
              <p className="text-slate-600 mb-4">Try adjusting your search criteria or clearing some filters.</p>
              <Button
                onClick={clearAllFilters}
                variant="outline"
                className="border-slate-300 text-slate-700 bg-transparent"
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
