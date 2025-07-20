import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Users, Maximize, MapPin, Heart } from "lucide-react"
import { Link } from "react-router-dom"
import type { Room } from "@/lib/types"

interface RoomCardProps {
  room: Room & { villa?: { name: string; location: string } }
}

export default function RoomCard({ room }: RoomCardProps) {
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

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-1 bg-white">
      <div className="relative">
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={room.images[0] || "/placeholder.svg?height=300&width=400&text=Room+Image"}
            alt={room.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Favorite Button */}
          <button className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-sm">
            <Heart className="w-4 h-4 text-slate-600 hover:text-red-500" />
          </button>
          {/* Room Type Badge */}
          {room.room_type && (
            <Badge className="absolute top-3 left-3 bg-white/90 text-slate-800 hover:bg-white shadow-sm border-0">
              {room.room_type}
            </Badge>
          )}
        </div>

        <CardContent className="p-5">
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
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-slate-900 line-clamp-1">{room.name}</h3>
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 fill-accent-400 text-accent-400" />
              <span className="font-medium text-slate-700">{room.rating}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-600 text-sm mb-3 line-clamp-2">{room.description}</p>

          {/* Room Details */}
          <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-primary-500" />
              <span>{room.max_guests} guests</span>
            </div>
            {room.size_sqm && (
              <div className="flex items-center gap-1">
                <Maximize className="w-4 h-4 text-primary-500" />
                <span>{room.size_sqm}m²</span>
              </div>
            )}
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-1 mb-4">
            {room.amenities.slice(0, 4).map((amenity, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 border-0"
              >
                <span className="mr-1">{getAmenityIcon(amenity)}</span>
                {amenity}
              </Badge>
            ))}
            {room.amenities.length > 4 && (
              <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700 border-0">
                +{room.amenities.length - 4} more
              </Badge>
            )}
          </div>

          {/* Price and Book Button */}
          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold text-slate-900">${room.price_per_night}</span>
              <span className="text-slate-600 text-sm"> /night</span>
            </div>
            <Link to={`/book/${room.id}`}>
              <Button className="bg-accent-500 hover:bg-accent-600 text-white px-6 shadow-sm hover:shadow-md transition-all duration-200">
                Book Now
              </Button>
            </Link>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
