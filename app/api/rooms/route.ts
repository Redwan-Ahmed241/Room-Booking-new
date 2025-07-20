import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    let query = supabase
      .from("rooms")
      .select(`
        *,
        villa:villas(name, location)
      `)
      .eq("is_available", true)

    // Apply filters
    const checkIn = searchParams.get("check_in")
    const checkOut = searchParams.get("check_out")
    const guests = searchParams.get("guests")
    const villaName = searchParams.get("villa_name")
    const minPrice = searchParams.get("min_price")
    const maxPrice = searchParams.get("max_price")
    const roomType = searchParams.get("room_type")
    const amenities = searchParams.getAll("amenities")

    if (guests) {
      query = query.gte("max_guests", Number.parseInt(guests))
    }

    if (minPrice && Number.parseFloat(minPrice) > 0) {
      query = query.gte("price_per_night", Number.parseFloat(minPrice))
    }

    if (maxPrice && Number.parseFloat(maxPrice) < 1000) {
      query = query.lte("price_per_night", Number.parseFloat(maxPrice))
    }

    if (roomType && roomType !== "any") {
      query = query.eq("room_type", roomType)
    }

    if (villaName) {
      query = query.ilike("villa.name", `%${villaName}%`)
    }

    if (amenities.length > 0) {
      query = query.overlaps("amenities", amenities)
    }

    // Check availability if dates provided
    if (checkIn && checkOut) {
      const { data: bookedRooms } = await supabase
        .from("bookings")
        .select("room_id")
        .neq("status", "cancelled")
        .or(`check_in.lte.${checkOut},check_out.gte.${checkIn}`)

      if (bookedRooms && bookedRooms.length > 0) {
        const bookedRoomIds = bookedRooms.map((b) => b.room_id)
        query = query.not("id", "in", `(${bookedRoomIds.join(",")})`)
      }
    }

    const { data, error } = await query.order("rating", { ascending: false })

    if (error) {
      console.error("Error fetching rooms:", error)
      return NextResponse.json([], { status: 200 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error in rooms API:", error)
    return NextResponse.json([], { status: 200 })
  }
}
