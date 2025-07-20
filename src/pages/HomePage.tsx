import type React from "react"
import HeroSearch from "../components/HeroSearch"
import RoomCard from "../components/RoomCard"
import { mockRooms } from "../lib/mockData"

const HomePage: React.FC = () => {
  const featuredRooms = mockRooms.slice(0, 4)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-pink-500 via-red-500 to-orange-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Find Your Perfect <span className="text-orange-200">Villa Stay</span>
            </h1>
            <p className="text-xl sm:text-2xl text-pink-100 max-w-3xl mx-auto">
              Discover luxury accommodations in paradise. Book your dream room with stunning views and world-class
              amenities.
            </p>
          </div>

          <HeroSearch />
        </div>
      </div>

      {/* Featured Rooms */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured stays</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-pink-500 mb-2">1M+</div>
              <div className="text-gray-600">Happy Guests</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-500 mb-2">50K+</div>
              <div className="text-gray-600">Luxury Villas</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-500 mb-2">200+</div>
              <div className="text-gray-600">Destinations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
