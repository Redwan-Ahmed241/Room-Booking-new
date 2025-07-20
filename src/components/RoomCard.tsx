import type React from "react"
import { Link } from "react-router-dom"
import { Star, Heart } from "lucide-react"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { formatPrice } from "../lib/utils"
import type { Room } from "../lib/types"

interface RoomCardProps {
  room: Room
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  return (
    <Card className="group overflow-hidden border-0 shadow-none hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={room.images[0] || "/placeholder.svg"}
          alt={room.name}
          className="w-full h-64 object-cover rounded-xl"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-700 rounded-full w-8 h-8"
        >
          <Heart className="w-4 h-4" />
        </Button>
        {room.type === "villa" && <Badge className="absolute top-3 left-3 bg-pink-500 text-white">Villa</Badge>}
      </div>

      <div className="p-0 pt-3">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{room.location}</h3>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-current text-gray-900" />
            <span className="text-sm text-gray-900">{room.rating}</span>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-1">{room.name}</p>
        <p className="text-sm text-gray-500 mb-2">
          {room.bedrooms} bedroom{room.bedrooms > 1 ? "s" : ""} • {room.bathrooms} bathroom
          {room.bathrooms > 1 ? "s" : ""}
        </p>

        <div className="flex items-baseline space-x-1">
          <span className="font-semibold text-gray-900">{formatPrice(room.price)}</span>
          <span className="text-sm text-gray-500">night</span>
        </div>
      </div>

      <Link to={`/booking/${room.id}`} className="absolute inset-0 z-10" aria-label={`View details for ${room.name}`} />
    </Card>
  )
}

export default RoomCard
