"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Heart, Star, MapPin } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { formatPrice } from "../lib/utils"
import type { Room } from "../lib/types"

interface RoomCardProps {
  room: Room
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length)
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 border-0 shadow-sm">
      <div className="relative">
        <Link to={`/booking/${room.id}`}>
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={room.images[currentImageIndex] || "/placeholder.svg"}
              alt={room.name}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-200"
            />

            {/* Image Navigation */}
            {room.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Image Dots */}
            {room.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {room.images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                  />
                ))}
              </div>
            )}
          </div>
        </Link>

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full p-2"
          onClick={(e) => {
            e.preventDefault()
            setIsFavorite(!isFavorite)
          }}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-pink-500 text-pink-500" : "text-gray-600"}`} />
        </Button>

        {/* Room Type Badge */}
        <Badge variant="secondary" className="absolute top-3 left-3 bg-white/90 text-gray-700 capitalize">
          {room.type}
        </Badge>
      </div>

      <CardContent className="p-4">
        <Link to={`/booking/${room.id}`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-1">
                {room.name}
              </h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="w-3 h-3 mr-1" />
                {room.location}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{room.rating}</span>
              <span className="text-sm text-gray-500">({room.reviews})</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <span>{room.maxGuests} guests</span>
            <span>{room.bedrooms} bed</span>
            <span>{room.bathrooms} bath</span>
            <span>{room.size}m²</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline space-x-1">
              <span className="text-lg font-bold text-gray-900">{formatPrice(room.price)}</span>
              <span className="text-sm text-gray-500">night</span>
            </div>
            <Badge variant={room.available ? "default" : "secondary"}>{room.available ? "Available" : "Booked"}</Badge>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}

export default RoomCard
