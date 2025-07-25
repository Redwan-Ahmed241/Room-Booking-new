"use client"

import type React from "react"
import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MapPin, Star, Wifi } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Badge } from "../components/ui/badge"
import { mockRooms } from "../lib/mockData"
import { formatPrice } from "../lib/utils"
import type { BookingData } from "../lib/types"

const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const room = mockRooms.find((r) => r.id === id)

  const [bookingData, setBookingData] = useState<Partial<BookingData>>({
    roomId: id,
    checkIn: "",
    checkOut: "",
    guests: 1,
    guestInfo: {
      name: "",
      email: "",
      phone: "",
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Room not found</h1>
          <Button onClick={() => navigate("/rooms")}>Back to Rooms</Button>
        </div>
      </div>
    )
  }

  const calculateTotalPrice = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0

    const checkIn = new Date(bookingData.checkIn)
    const checkOut = new Date(bookingData.checkOut)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

    return nights > 0 ? nights * room.price : 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate booking submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    alert("Booking confirmed! You will receive a confirmation email shortly.")
    navigate("/")
    setIsSubmitting(false)
  }

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith("guestInfo.")) {
      const guestField = field.split(".")[1]
      setBookingData({
        ...bookingData,
        guestInfo: {
          ...bookingData.guestInfo,
          [guestField]: value,
        },
      })
    } else {
      setBookingData({
        ...bookingData,
        [field]: value,
      })
    }
  }

  const totalPrice = calculateTotalPrice()
  const nights =
    bookingData.checkIn && bookingData.checkOut
      ? Math.ceil(
          (new Date(bookingData.checkOut).getTime() - new Date(bookingData.checkIn).getTime()) / (1000 * 60 * 60 * 24),
        )
      : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Room Details */}
          <div>
            <div className="mb-6">
              <img
                src={room.images[0] || "/placeholder.svg"}
                alt={room.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{room.name}</h1>
              <div className="flex items-center space-x-4 text-gray-600 mb-4">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {room.location}
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                  {room.rating} ({room.reviews} reviews)
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                <span>{room.maxGuests} guests</span>
                <span>
                  {room.bedrooms} bedroom{room.bedrooms > 1 ? "s" : ""}
                </span>
                <span>
                  {room.bathrooms} bathroom{room.bathrooms > 1 ? "s" : ""}
                </span>
                <span>{room.size}m²</span>
              </div>

              <Badge variant="outline" className="capitalize mb-4">
                {room.type}
              </Badge>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-gray-600">{room.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Amenities</h3>
              <div className="grid grid-cols-2 gap-2">
                {room.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Wifi className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Book Your Stay</span>
                  <span className="text-2xl font-bold text-pink-600">
                    {formatPrice(room.price)}
                    <span className="text-sm font-normal text-gray-500">/night</span>
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="checkIn">Check-in</Label>
                      <Input
                        id="checkIn"
                        type="date"
                        value={bookingData.checkIn}
                        onChange={(e) => handleInputChange("checkIn", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="checkOut">Check-out</Label>
                      <Input
                        id="checkOut"
                        type="date"
                        value={bookingData.checkOut}
                        onChange={(e) => handleInputChange("checkOut", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <Label htmlFor="guests">Guests</Label>
                    <select
                      id="guests"
                      value={bookingData.guests}
                      onChange={(e) => handleInputChange("guests", Number(e.target.value))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      {Array.from({ length: room.maxGuests }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} guest{i > 0 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Guest Information */}
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-medium">Guest Information</h4>

                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={bookingData.guestInfo?.name}
                        onChange={(e) => handleInputChange("guestInfo.name", e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={bookingData.guestInfo?.email}
                        onChange={(e) => handleInputChange("guestInfo.email", e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={bookingData.guestInfo?.phone}
                        onChange={(e) => handleInputChange("guestInfo.phone", e.target.value)}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  {totalPrice > 0 && (
                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span>
                          {formatPrice(room.price)} × {nights} night{nights > 1 ? "s" : ""}
                        </span>
                        <span>{formatPrice(totalPrice)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                        <span>Total</span>
                        <span>{formatPrice(totalPrice)}</span>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting || !totalPrice}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    {isSubmitting ? "Processing..." : "Confirm Booking"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingPage
