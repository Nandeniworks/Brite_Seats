import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ALL_VENUES } from "../data/venueData";
import { ALL_EVENTS } from "../data/eventImages";
import EventCard from "../components/EventCard";
import { ArrowLeft, Users, MapPin, Info, Calendar, Sparkles, Image as ImageIcon } from "lucide-react";

export default function VenueDetail() {
  const { id } = useParams();

  const venue = useMemo(() => {
    return ALL_VENUES.find(v => v.id === id) || ALL_VENUES[0];
  }, [id]);

  const upcomingEvents = useMemo(() => {
    if (!venue) return [];
    return ALL_EVENTS.filter(e => e.venue.toLowerCase() === venue.name.toLowerCase());
  }, [venue]);

  const isF1Venue = useMemo(() => {
    if (!venue) return false;
    return upcomingEvents.some(e => e.category === "Formula 1") || ["silverstone", "spa", "monza", "marinabay", "yasmarina"].includes(venue.id);
  }, [venue, upcomingEvents]);

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF5EB] dark:bg-[#121212]">
        <div className="text-center space-y-4">
          <p className="text-lg font-bold text-ink-muted">Venue not found.</p>
          <Link to="/" className="btn-sage px-6 py-3">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#FAF5EB] dark:bg-[#121212] transition-colors duration-500 pb-24">
      {/* ── CINEMATIC HERO SECTION ── */}
      <section className="relative h-[55vh] min-h-[400px] w-full overflow-hidden text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-[0.5] scale-105"
          style={{ backgroundImage: `url(${venue.image})` }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF5EB] dark:from-[#121212] via-transparent to-black/40 z-10" />

        {/* Floating Back Button */}
        <div className="absolute top-24 left-8 z-20">
          <Link 
            to="/" 
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/45 hover:bg-black/60 backdrop-blur-md border border-white/10 text-white font-bold text-xs transition-all hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        {/* Title overlay */}
        <div className="absolute inset-0 flex items-end z-20 pb-12">
          <div className="container mx-auto px-6 md:px-12 text-left">
            <div className="flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em] rounded-full w-fit mb-4">
              <Sparkles className="w-3.5 h-3.5" /> STADIUM PARTNER
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-ink" style={{ fontFamily: "Playfair Display, serif" }}>
              {venue.name}
            </h1>
          </div>
        </div>
      </section>

      {/* ── CORE STADIUM CONTENT ── */}
      <div className="container mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Details & Gallery */}
        <div className="lg:col-span-8 space-y-12 text-left">
          
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="cream-card grain-el p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-ink-muted">Total Capacity</p>
                <p className="text-xl font-black text-ink mt-0.5">{venue.capacity} Seats</p>
              </div>
            </div>

            <div className="cream-card grain-el p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-ink-muted">Location</p>
                <p className="text-xl font-black text-ink mt-0.5">{venue.location.split(",")[0]}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="cream-card grain-el p-8 space-y-4">
            <h3 className="text-2xl font-black text-ink flex items-center gap-2" style={{ fontFamily: "Playfair Display, serif" }}>
              <Info className="w-6 h-6 text-[#D4AF37]" /> {isF1Venue ? "Circuit Profile" : "Stadium Profile"}
            </h3>
            <p className="text-sm font-medium text-ink-muted leading-relaxed">
              {venue.description}
            </p>
          </div>

          {/* F1 Circuit Profile / Schedule Details */}
          {isF1Venue && (
            <div className="cream-card grain-el p-8 space-y-6 border-red-500/25 bg-neutral-950/80 text-white shadow-[0_0_30px_rgba(239,68,68,0.1)] rounded-[24px]">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                <span className="w-2.5 h-6 bg-[#ef4444] rounded-sm" />
                <h3 className="text-lg font-black uppercase tracking-wider text-white" style={{ fontFamily: "Playfair Display, serif" }}>
                  Grand Prix Weekend Details & Schedule
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div>
                  <p className="font-black text-[#ef4444] uppercase tracking-wider text-[9px] mb-1">Circuit Capacity</p>
                  <p className="font-bold text-white/95">{venue.capacity} Spectators</p>
                </div>
                <div>
                  <p className="font-black text-[#ef4444] uppercase tracking-wider text-[9px] mb-1">Grandstand Selection</p>
                  <p className="font-medium text-white/80 leading-relaxed">
                    Official race ticketing permits grandstand access including: Main Grandstand, Turn 1, Pit Lane, Champions Club, and the elite Formula 1 Paddock Club hospitality.
                  </p>
                </div>
              </div>
              
              {upcomingEvents.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <p className="font-black text-[#ef4444] uppercase tracking-wider text-[9px]">Event Race Weekend Schedule</p>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-1">
                      <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-wider">Friday — Free Practice</p>
                      <p className="text-[11px] font-medium text-white/85">Practice 1 & Practice 2 sessions. Direct track action and setup optimization.</p>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-1">
                      <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-wider">Saturday — Qualifying</p>
                      <p className="text-[11px] font-medium text-white/85">Free Practice 3 followed by Official Knockout Qualifying to determine the Sunday race starting grid.</p>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-1">
                      <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-wider">Sunday — Main Grand Prix</p>
                      <p className="text-[11px] font-medium text-white/85">The main race event. Drivers fight for points and podium glory over full race distance.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Highlights & Features */}
          {venue.highlights && venue.highlights.length > 0 && (
            <div className="cream-card grain-el p-8 space-y-4">
              <h3 className="text-2xl font-black text-ink flex items-center gap-2" style={{ fontFamily: "Playfair Display, serif" }}>
                <Sparkles className="w-6 h-6 text-[#D4AF37]" /> Venue Highlights & Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {venue.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-black/5 dark:bg-white/5 px-4 py-3 rounded-2xl border border-black/5 dark:border-white/5">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#D4AF37]" />
                    <span className="text-xs font-bold text-ink">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image Gallery */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-ink flex items-center gap-2 px-2" style={{ fontFamily: "Playfair Display, serif" }}>
              <ImageIcon className="w-6 h-6 text-[#D4AF37]" /> Photo Gallery
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {venue.gallery.map((imgUrl, index) => (
                <div 
                  key={index}
                  className="cream-card grain-el overflow-hidden rounded-[24px] aspect-[4/3] group relative shadow-md"
                >
                  <img 
                    src={imgUrl} 
                    alt={`${venue.name} Gallery ${index + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Upcoming Events */}
        <div className="lg:col-span-4 text-left">
          <div className="sticky top-24 space-y-6">
            <div className="flex items-center gap-2.5 px-2">
              <Calendar className="w-5.5 h-5.5 text-[#D4AF37]" />
              <h3 className="text-2xl font-black text-ink" style={{ fontFamily: "Playfair Display, serif" }}>
                Upcoming Events
              </h3>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="cream-card grain-el p-8 text-center text-ink-muted text-sm font-bold bg-white/20 dark:bg-white/5">
                No events currently scheduled at {venue.name}.
              </div>
            ) : (
              <div className="space-y-6">
                {upcomingEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
