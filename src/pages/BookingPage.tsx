"use client"

import type React from "react"
import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Users, MapPin, Star } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Badge } from "../components/ui/badge"
import { useRoom } from "../hooks/useRooms"
import { bookingsApi } from "../lib/api"
import { formatPrice } from "../lib/utils"
import type { PartialBookingData } from "../lib/types"

const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { room, loading, error } = useRoom(id || "")

  const [bookingData, setBookingData] = useState<PartialBookingData>({
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
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string | number) => {
    if (field.startsWith("guestInfo.")) {
      const guestField = field.split(".")[1]
      setBookingData((prev) => ({
        ...prev,
        guestInfo: {
          ...prev.guestInfo,
          [guestField]: value,
        },
      }))
    } else {
      setBookingData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const calculateTotalPrice = () => {
    if (!room || !bookingData.checkIn || !bookingData.checkOut) return 0

    const checkIn = new Date(bookingData.checkIn)
    const checkOut = new Date(bookingData.checkOut)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

    return nights > 0 ? nights * room.price : 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      if (!room || !id) {
        throw new Error("Room information not available")
      }

      const bookingPayload = {
        roomId: id,
        checkIn: bookingData.checkIn!,
        checkOut: bookingData.checkOut!,
        guests: bookingData.guests!,
        guestInfo: {
          name: bookingData.guestInfo!.name!,
          email: bookingData.guestInfo!.email!,
          phone: bookingData.guestInfo!.phone!,
        }
      }

      await bookingsApi.createBooking(bookingPayload)

      // Show success message and redirect
      alert("Booking submitted successfully!")
      navigate("/")
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit booking. Please try again.")
      console.error("Booking submission error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading room details...</p>
        </div>
      </div>
    )
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Room not found</p>
          <Button onClick={() => navigate("/")} className="bg-pink-500 hover:bg-pink-600">
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  const totalPrice = calculateTotalPrice()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Room Details */}
          <div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <img src={room.images?.[0] || "/placeholder.svg"} alt={room.name} className="w-full h-64 object-cover" />
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{room.name}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{room.location}</span>
                </div>

                <div className="flex items-center mb-4">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="font-medium">{room.rating}</span>
                  <span className="text-gray-500 ml-1">({room.reviews} reviews)</span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <Users className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                    <p className="text-sm text-gray-600">{room.maxGuests} guests</p>
                  </div>
                  <div className="text-center">
                    <span className="text-sm text-gray-600">{room.bedrooms} bedrooms</span>
                  </div>
                  <div className="text-center">
                    <span className="text-sm text-gray-600">{room.bathrooms} bathrooms</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities?.map((amenity) => (
                      <Badge key={amenity} variant="outline">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-600">{room.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Book Your Stay</span>
                  <span className="text-2xl font-bold text-pink-500">{formatPrice(room.price)}/night</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="checkIn">Check-in</Label>
                      <Input
                        id="checkIn"
                        type="date"
                        required
                        value={bookingData.checkIn}
                        onChange={(e) => handleInputChange("checkIn", e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div>
                      <Label htmlFor="checkOut">Check-out</Label>
                      <Input
                        id="checkOut"
                        type="date"
                        required
                        value={bookingData.checkOut}
                        onChange={(e) => handleInputChange("checkOut", e.target.value)}
                        min={bookingData.checkIn || new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="guests">Guests</Label>
                    <Input
                      id="guests"
                      type="number"
                      min="1"
                      max={room.maxGuests}
                      required
                      value={bookingData.guests}
                      onChange={(e) => handleInputChange("guests", Number.parseInt(e.target.value))}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Guest Information</h3>
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={bookingData.guestInfo?.name}
                        onChange={(e) => handleInputChange("guestInfo.name", e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={bookingData.guestInfo?.email}
                        onChange={(e) => handleInputChange("guestInfo.email", e.target.value)}
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={bookingData.guestInfo?.phone}
                        onChange={(e) => handleInputChange("guestInfo.phone", e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  {totalPrice > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span>
                          {formatPrice(room.price)} x{" "}
                          {Math.ceil(
                            (new Date(bookingData.checkOut!).getTime() - new Date(bookingData.checkIn!).getTime()) /
                            (1000 * 60 * 60 * 24),
                          )}{" "}
                          nights
                        </span>
                        <span>{formatPrice(totalPrice)}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between items-center font-semibold">
                        <span>Total</span>
                        <span className="text-pink-500">{formatPrice(totalPrice)}</span>
                      </div>
                    </div>
                  )}

                  {submitError && (
                    <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
                      {submitError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting || totalPrice === 0}
                    className="w-full bg-pink-500 hover:bg-pink-600"
                  >
                    {isSubmitting ? "Booking..." : "Book Now"}
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
