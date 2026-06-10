import React, { useMemo } from "react";
import { ALL_VENUES } from "../data/venueData";
import { Link } from "react-router-dom";
import { MapPin, Users, ChevronRight, Sparkles, Building2 } from "lucide-react";

export default function Venues() {
  return (
    <div className="relative min-h-screen bg-[#FAF5EB] dark:bg-[#0A0A0A] text-ink transition-colors duration-500 pb-24 text-left">
      {/* Background visual glowing gradients */}
      <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 py-32 max-w-6xl relative z-10 space-y-12">
        {/* Page Header */}
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37] dark:text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em] rounded-full w-fit">
            <Sparkles className="w-3.5 h-3.5" /> WORLD-CLASS ARENAS
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight" style={{ fontFamily: "Playfair Display, serif" }}>
            Premium Stadium Partners
          </h1>
          <p className="text-sm font-medium text-ink-muted leading-relaxed">
            From the legendary Wembley Arch to the world-record Narendra Modi arena, discover our elite stadium partners hosting the biggest sports and concert tours on Earth.
          </p>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ALL_VENUES.map((venue) => (
            <Link
              key={venue.id}
              to={`/venue/${venue.id}`}
              className="cream-card grain-el overflow-hidden rounded-[28px] border border-black/5 dark:border-white/5 flex flex-col h-full hover:scale-[1.02] transition-transform duration-500 group shadow-md"
              style={{
                borderColor: "var(--booking-border, rgba(212,175,55,0.1))"
              }}
            >
              {/* Photo Banner */}
              <div className="h-48 relative overflow-hidden mx-2.5 mt-2.5 rounded-[20px]">
                <img
                  src={venue.image}
                  alt={venue.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                
                {/* Location Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-1.5 text-white/90">
                  <MapPin className="h-4.5 w-4.5 text-[#D4AF37] shrink-0" />
                  <span className="text-xs font-black truncate drop-shadow-md">
                    {venue.location}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-black leading-tight text-ink font-serif" style={{ fontFamily: "Playfair Display, serif" }}>
                    {venue.name}
                  </h3>
                  <p className="text-xs font-medium text-ink-muted leading-relaxed line-clamp-3">
                    {venue.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                      <Users className="w-4.5 h-4.5 text-[#B8860B] dark:text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase text-ink-muted">Capacity</p>
                      <p className="text-xs font-black text-ink">{venue.capacity} Seats</p>
                    </div>
                  </div>

                  <span className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-black dark:bg-[#242424] text-white text-[10px] font-black uppercase tracking-wider group-hover:bg-[#B8860B] dark:group-hover:bg-[#D4AF37] group-hover:text-black transition-colors duration-300 shadow-sm">
                    View Arena <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
