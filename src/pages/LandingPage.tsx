/**
 * LandingPage.tsx — NeoScape Properties public landing page
 *
 * Layout & design inspired by canarypm.ca:
 *  - Full-viewport hero with background video
 *  - "Why NeoScape" scroll-reveal section
 *  - Numbered action rows (Browse / Apply / Move In)
 *  - Apartment-first property & room hierarchy (grouped by property location)
 *  - Platform features section
 *  - FAQ accordion
 *  - Footer with branding
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Home, ArrowRight, ChevronDown } from "lucide-react";
import { publicApi } from "../lib/tenantApi";
import InterestFormModal from "../components/InterestFormModal";
import Logo from "../components/Logo";

/* ═══════════════════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════════════ */

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4";

const WHY_TEXT =
  "Managing your tenancy should feel effortless. We handle documents, rent tracking, maintenance requests, and agreements digitally — so you focus on living, not paperwork.";

const MARQUEE_TEXT =
  "ROOMS · DOCUMENTS · RENT TRACKING · AGREEMENTS · MAINTENANCE · DIGITAL SIGNING · TENANT PORTAL · ";

const FAQ_ITEMS = [
  {
    q: "How do I browse available rooms?",
    a: "Simply scroll down to the Available Apartments section. Browse properties by location and view rooms nested under each apartment with real-time availability.",
  },
  {
    q: "What documents do I need to apply?",
    a: "Typically a valid ID, proof of income, and a reference. Our digital document center makes uploading and managing these seamless — no paperwork needed.",
  },
  {
    q: "How does rent payment work?",
    a: "Your rent schedule, due dates, and payment history are all tracked in your Tenant Portal. You'll receive automated reminders before each due date.",
  },
  {
    q: "Can I chat with the property admin?",
    a: "Yes! Our built-in messaging system lets you communicate directly with the admin, share files, and even generate digital agreements from your conversations.",
  },
  {
    q: "How do digital agreements work?",
    a: "Once terms are discussed via chat, our AI drafts an agreement based on the conversation. Both parties review, annotate, and digitally sign — all within the platform.",
  },
  {
    q: "What happens after I move in?",
    a: "You get full access to the Tenant Portal: view your room details, track rent, submit maintenance requests, manage documents, and communicate with the admin 24/7.",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════ */

interface BackendRoom {
  id: number;
  name: string;
  type: string;
  price: number;
  rating?: number;
  reviews?: number;
  images: string[];
  amenities: string[];
  description: string;
  location: string;
  maxGuests: number;
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  available: boolean;
}

interface BackendProperty {
  name: string;
  roomCount: number;
  minPrice: number;
  maxPrice: number;
  imageUrl: string | null;
  allImages: string[];
  amenities: string[];
  roomTypes: string[];
}

interface PropertyGroup extends BackendProperty {
  rooms: BackendRoom[];
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUBCOMPONENTS
   ═══════════════════════════════════════════════════════════════════════ */

/** Scroll-reveal text — words progressively light up as user scrolls */
function RevealText({ text }: { text: string }) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      const start = viewH * 0.75;
      const end = viewH * 0.25;
      const p = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      setProgress(p);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const words = text.split(" ");

  return (
    <p
      ref={containerRef}
      style={{
        margin: 0,
        fontSize: "clamp(24px, 3.5vw, 48px)",
        fontWeight: 600,
        letterSpacing: "-0.025em",
        lineHeight: 1.25,
        maxWidth: "25ch",
      }}
    >
      {words.map((word, i) => {
        const wordProgress = i / words.length;
        const isLit = progress > wordProgress;
        return (
          <span
            key={i}
            style={{
              color: isLit ? "#f4efe6" : "rgba(207,196,174,0.3)",
              transition: "color 0.35s ease",
            }}
          >
            {word}{" "}
          </span>
        );
      })}
    </p>
  );
}

/** Individual Room Card with image fallback hierarchy */
function RoomCard({
  room,
  propertyFallbackImage,
  onEnquire,
}: {
  room: BackendRoom;
  propertyFallbackImage?: string | null;
  onEnquire: (room: BackendRoom) => void;
}) {
  const [imgIdx, setImgIdx] = useState(0);
  
  // Image Fallback Hierarchy: Room Images -> Property Image -> Placeholder
  const availableImages = room.images && room.images.length > 0 
    ? room.images 
    : (propertyFallbackImage ? [propertyFallbackImage] : []);
  
  const displayImage = availableImages[imgIdx] || null;

  const nextImg = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (availableImages.length > 1) {
      setImgIdx((prev) => (prev + 1) % availableImages.length);
    }
  }, [availableImages.length]);

  const prevImg = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (availableImages.length > 1) {
      setImgIdx((prev) => (prev - 1 + availableImages.length) % availableImages.length);
    }
  }, [availableImages.length]);

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-white/5">
        {displayImage ? (
          <img
            src={displayImage}
            alt={room.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-white/20">
            <Building2 className="h-10 w-10 stroke-[1.5]" />
            <span className="mt-2 text-xs font-medium text-white/30">No Image Available</span>
          </div>
        )}

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Availability Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md"
            style={{
              background: room.available ? "rgba(16,185,129,0.85)" : "rgba(239,68,68,0.75)",
              color: "#ffffff",
              boxShadow: room.available ? "0 2px 10px rgba(16,185,129,0.3)" : "none",
            }}
          >
            {room.available ? "AVAILABLE" : "OCCUPIED"}
          </span>
        </div>

        {/* Room Type Tag */}
        {room.type && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2 py-0.5 rounded bg-black/60 text-white/70 text-[10px] font-semibold tracking-wider uppercase border border-white/10 backdrop-blur-md">
              {room.type}
            </span>
          </div>
        )}

        {/* Multi-image navigation arrows */}
        {availableImages.length > 1 && (
          <>
            <button
              onClick={prevImg}
              className="absolute top-0 bottom-0 left-0 w-10 z-20 flex items-center justify-start pl-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="w-6 h-6 rounded-full bg-black/50 border border-white/30 text-white flex items-center justify-center text-xs backdrop-blur">
                ‹
              </span>
            </button>
            <button
              onClick={nextImg}
              className="absolute top-0 bottom-0 right-0 w-10 z-20 flex items-center justify-end pr-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="w-6 h-6 rounded-full bg-black/50 border border-white/30 text-white flex items-center justify-center text-xs backdrop-blur">
                ›
              </span>
            </button>
            <div className="absolute left-0 right-0 bottom-2.5 flex justify-center gap-1 z-10 pointer-events-none">
              {availableImages.slice(0, 6).map((_, di) => (
                <span
                  key={di}
                  className="w-1 h-1 rounded-full"
                  style={{
                    background: di === imgIdx ? "#fff" : "rgba(255,255,255,0.4)",
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Room Details */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex items-baseline justify-between gap-2">
          <h4 className="font-semibold text-base text-white group-hover:text-emerald-400 transition-colors truncate">
            {room.name || "Room"}
          </h4>
          <span className="font-bold text-base text-emerald-400 flex-none">
            £{room.price ? room.price.toLocaleString() : "0"}
            <span className="text-white/40 text-xs font-normal">/mo</span>
          </span>
        </div>

        {/* Specs row */}
        <div className="flex items-center gap-3 text-xs text-white/50">
          {room.maxGuests > 0 && (
            <span>
              <b className="text-white/80">{room.maxGuests}</b> max guests
            </span>
          )}
          {room.bedrooms ? (
            <span>• <b className="text-white/80">{room.bedrooms}</b> bed</span>
          ) : null}
          {room.bathrooms ? (
            <span>• <b className="text-white/80">{room.bathrooms}</b> bath</span>
          ) : null}
        </div>

        {/* Amenities preview */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {room.amenities.slice(0, 3).map((a) => (
              <span key={a} className="text-[10px] text-white/40 bg-white/5 border border-white/[0.06] px-2 py-0.5 rounded">
                {a}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="text-[10px] text-white/30 px-1 py-0.5">
                +{room.amenities.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Apply / Enquire Button */}
        <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <span className="text-[11px] text-white/40">
            {room.location}
          </span>
          <button
            onClick={() => onEnquire(room)}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-black text-white text-xs font-semibold transition-all duration-200"
          >
            Enquire Room
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export default function LandingPage() {
  const navigate = useNavigate();
  const [propertyGroups, setPropertyGroupGroups] = useState<PropertyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "available" | "occupied">("all");
  const [headerSolid, setHeaderSolid] = useState(false);
  const [selectedPropertyFilter, setSelectedPropertyFilter] = useState<string>("ALL");

  // Interest Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalRoom, setActiveModalRoom] = useState<{ id?: number; name?: string; propertyName?: string }>();

  // Fetch properties and rooms, then group rooms by apartment/property
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [rawProps, rawRooms] = await Promise.all([
          publicApi.getProperties(),
          publicApi.getRooms(),
        ]);

        const propsList: BackendProperty[] = rawProps || [];
        const roomsList: BackendRoom[] = rawRooms || [];

        // Build property map
        const groupsMap = new Map<string, PropertyGroup>();

        // 1. Add known properties from backend
        propsList.forEach((p) => {
          groupsMap.set(p.name, {
            ...p,
            rooms: [],
          });
        });

        // 2. Group rooms into their respective property
        roomsList.forEach((room) => {
          const locName = room.location || "Other Properties";
          if (!groupsMap.has(locName)) {
            groupsMap.set(locName, {
              name: locName,
              roomCount: 1,
              minPrice: room.price || 0,
              maxPrice: room.price || 0,
              imageUrl: room.images?.[0] || null,
              allImages: room.images || [],
              amenities: room.amenities || [],
              roomTypes: room.type ? [room.type] : [],
              rooms: [room],
            });
          } else {
            const group = groupsMap.get(locName)!;
            group.rooms.push(room);
          }
        });

        setPropertyGroupGroups(Array.from(groupsMap.values()));
      } catch (err) {
        console.error("Failed to fetch public properties/rooms:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Header scroll observer
  useEffect(() => {
    const handleScroll = () => setHeaderSolid(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOpenInterestModal = (room: BackendRoom) => {
    setActiveModalRoom({
      id: room.id,
      name: room.name,
      propertyName: room.location,
    });
    setIsModalOpen(true);
  };

  // Filter logic across groups
  const filteredGroups = propertyGroups
    .map((group) => {
      // Filter property by selected dropdown if any
      if (selectedPropertyFilter !== "ALL" && group.name !== selectedPropertyFilter) {
        return null;
      }

      // Filter rooms in this group by availability
      const matchedRooms = group.rooms.filter((r) => {
        if (filter === "available") return r.available;
        if (filter === "occupied") return !r.available;
        return true;
      });

      if (matchedRooms.length === 0 && filter !== "all") {
        return null;
      }

      return {
        ...group,
        rooms: matchedRooms,
      };
    })
    .filter(Boolean) as PropertyGroup[];

  const totalRoomsCount = propertyGroups.reduce((acc, g) => acc + g.rooms.length, 0);
  const totalAvailableRoomsCount = propertyGroups.reduce(
    (acc, g) => acc + g.rooms.filter((r) => r.available).length,
    0
  );

  return (
    <div
      id="top"
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#0a0a0a",
        color: "#f4efe6",
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: "15.5px",
        lineHeight: 1.55,
      }}
    >
      {/* ═════════════════════════════════════════════════════════════════════
          SECTION 1 — STICKY HEADER
          ═════════════════════════════════════════════════════════════════ */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: headerSolid ? "rgba(10,10,10,0.92)" : "rgba(10,10,10,0.25)",
          borderBottom: "1px solid rgba(244,239,230,0.08)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          transition: "background 0.3s",
        }}
      >
        <div
          style={{
            maxWidth: 1380,
            margin: "0 auto",
            padding: "12px clamp(16px, 4vw, 26px)",
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          {/* Logo */}
          <a
            href="#top"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "#f4efe6",
              flex: "none",
            }}
          >
            <Logo size="md" height="3.2rem" color="#10b981" />
          </a>

          {/* Nav links */}
          <nav className="hidden md:flex" style={{ gap: 4, flex: "none" }}>
            {[
              { label: "Apartments", href: "#apartments" },
              { label: "About", href: "#why" },
              { label: "How it works", href: "#how" },
              { label: "FAQ", href: "#faq" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:bg-white/10 transition-colors"
                style={{
                  textDecoration: "none",
                  color: "rgba(244,239,230,0.75)",
                  fontWeight: 600,
                  fontSize: "13.5px",
                  padding: "7px 12px",
                  borderRadius: 999,
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex-1 hidden md:block" />

          {/* Auth buttons */}
          <div className="flex items-center gap-2.5 flex-none ml-auto md:ml-0">
            <button
              onClick={() => navigate("/tenant/login")}
              className="hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-emerald-500/20"
              style={{
                border: "none",
                background: "#10b981",
                color: "#fff",
                borderRadius: 999,
                padding: "9px 18px",
                fontWeight: 700,
                fontSize: "13.5px",
              }}
            >
              Tenant Login
            </button>
            <button
              onClick={() => navigate("/admin/login")}
              className="hover:bg-white/10 transition-colors cursor-pointer"
              style={{
                border: "1px solid rgba(244,239,230,0.3)",
                background: "rgba(244,239,230,0.08)",
                color: "#f4efe6",
                borderRadius: 999,
                padding: "8px 16px",
                fontWeight: 600,
                fontSize: "13px",
              }}
            >
              Admin
            </button>
          </div>
        </div>
      </header>

      {/* ═════════════════════════════════════════════════════════════════════
          SECTION 2 — HERO (Full Viewport, Video Background)
          ═════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          overflow: "hidden",
          background: "#0a0a0a",
          color: "#f4efe6",
        }}
      >
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            src={VIDEO_URL}
          />
        </div>

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "linear-gradient(180deg, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0.3) 38%, rgba(10,10,10,0.5) 62%, rgba(10,10,10,0.95) 100%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1380,
            width: "100%",
            margin: "0 auto",
            padding: "140px clamp(16px, 4vw, 26px) 46px",
          }}
        >
          <div
            className="neo-anim-fade"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
              animationDelay: "0.2s",
            }}
          >
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 0 4px rgba(16,185,129,0.25)",
              }}
            />
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "11.5px",
                letterSpacing: ".14em",
                color: "rgba(244,239,230,0.85)",
              }}
            >
              NEOSCAPE · PROPERTY MANAGEMENT SYSTEM
            </span>
          </div>

          <h1
            style={{
              margin: "0 0 26px",
              fontSize: "clamp(48px, 8.2vw, 118px)",
              fontWeight: 700,
              letterSpacing: "-0.035em",
              lineHeight: 0.98,
              maxWidth: "14ch",
            }}
          >
            <span style={{ display: "block", overflow: "hidden", paddingBottom: ".14em", marginBottom: "-.14em" }}>
              <span className="neo-anim-up" style={{ animationDelay: "0.15s" }}>
                Your next home,
              </span>
            </span>
            <span style={{ display: "block", overflow: "hidden", paddingBottom: ".14em", marginBottom: "-.14em" }}>
              <span className="neo-anim-up" style={{ animationDelay: "0.3s" }}>
                <em
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontStyle: "normal",
                    fontWeight: 500,
                    color: "#10b981",
                  }}
                >
                  starts here.
                </em>
              </span>
            </span>
          </h1>

          <div
            className="neo-anim-fade"
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 26,
              flexWrap: "wrap",
              animationDelay: "0.55s",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "clamp(16px, 1.6vw, 20px)",
                lineHeight: 1.55,
                maxWidth: "46ch",
                color: "rgba(244,239,230,0.9)",
              }}
            >
              Explore verified apartments and rooms with transparent pricing. Digital
              agreements, automated rent tracking, and hassle-free living.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <a
                href="#apartments"
                className="hover:opacity-90 transition-opacity"
                style={{
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                  background: "#10b981",
                  color: "#fff",
                  borderRadius: 999,
                  padding: "17px 30px",
                  fontWeight: 700,
                  fontSize: "16.5px",
                  boxShadow: "0 10px 30px rgba(16,185,129,0.35)",
                }}
              >
                Browse Apartments
              </a>
              <button
                onClick={() => navigate("/tenant/login")}
                className="hover:bg-white/15 transition-colors cursor-pointer"
                style={{
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                  background: "rgba(244,239,230,0.12)",
                  border: "1px solid rgba(244,239,230,0.4)",
                  color: "#f4efe6",
                  borderRadius: 999,
                  padding: "16px 30px",
                  fontWeight: 700,
                  fontSize: "16.5px",
                  backdropFilter: "blur(6px)",
                }}
              >
                Tenant Portal
              </button>
            </div>
          </div>

          <div
            className="neo-anim-fade"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 26,
              flexWrap: "wrap",
              borderTop: "1px solid rgba(244,239,230,0.15)",
              marginTop: 38,
              paddingTop: 20,
              animationDelay: "0.75s",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 600,
                  fontSize: 24,
                  letterSpacing: "-0.02em",
                }}
              >
                {propertyGroups.length || "—"}
              </span>
              <span style={{ color: "rgba(244,239,230,0.45)", fontSize: 13 }}>
                apartments
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 600,
                  fontSize: 24,
                  letterSpacing: "-0.02em",
                }}
              >
                {totalRoomsCount || "—"}
              </span>
              <span style={{ color: "rgba(244,239,230,0.45)", fontSize: 13 }}>
                rooms total
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 600,
                  fontSize: 24,
                  letterSpacing: "-0.02em",
                }}
              >
                24/7
              </span>
              <span style={{ color: "rgba(244,239,230,0.45)", fontSize: 13 }}>
                tenant support
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          SECTION 3 — WHY NEOSCAPE (Scroll-Reveal)
          ═════════════════════════════════════════════════════════════════ */}
      <section
        id="why"
        style={{
          maxWidth: 1380,
          margin: "0 auto",
          padding: "130px clamp(16px, 4vw, 26px) 110px",
        }}
      >
        <div
          className="grid gap-8"
          style={{ gridTemplateColumns: "minmax(120px, 220px) 1fr" }}
        >
          <div
            className="hidden md:block"
            style={{
              position: "sticky",
              top: 110,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "11.5px",
              letterSpacing: ".14em",
              color: "rgba(244,239,230,0.3)",
              paddingTop: 10,
            }}
          >
            WHY NEOSCAPE
            <br />
            <span
              aria-hidden="true"
              style={{
                display: "inline-block",
                width: 44,
                height: 2,
                background: "#10b981",
                marginTop: 10,
              }}
            />
          </div>

          <RevealText text={WHY_TEXT} />
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          SECTION 4 — ACTION ROWS
          ═════════════════════════════════════════════════════════════════ */}
      <section id="how" style={{ background: "#080808", color: "#f4efe6" }}>
        <div
          style={{
            maxWidth: 1380,
            margin: "0 auto",
            padding: "96px clamp(16px, 4vw, 26px) 40px",
          }}
        >
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "11.5px",
              letterSpacing: ".14em",
              color: "rgba(244,239,230,0.35)",
              marginBottom: 26,
            }}
          >
            HOW IT WORKS
          </div>

          <a href="#apartments" className="neo-action-row">
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "12.5px",
                color: "rgba(244,239,230,0.3)",
                flex: "none",
                minWidth: 28,
              }}
            >
              01
            </span>
            <span className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3 flex-1">
              <span
                style={{
                  fontSize: "clamp(36px, 5vw, 72px)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                }}
              >
                Browse
              </span>
              <em
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(16px, 2vw, 24px)",
                  color: "rgba(244,239,230,0.5)",
                }}
              >
                apartments & rooms
              </em>
            </span>
            <span className="hidden md:flex items-center gap-3 text-white/45 text-sm flex-none max-w-[300px]">
              <span>Grouped by apartment location with real photos and prices.</span>
              <span className="neo-action-arrow text-lg">→</span>
            </span>
          </a>

          <div className="neo-action-row" onClick={() => navigate("/tenant/signup")}>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "12.5px",
                color: "rgba(244,239,230,0.3)",
                flex: "none",
                minWidth: 28,
              }}
            >
              02
            </span>
            <span className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3 flex-1">
              <span
                style={{
                  fontSize: "clamp(36px, 5vw, 72px)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                }}
              >
                Apply
              </span>
              <em
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(16px, 2vw, 24px)",
                  color: "rgba(244,239,230,0.5)",
                }}
              >
                in minutes
              </em>
            </span>
            <span className="hidden md:flex items-center gap-3 text-white/45 text-sm flex-none max-w-[300px]">
              <span>Digital applications, document submission, fast approvals.</span>
              <span className="neo-action-arrow text-lg">→</span>
            </span>
          </div>

          <div className="neo-action-row" onClick={() => navigate("/tenant/login")}>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "12.5px",
                color: "rgba(244,239,230,0.3)",
                flex: "none",
                minWidth: 28,
              }}
            >
              03
            </span>
            <span className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3 flex-1">
              <span
                style={{
                  fontSize: "clamp(36px, 5vw, 72px)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                }}
              >
                Move In
              </span>
              <em
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(16px, 2vw, 24px)",
                  color: "rgba(244,239,230,0.5)",
                }}
              >
                hassle-free
              </em>
            </span>
            <span className="hidden md:flex items-center gap-3 text-white/45 text-sm flex-none max-w-[300px]">
              <span>Digital agreements, inventory checklists, and support.</span>
              <span className="neo-action-arrow text-lg">→</span>
            </span>
          </div>
        </div>

        <div
          aria-hidden="true"
          style={{
            overflow: "hidden",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "16px 0",
            whiteSpace: "nowrap",
          }}
        >
          <div className="neo-marquee">
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "12.5px",
                letterSpacing: ".18em",
                color: "rgba(244,239,230,0.25)",
              }}
            >
              {MARQUEE_TEXT}
              {MARQUEE_TEXT}
            </span>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          SECTION 5 — APARTMENT-FIRST ROOMS LISTING
          ═════════════════════════════════════════════════════════════════ */}
      <section
        id="apartments"
        style={{
          maxWidth: 1380,
          margin: "0 auto",
          padding: "96px clamp(16px, 4vw, 26px) 80px",
          width: "100%",
        }}
      >
        <div style={{ marginBottom: 8 }}>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "11.5px",
              letterSpacing: ".14em",
              color: "rgba(244,239,230,0.3)",
              marginBottom: 14,
            }}
          >
            OUR PORTFOLIO
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(30px, 4.4vw, 54px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            Apartments &{" "}
            <em
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "normal",
                fontWeight: 500,
              }}
            >
              Rooms
            </em>
          </h2>
        </div>

        <p
          style={{
            margin: "0 0 26px",
            color: "rgba(244,239,230,0.55)",
            maxWidth: "56ch",
          }}
        >
          Select an apartment to explore its available rooms and amenities.{" "}
          <span style={{ color: "rgba(244,239,230,0.35)" }}>
            {totalAvailableRoomsCount} of {totalRoomsCount} rooms available across {propertyGroups.length} properties.
          </span>
        </p>

        {/* Filter Toolbar */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          {/* Availability Pills */}
          <div
            className="flex gap-1 rounded-full p-1"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {(["all", "available", "occupied"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="cursor-pointer transition-all duration-200"
                style={{
                  whiteSpace: "nowrap",
                  borderRadius: 999,
                  padding: "7px 16px",
                  fontSize: "13px",
                  fontWeight: 600,
                  border: "none",
                  background: filter === f ? "#10b981" : "transparent",
                  color: filter === f ? "#fff" : "rgba(244,239,230,0.45)",
                }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Property Dropdown Filter */}
          {propertyGroups.length > 1 && (
            <div className="relative">
              <select
                value={selectedPropertyFilter}
                onChange={(e) => setSelectedPropertyFilter(e.target.value)}
                className="appearance-none bg-white/5 border border-white/10 rounded-full px-4 py-2 pr-9 text-xs font-semibold text-white/80 cursor-pointer focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL" className="bg-neutral-900 text-white">All Apartments ({propertyGroups.length})</option>
                {propertyGroups.map((g) => (
                  <option key={g.name} value={g.name} className="bg-neutral-900 text-white">
                    {g.name} ({g.rooms.length} rooms)
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-white/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/40 space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400" />
            <p className="text-xs">Loading apartments and rooms…</p>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="text-center py-20 text-white/30 rounded-2xl border border-white/5 bg-white/[0.01]">
            No apartments or rooms match your filter.
          </div>
        ) : (
          /* Apartment Hierarchy Rendering */
          <div className="space-y-16">
            {filteredGroups.map((property) => (
              <div
                key={property.name}
                className="rounded-3xl border border-white/[0.08] bg-white/[0.015] p-6 md:p-8"
              >
                {/* Apartment Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
                  <div className="flex items-start gap-4">
                    {/* Apartment Image Thumbnail */}
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-white/5 flex-none relative">
                      {property.imageUrl ? (
                        <img
                          src={property.imageUrl}
                          alt={property.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20">
                          <Building2 className="w-8 h-8 stroke-[1.5]" />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <Home className="w-3 h-3" />
                          {property.rooms.length} Rooms
                        </span>
                        {property.roomTypes && property.roomTypes.length > 0 && (
                          <span className="text-[10px] uppercase font-semibold text-white/40">
                            {property.roomTypes.join(" • ")}
                          </span>
                        )}
                      </div>

                      <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                        {property.name}
                      </h3>

                      {property.minPrice > 0 && (
                        <p className="text-sm text-white/50 mt-1">
                          Starting from{" "}
                          <span className="font-semibold text-emerald-400">
                            £{property.minPrice.toLocaleString()}
                          </span>{" "}
                          / mo
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions for Apartment */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate(`/properties/${encodeURIComponent(property.name)}`)}
                      className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-all"
                    >
                      Apartment Details <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Rooms Grid inside Apartment */}
                <div className="mt-6">
                  <div className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-4">
                    Rooms inside {property.name} ({property.rooms.length})
                  </div>

                  {property.rooms.length === 0 ? (
                    <div className="text-sm text-white/30 py-6 italic">
                      No rooms currently listed under this criteria.
                    </div>
                  ) : (
                    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {property.rooms.map((room) => (
                        <RoomCard
                          key={room.id}
                          room={room}
                          propertyFallbackImage={property.imageUrl || property.allImages?.[0]}
                          onEnquire={handleOpenInterestModal}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          SECTION 6 — PLATFORM FEATURES
          ═════════════════════════════════════════════════════════════════ */}
      <section style={{ background: "#080808", color: "#f4efe6", padding: "96px 0" }}>
        <div style={{ maxWidth: 1380, margin: "0 auto", padding: "0 clamp(16px, 4vw, 26px)" }}>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "11.5px",
              letterSpacing: ".14em",
              color: "rgba(244,239,230,0.3)",
              marginBottom: 14,
            }}
          >
            PLATFORM FEATURES
          </div>
          <h2
            style={{
              margin: "0 0 50px",
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            Everything you need,{" "}
            <em
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "normal",
                fontWeight: 500,
                color: "#10b981",
              }}
            >
              built in.
            </em>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "📄",
                title: "Digital Agreements",
                desc: "AI-generated contracts from chat conversations. Review, annotate, and digitally sign — no paperwork.",
              },
              {
                icon: "💬",
                title: "Admin-Tenant Chat",
                desc: "Direct messaging with file sharing. Discuss terms, share documents, and keep everything in one thread.",
              },
              {
                icon: "📊",
                title: "Rent Tracking",
                desc: "Automated schedules, due date reminders, and full payment history. Never miss a payment again.",
              },
            ].map((feat) => (
              <div
                key={feat.title}
                className="group transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 18,
                  padding: "32px 28px",
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 20 }}>{feat.icon}</div>
                <h3 style={{ margin: "0 0 10px", fontSize: 20, fontWeight: 700 }}>
                  {feat.title}
                </h3>
                <p style={{ margin: 0, color: "rgba(244,239,230,0.5)", fontSize: "14.5px", lineHeight: 1.6 }}>
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          SECTION 7 — FAQ
          ═════════════════════════════════════════════════════════════════ */}
      <section
        id="faq"
        style={{
          maxWidth: 1380,
          margin: "0 auto",
          padding: "96px clamp(16px, 4vw, 26px) 80px",
        }}
      >
        <div className="grid md:grid-cols-[minmax(120px,300px)_1fr] gap-12">
          <div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "11.5px",
                letterSpacing: ".14em",
                color: "rgba(244,239,230,0.3)",
                marginBottom: 14,
              }}
            >
              FAQ
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(28px, 3.5vw, 44px)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Common{" "}
              <em
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontStyle: "normal",
                  fontWeight: 500,
                }}
              >
                questions
              </em>
            </h2>
          </div>

          <div>
            {FAQ_ITEMS.map((item, i) => (
              <details key={i} className="neo-faq-item">
                <summary>
                  {item.q}
                  <span className="neo-faq-chevron">+</span>
                </summary>
                <div className="neo-faq-answer">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          SECTION 8 — FOOTER
          ═════════════════════════════════════════════════════════════════ */}
      <footer
        style={{
          background: "#060606",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          color: "rgba(244,239,230,0.5)",
        }}
      >
        <div
          style={{
            maxWidth: 1380,
            margin: "0 auto",
            padding: "64px clamp(16px, 4vw, 26px) 32px",
          }}
        >
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                <Logo size="md" height="3rem" color="#10b981" />
              </div>
              <p style={{ fontSize: "13.5px", lineHeight: 1.6, maxWidth: "36ch" }}>
                A centralized property management ecosystem. Digital documents,
                automated rent tracking, and transparent tenant-admin communication.
              </p>
            </div>

            <div>
              <h4
                style={{
                  margin: "0 0 16px",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "11.5px",
                  letterSpacing: ".14em",
                  color: "rgba(244,239,230,0.3)",
                }}
              >
                QUICK LINKS
              </h4>
              <div className="flex flex-col gap-2.5">
                {[
                  { label: "Browse Apartments", href: "#apartments" },
                  { label: "Tenant Login", to: "/tenant/login" },
                  { label: "Admin Portal", to: "/admin/login" },
                  { label: "How It Works", href: "#how" },
                  { label: "FAQ", href: "#faq" },
                ].map((link) =>
                  link.href ? (
                    <a
                      key={link.label}
                      href={link.href}
                      className="hover:text-white transition-colors"
                      style={{ textDecoration: "none", color: "rgba(244,239,230,0.5)", fontSize: "14px" }}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <button
                      key={link.label}
                      onClick={() => navigate(link.to!)}
                      className="hover:text-white transition-colors cursor-pointer text-left"
                      style={{ background: "none", border: "none", padding: 0, color: "rgba(244,239,230,0.5)", fontSize: "14px" }}
                    >
                      {link.label}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <h4
                style={{
                  margin: "0 0 16px",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "11.5px",
                  letterSpacing: ".14em",
                  color: "rgba(244,239,230,0.3)",
                }}
              >
                GET IN TOUCH
              </h4>
              <p style={{ fontSize: "13.5px", lineHeight: 1.7 }}>
                For enquiries about available rooms or property management,
                reach out through the Tenant Portal or contact the admin directly.
              </p>
              <button
                onClick={() => navigate("/tenant/signup")}
                className="mt-4 hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-emerald-500/20"
                style={{
                  background: "#10b981",
                  color: "#fff",
                  border: "none",
                  borderRadius: 999,
                  padding: "10px 22px",
                  fontWeight: 700,
                  fontSize: "13px",
                }}
              >
                Create Account
              </button>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <span style={{ fontSize: "12.5px", color: "rgba(244,239,230,0.25)" }}>
              © {new Date().getFullYear()} NeoScape Properties. All rights reserved.
            </span>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "clamp(40px, 8vw, 90px)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: "rgba(244,239,230,0.04)",
                lineHeight: 1,
              }}
            >
              NEOSCAPE
            </span>
          </div>
        </div>
      </footer>

      {/* Interest Modal Integration */}
      <InterestFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        roomId={activeModalRoom?.id}
        roomName={activeModalRoom?.name}
        propertyName={activeModalRoom?.propertyName}
      />
    </div>
  );
}
