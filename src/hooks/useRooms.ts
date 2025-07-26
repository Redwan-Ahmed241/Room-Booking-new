"use client"

import { useState, useEffect } from "react"
import { roomsApi } from "../lib/api"
import type { Room, SearchFilters } from "../lib/types"

export const useRooms = (filters?: Partial<SearchFilters>) => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRooms = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await roomsApi.getRooms(filters)
      setRooms(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch rooms")
      console.error("Error fetching rooms:", err)
    } finally {
      setLoading(false)
    }
  }

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
        const data = await roomsApi.getRoom(id)
        setRoom(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch room")
        console.error("Error fetching room:", err)
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
