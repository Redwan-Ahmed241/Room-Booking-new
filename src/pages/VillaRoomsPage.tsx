"use client";

import type React from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, ChevronRight, ArrowLeft, X, DoorOpen, Loader2, AlertCircle, Building2 } from "lucide-react";
import { useRooms } from "../hooks/useRooms";
import type { Room } from "../lib/types";

const VillaRoomsPage: React.FC = () => {
  const { villaName } = useParams<{ villaName: string }>();
  const decodedVillaName = decodeURIComponent(villaName || "");
  const navigate = useNavigate();

  const { rooms, isLoading, createRoom, isCreating } = useRooms(decodedVillaName);
  const [error, setError] = useState<string | null>(null);
  const [isAddingRoom, setIsAddingRoom] = useState(false);

  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    name: "", type: "villa", price: 0, rating: 0, reviews: 0,
    images: [], amenities: [], description: "",
    location: decodedVillaName, maxGuests: 1, bedrooms: 1, bathrooms: 1, size: 30, available: true,
  });

  const handleAddRoom = async () => {
    if (!newRoom.name) return;
    try {
      setError(null);
      await createRoom({
        name: newRoom.name, type: newRoom.type || "villa", price: newRoom.price || 0,
        rating: 0, reviews: 0, images: [], amenities: newRoom.amenities || [],
        description: newRoom.description || "", location: decodedVillaName,
        maxGuests: newRoom.maxGuests || 1, bedrooms: newRoom.bedrooms || 1,
        bathrooms: newRoom.bathrooms || 1, size: newRoom.size || 30, available: newRoom.available ?? true,
      });
      setNewRoom({ name: "", type: "villa", price: 0, description: "", location: decodedVillaName, maxGuests: 1, bedrooms: 1, bathrooms: 1, size: 30, available: true, amenities: [], images: [] });
      setIsAddingRoom(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create room");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-white/30 mx-auto" />
          <p className="text-white/30 text-sm">Loading rooms…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Frosted content panel */}
      <div className="rounded-2xl p-6 sm:p-8" style={{ background: "rgba(8,8,8,0.65)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.07)" }}>

        {/* Back breadcrumb */}
        <button
          onClick={() => navigate("/admin")}
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Properties
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-white/30 mb-1">
              <Building2 className="w-3.5 h-3.5" />
              Property Management
            </div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">{decodedVillaName}</h1>
            <p className="text-white/40 text-sm mt-1">
              {rooms.length} {rooms.length === 1 ? "room" : "rooms"} in this property
            </p>
          </div>
          <button
            onClick={() => setIsAddingRoom(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Room
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-red-400" style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.15)" }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} className="text-red-400/50 hover:text-red-400 transition-colors"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Add Room Modal/Inline */}
        {isAddingRoom && (
          <div className="mb-6 p-6 rounded-2xl border space-y-4" style={{ background: "var(--surface-2)", borderColor: "var(--border-default)" }}>
            <h3 className="text-sm font-medium text-white">Add New Room to {decodedVillaName}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-white/40 mb-1">Room Name *</label>
                <input
                  type="text"
                  value={newRoom.name || ""}
                  onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                  placeholder="e.g. Room 101"
                  className="w-full h-10 rounded-xl px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  style={{ background: "var(--surface-3)", border: "1px solid var(--border-subtle)" }}
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">Price (£/month)</label>
                <input
                  type="number"
                  value={newRoom.price || ""}
                  onChange={(e) => setNewRoom({ ...newRoom, price: Number(e.target.value) })}
                  placeholder="e.g. 750"
                  className="w-full h-10 rounded-xl px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  style={{ background: "var(--surface-3)", border: "1px solid var(--border-subtle)" }}
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">Max Guests</label>
                <input
                  type="number"
                  value={newRoom.maxGuests || 1}
                  onChange={(e) => setNewRoom({ ...newRoom, maxGuests: Number(e.target.value) })}
                  className="w-full h-10 rounded-xl px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  style={{ background: "var(--surface-3)", border: "1px solid var(--border-subtle)" }}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsAddingRoom(false)}
                className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRoom}
                disabled={!newRoom.name || isCreating}
                className="px-5 py-2 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 disabled:opacity-40 transition-all flex items-center gap-2"
              >
                {isCreating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                Save Room
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {rooms.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ background: "var(--surface-3)", border: "1px solid var(--border-subtle)" }}>
              <DoorOpen className="w-6 h-6 text-white/20" />
            </div>
            <h3 className="text-base font-medium text-white/60 mb-1">No rooms in this property</h3>
            <p className="text-white/30 text-sm mb-5">Add rooms to set prices, manage occupants, and upload documents.</p>
            <button
              onClick={() => setIsAddingRoom(true)}
              className="px-5 py-2.5 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
            >
              <Plus className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              Add First Room
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => navigate(`/admin/room/${room.id}`)}
                className="group text-left rounded-2xl overflow-hidden ds-card ds-card-hover transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden" style={{ background: "var(--surface-3)" }}>
                  {room.images && room.images.length > 0 ? (
                    <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <DoorOpen className="w-8 h-8 text-white/10" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      room.available
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}>
                      {room.available ? "To-Let" : "Occupied"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-white group-hover:text-white/80 transition-colors">{room.name}</h3>
                      <p className="text-xs text-white/30 mt-0.5">{room.type}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" />
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5 text-xs text-white/40">
                    <span>{room.bedrooms} bed · {room.bathrooms} bath</span>
                    <span className="text-sm font-semibold text-white">£{room.price}/mo</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VillaRoomsPage;
