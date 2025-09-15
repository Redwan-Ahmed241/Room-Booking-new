"use client"

import { useState, useEffect } from "react"
import { roomsApi } from "../lib/api"
import { mockRooms } from "../lib/mockData"
import type { Room, SearchFilters } from "../lib/types"

export const useRooms = (filters?: Partial<SearchFilters>) => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      // Try to fetch from API first
      const data = await roomsApi.getRooms(filters);
      // If data is not an array, fallback to mockRooms
      if (Array.isArray(data)) {
        setRooms(data);
      } else if (Array.isArray(data?.data)) {
        setRooms(data.data);
      } else {
        setRooms(mockRooms);
      }
    } catch (apiError) {
      console.warn("API not available, using mock data:", apiError);
      // Filter mock data based on filters
      let filteredRooms = mockRooms;
      if (filters) {
        filteredRooms = mockRooms.filter((room) => {
          const matchesLocation =
            !filters.location || room.location.toLowerCase().includes(filters.location.toLowerCase());
          const matchesGuests = !filters.guests || room.maxGuests >= filters.guests;
          const matchesPrice =
            (!filters.minPrice || room.price >= filters.minPrice) &&
            (!filters.maxPrice || room.price <= filters.maxPrice);
          const matchesType = !filters.roomType || room.type === filters.roomType;
          const matchesAmenities =
            !filters.amenities?.length || filters.amenities.every((amenity) => room.amenities.includes(amenity));
          return matchesLocation && matchesGuests && matchesPrice && matchesType && matchesAmenities;
        });
      }
      setRooms(filteredRooms);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms()
  }, [JSON.stringify(filters)])

  return {
    rooms,
    loading,
    error,
    refetch: fetchRooms,
  }
}

export const useRoom = (id: string) => {
  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true)
        setError(null)

        // Try API first, fallback to mock data
        try {
          const data = await roomsApi.getRoom(id)
          setRoom(data)
        } catch (apiError) {
          console.warn("API not available, using mock data:", apiError)
          const mockRoom = mockRooms.find((room) => room.id === id)
          setRoom(mockRoom || null)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch room")
        console.error("Error fetching room:", err)
        // Fallback to mock data
        const mockRoom = mockRooms.find((room) => room.id === id)
        setRoom(mockRoom || null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchRoom()
    }
  }, [id])

  return {
    room,
    loading,
    error,
  }
}
