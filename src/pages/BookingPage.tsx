"use client";

import type React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Star, Users } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useRoom } from "../hooks/useRooms";

const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { room, loading, error } = useRoom(id || "");

  const handleBookNow = () => {
    const isAuthenticated = localStorage.getItem("access");
    if (isAuthenticated) {
      navigate(`/booking/${id}`);
    } else {
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading room details...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Room not found</p>
          <Button
            onClick={() => navigate("/")}
            className="bg-pink-500 hover:bg-pink-600"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Room Details */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4 md:mb-6">
              <img
                src={room.images?.[0] || "/placeholder.svg"}
                alt={room.name}
                className="w-full h-48 md:h-64 object-cover"
              />
              <div className="p-4 md:p-6">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  {room.name}
                </h1>
                <div className="flex items-center text-gray-600 mb-3 md:mb-4">
                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="text-sm md:text-base">{room.location}</span>
                </div>

                <div className="flex items-center mb-3 md:mb-4">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="font-medium text-sm md:text-base">
                    {room.rating}
                  </span>
                  <span className="text-gray-500 ml-1 text-sm md:text-base">
                    ({room.reviews} reviews)
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="text-center">
                    <Users className="h-4 w-4 md:h-5 md:w-5 mx-auto mb-1 text-gray-600" />
                    <p className="text-xs md:text-sm text-gray-600">
                      {room.max_guests} guests
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs md:text-sm text-gray-600 mt-5">
                      {room.bedrooms} bedrooms
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs md:text-sm text-gray-600 mt-5">
                      {room.bathrooms} bathrooms
                    </p>
                  </div>
                </div>

                <div className="mb-4 md:mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">
                    Amenities
                  </h3>
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {room.amenities?.map((amenity) => (
                      <Badge
                        key={amenity}
                        variant="outline"
                        className="text-xs"
                      >
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">
                    Description
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {room.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Book Now Button */}
          <div className="order-1 lg:order-2">
            <div className="fixed bottom-4 right-4">
              <Button
                onClick={handleBookNow}
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg shadow-lg"
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
