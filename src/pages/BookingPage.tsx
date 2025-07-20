"use client"

import type React from "react"
import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Star, Wifi, Car, Utensils, Waves, ArrowLeft } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { mockRooms } from "../lib/mockData"
import { formatPrice, calculateNights } from "../lib/utils"
import type { BookingData } from "../lib/types"

const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const room = mockRooms.find((r) => r.id === id)

  const [bookingData, setBookingData] = useState<BookingData>({
    roomId: id || "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    totalPrice: 0,
    guestInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  })

  if (!room) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-500">Room not found</p>
      </div>
    )
  }

  const nights =
    bookingData.checkIn && bookingData.checkOut ? calculateNights(bookingData.checkIn, bookingData.checkOut) : 0

  const subtotal = nights * room.price
  const serviceFee = subtotal * 0.1
  const taxes = subtotal * 0.08
  const total = subtotal + serviceFee + taxes

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle booking submission
    alert("Booking submitted successfully!")
    navigate("/")
  }

  const amenityIcons: { [key: string]: React.ReactNode } = {
    WiFi: <Wifi className="w-4 h-4" />,
    Parking: <Car className="w-4 h-4" />,
    Restaurant: <Utensils className="w-4 h-4" />,
    "Beach Access": <Waves className="w-4 h-4" />,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Room Details */}
        <div>
          <div className="mb-6">
            <img
              src={room.images[0] || "/placeholder.svg"}
              alt={room.name}
              className="w-full h-80 object-cover rounded-xl"
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-semibold text-gray-900">{room.name}</h1>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-current text-gray-900" />
                <span className="text-sm font-medium">{room.rating}</span>
                <span className="text-sm text-gray-500">({room.reviews} reviews)</span>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{room.location}</p>
            <p className="text-gray-700">{room.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Room Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Guests:</span>
                <span className="ml-2 font-medium">{room.maxGuests}</span>
              </div>
              <div>
                <span className="text-gray-500">Bedrooms:</span>
                <span className="ml-2 font-medium">{room.bedrooms}</span>
              </div>
              <div>
                <span className="text-gray-500">Bathrooms:</span>
                <span className="ml-2 font-medium">{room.bathrooms}</span>
              </div>
              <div>
                <span className="text-gray-500">Size:</span>
                <span className="ml-2 font-medium">{room.size} m²</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {room.amenities.map((amenity) => (
                <Badge key={amenity} variant="outline" className="flex items-center space-x-1">
                  {amenityIcons[amenity]}
                  <span>{amenity}</span>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="flex items-baseline space-x-2">
                <span className="text-2xl font-semibold">{formatPrice(room.price)}</span>
                <span className="text-gray-500 font-normal">night</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBooking} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="checkin">Check-in</Label>
                    <Input
                      id="checkin"
                      type="date"
                      value={bookingData.checkIn}
                      onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="checkout">Check-out</Label>
                    <Input
                      id="checkout"
                      type="date"
                      value={bookingData.checkOut}
                      onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                      min={bookingData.checkIn || new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="guests">Guests</Label>
                  <select
                    id="guests"
                    value={bookingData.guests}
                    onChange={(e) => setBookingData({ ...bookingData, guests: Number(e.target.value) })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    {Array.from({ length: room.maxGuests }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "guest" : "guests"}
                      </option>
                    ))}
                  </select>
                </div>

                {nights > 0 && (
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        {formatPrice(room.price)} × {nights} nights
                      </span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Service fee</span>
                      <span>{formatPrice(serviceFee)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Taxes</span>
                      <span>{formatPrice(taxes)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-semibold">Guest Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={bookingData.guestInfo.firstName}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            guestInfo: { ...bookingData.guestInfo, firstName: e.target.value },
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={bookingData.guestInfo.lastName}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            guestInfo: { ...bookingData.guestInfo, lastName: e.target.value },
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={bookingData.guestInfo.email}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          guestInfo: { ...bookingData.guestInfo, email: e.target.value },
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={bookingData.guestInfo.phone}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          guestInfo: { ...bookingData.guestInfo, phone: e.target.value },
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 text-lg font-semibold"
                  disabled={!bookingData.checkIn || !bookingData.checkOut}
                >
                  Reserve
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default BookingPage
