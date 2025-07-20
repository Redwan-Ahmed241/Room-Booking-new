"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "@/components/Navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Maximize, MapPin, Calendar, CreditCard, User, Mail, Phone } from "lucide-react"
import type { Room } from "@/lib/types"
import { mockRooms } from "@/lib/mockData"

export default function BookingPage() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)

  const [bookingData, setBookingData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    check_in: "",
    check_out: "",
    guests: 1,
    special_requests: "",
  })

  useEffect(() => {
    // Find room by ID
    const foundRoom = mockRooms.find((r) => r.id === roomId)
    setRoom(foundRoom || null)
    setLoading(false)
  }, [roomId])

  const calculateNights = () => {
    if (!bookingData.check_in || !bookingData.check_out) return 0
    const checkIn = new Date(bookingData.check_in)
    const checkOut = new Date(bookingData.check_out)
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const calculateTotal = () => {
    if (!room) return 0
    const nights = calculateNights()
    return nights * room.price_per_night
  }

  const handleBooking = () => {
    // In a real app, this would submit to an API
    alert("Booking submitted successfully! You will receive a confirmation email shortly.")
    navigate("/")
  }

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase()
    if (amenityLower.includes("pool")) return "🏊"
    if (amenityLower.includes("beach")) return "🏖️"
    if (amenityLower.includes("wifi")) return "📶"
    if (amenityLower.includes("ac") || amenityLower.includes("air")) return "❄️"
    if (amenityLower.includes("balcony")) return "🌅"
    if (amenityLower.includes("kitchen")) return "🍳"
    if (amenityLower.includes("spa")) return "🧘"
    return "✨"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/3 mb-4" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-slate-200 rounded" />
              <div className="h-96 bg-slate-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Room Not Found</h2>
              <p className="text-slate-600 mb-6">The room you're looking for doesn't exist.</p>
              <Button onClick={() => navigate("/rooms")}>Browse All Rooms</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="outline" onClick={() => navigate("/rooms")} className="mb-4">
            ← Back to Rooms
          </Button>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Book Your Stay</h1>
          <p className="text-slate-600">Complete your booking for {room.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Room Details */}
          <Card className="border-0 shadow-sm">
            <div className="relative h-64 overflow-hidden rounded-t-lg">
              <img
                src={room.images[0] || "/placeholder.svg?height=300&width=600&text=Room+Image"}
                alt={room.name}
                className="w-full h-full object-cover"
              />
              {room.room_type && (
                <Badge className="absolute top-3 left-3 bg-white/90 text-slate-800 border-0">{room.room_type}</Badge>
              )}
            </div>

            <CardContent className="p-6">
              {/* Villa and Location */}
              {room.villa && (
                <div className="flex items-center gap-1 text-sm text-slate-600 mb-2">
                  <MapPin className="w-3 h-3 text-primary-500" />
                  <span>
                    {room.villa.name} • {room.villa.location}
                  </span>
                </div>
              )}

              {/* Room Name and Rating */}
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-slate-900">{room.name}</h2>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-accent-400 text-accent-400" />
                  <span className="font-medium text-slate-700">{room.rating}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-600 mb-4">{room.description}</p>

              {/* Room Details */}
              <div className="flex items-center gap-6 text-slate-600 mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary-500" />
                  <span>{room.max_guests} guests</span>
                </div>
                {room.size_sqm && (
                  <div className="flex items-center gap-2">
                    <Maximize className="w-5 h-5 text-primary-500" />
                    <span>{room.size_sqm}m²</span>
                  </div>
                )}
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h3 className="font-semibold text-slate-900 mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700 border-0">
                      <span className="mr-1">{getAmenityIcon(amenity)}</span>
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg text-slate-600">Price per night</span>
                  <span className="text-2xl font-bold text-slate-900">${room.price_per_night}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Guest Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">Guest Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={bookingData.customer_name}
                    onChange={(e) => setBookingData({ ...bookingData, customer_name: e.target.value })}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={bookingData.customer_email}
                    onChange={(e) => setBookingData({ ...bookingData, customer_email: e.target.value })}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={bookingData.customer_phone}
                    onChange={(e) => setBookingData({ ...bookingData, customer_phone: e.target.value })}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Stay Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">Stay Details</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkin" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Check-in
                    </Label>
                    <Input
                      id="checkin"
                      type="date"
                      value={bookingData.check_in}
                      onChange={(e) => setBookingData({ ...bookingData, check_in: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="checkout" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Check-out
                    </Label>
                    <Input
                      id="checkout"
                      type="date"
                      value={bookingData.check_out}
                      onChange={(e) => setBookingData({ ...bookingData, check_out: e.target.value })}
                      min={bookingData.check_in || new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guests" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Number of Guests
                  </Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    max={room.max_guests}
                    value={bookingData.guests}
                    onChange={(e) => setBookingData({ ...bookingData, guests: Number.parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requests">Special Requests (Optional)</Label>
                  <textarea
                    id="requests"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={bookingData.special_requests}
                    onChange={(e) => setBookingData({ ...bookingData, special_requests: e.target.value })}
                    placeholder="Any special requests or requirements..."
                  />
                </div>
              </div>

              {/* Booking Summary */}
              <div className="border-t pt-4 space-y-3">
                <h3 className="font-semibold text-slate-900">Booking Summary</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Room rate per night</span>
                    <span>${room.price_per_night}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Number of nights</span>
                    <span>{calculateNights()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Number of guests</span>
                    <span>{bookingData.guests}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>
              </div>

              {/* Book Button */}
              <Button
                onClick={handleBooking}
                className="w-full bg-accent-500 hover:bg-accent-600 text-white py-3 text-lg font-semibold"
                disabled={
                  !bookingData.customer_name ||
                  !bookingData.customer_email ||
                  !bookingData.check_in ||
                  !bookingData.check_out
                }
              >
                Book Now - ${calculateTotal()}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
