import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTicket } from "../context/TicketContext";
import { ALL_EVENTS } from "../data/eventImages";
import { ALL_VENUES } from "../data/venueData";
import EventCard from "../components/EventCard";
import VenueCard from "../components/VenueCard";
import { 
  Calendar, MapPin, Ticket, Sparkles, TrendingUp,
  Award, ChevronLeft, ChevronRight
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const { createBooking } = useTicket();

  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Selected events for Carousel (BTS, Coldplay, India vs Pakistan)
  const carouselEvents = useMemo(() => {
    return ALL_EVENTS.filter(e => 
      e.id === "concert-bts" || 
      e.id === "concert-coldplay" || 
      e.id === "cricket-indpak" ||
      e.id === "f1-british"
    );
  }, []);

  // Automatic slide rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % carouselEvents.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [carouselEvents.length]);

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % carouselEvents.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + carouselEvents.length) % carouselEvents.length);
  };

  // Group events by category
  const concerts = useMemo(() => ALL_EVENTS.filter(e => e.category === "Concerts"), []);
  const football = useMemo(() => ALL_EVENTS.filter(e => e.category === "Football"), []);
  const cricket = useMemo(() => ALL_EVENTS.filter(e => e.category === "Cricket"), []);
  const formula1 = useMemo(() => ALL_EVENTS.filter(e => e.category === "Formula 1"), []);

  const handleBookClick = (event) => {
    // Set selected event coords and details in context
    const venue = ALL_VENUES.find(v => v.name === event.venue) || ALL_VENUES[0];
    createBooking(event.title, venue.coordinates.lat, venue.coordinates.lng);
    navigate(`/booking?event=${event.id}`);
  };

  const scrollToEvents = () => {
    document.getElementById("events-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-[#FAF5EB] dark:bg-[#121212] selection:bg-[#D4AF37] selection:text-black overflow-x-hidden transition-colors duration-500">
      
      {/* ── HERO EVENT CAROUSEL ── */}
      <section className="relative h-screen min-h-[600px] w-full overflow-hidden bg-black text-white">
        <AnimatePresence mode="wait">
          {carouselEvents.map((event, idx) => {
            if (idx !== currentSlide) return null;
            const isBTS = event.id === "concert-bts";
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 w-full h-full"
              >
                {/* Backdrop Image */}
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-[0.4] scale-105"
                     style={{ backgroundImage: `url(${event.image})` }} />
                
                {/* Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/30" />
                
                {/* Flagship concert glow effects */}
                {isBTS && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 via-transparent to-pink-500/10 mix-blend-color-add pointer-events-none" />
                )}

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 z-10">
                    <div className="lg:col-span-8 space-y-6 md:space-y-8 text-left mt-24">
                      {/* Category Tag */}
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-[0.2em] transition-all ${
                          isBTS 
                            ? "bg-purple-950/60 border-purple-500/40 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.35)]" 
                            : "bg-[#D4AF37]/20 border-[#D4AF37]/40 text-[#D4AF37]"
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Featured {event.category}
                      </motion.div>

                      {/* Event Title */}
                      <motion.h1 
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={`text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none text-white drop-shadow-xl ${
                          isBTS ? "text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-300 drop-shadow-[0_4px_12px_rgba(168,85,247,0.25)]" : ""
                        }`}
                        style={{ fontFamily: "Playfair Display, serif" }}
                      >
                        {event.title}
                      </motion.h1>

                      {/* Venue, Date details */}
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-wrap items-center gap-6 text-sm font-bold text-white/80"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-[#D4AF37]" />
                          <span>{event.venue}, {event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-[#D4AF37]" />
                          <span>
                            {(() => {
                              const d = new Date(event.date);
                              if (isNaN(d.getTime())) return event.date;
                              return d.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                            })()}
                          </span>
                        </div>
                      </motion.div>

                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-white/60 text-sm md:text-base max-w-2xl font-medium leading-relaxed"
                      >
                        {event.description}
                      </motion.p>

                      {/* CTA Buttons */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-wrap gap-4 pt-4"
                      >
                        <button
                          onClick={() => handleBookClick(event)}
                          className="px-8 py-4 bg-[#D4AF37] hover:bg-[#AA8413] text-black font-black text-[11px] uppercase tracking-[0.2em] rounded-xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2.5"
                        >
                          <Ticket className="w-4 h-4" /> Book Tickets
                        </button>
                        <button
                          onClick={scrollToEvents}
                          className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-xl transition-all flex items-center gap-2"
                        >
                          Explore Events
                        </button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Carousel controls */}
        <div className="absolute bottom-10 right-8 md:right-16 z-20 flex items-center gap-4">
          <button 
            onClick={handlePrevSlide}
            className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 hover:bg-black/60 flex items-center justify-center text-white transition-all hover:scale-105"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-2">
            {carouselEvents.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentSlide ? "bg-[#D4AF37] w-8" : "bg-white/30"}`}
              />
            ))}
          </div>
          <button 
            onClick={handleNextSlide}
            className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 hover:bg-black/60 flex items-center justify-center text-white transition-all hover:scale-105"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="relative z-20 -mt-12 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { value: "100K+", label: "Tickets Sold", desc: "Across concert tours & stadium matches", icon: Ticket },
            { value: "20+", label: "Events", desc: "Live music & high-stakes tournaments", icon: Calendar },
            { value: "9", label: "Premium Venues", desc: "Global partner stadium locations", icon: MapPin }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="cream-card grain-el p-6 md:p-8 flex items-center gap-5 border border-black/5 dark:border-white/5 shadow-xl rounded-[28px] text-left"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 dark:bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
                  <Icon className="w-7 h-7 text-[#B8860B] dark:text-[#D4AF37]" />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-black text-ink leading-none tracking-tight font-serif" style={{ fontFamily: "Playfair Display, serif" }}>{stat.value}</p>
                  <p className="text-xs font-black uppercase text-ink tracking-widest">{stat.label}</p>
                  <p className="text-[10px] font-bold text-ink-muted leading-tight">{stat.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── TRENDING CONCERTS SECTION ── */}
      <section id="events-section" className="py-24 px-6 md:px-12 container mx-auto text-left">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 dark:bg-[#D4AF37]/20 border border-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.25em] w-fit">
              <TrendingUp className="w-3.5 h-3.5" /> High Demand Tours
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-ink tracking-tight" style={{ fontFamily: "Playfair Display, serif" }}>
              Trending <span className="italic font-light opacity-80 text-[#D4AF37]">Concerts.</span>
            </h2>
            <p className="text-sm font-medium text-ink-muted">
              Discover the biggest live music tours and stadium performances.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {concerts.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
            >
              <EventCard event={event} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FOOTBALL MATCHES ── */}
      <section className="py-16 px-6 md:px-12 container mx-auto text-left">
        <div className="border-t border-black/5 dark:border-white/5 pt-16 mb-12">
          <h3 className="text-3xl font-black text-ink mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
            Football Matches ⚽
          </h3>
          <p className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Witness the world's most intense football clashes live in stadium arenas</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {football.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
            >
              <EventCard event={event} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CRICKET MATCHES ── */}
      <section className="py-16 px-6 md:px-12 container mx-auto text-left">
        <div className="border-t border-black/5 dark:border-white/5 pt-16 mb-12">
          <h3 className="text-3xl font-black text-ink mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
            Cricket Matches 🏏
          </h3>
          <p className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Grand championship cricket clashes and historic tournament final matches</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cricket.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
            >
              <EventCard event={event} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FORMULA 1 GRAND PRIX ── */}
      <section className="py-16 px-6 md:px-12 container mx-auto text-left">
        <div className="border-t border-black/5 dark:border-white/5 pt-16 mb-12">
          <h3 className="text-3xl font-black text-ink mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
            Formula 1 Grand Prix 🏎️
          </h3>
          <p className="text-xs font-black uppercase tracking-widest text-[#ef4444]">High-speed championship racing action on the world's most iconic circuits</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {formula1.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
            >
              <EventCard event={event} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── POPULAR VENUES ── */}
      <section className="py-24 bg-[#EFE6D5] dark:bg-[#1C1C1C] transition-colors duration-500 text-left">
        <div className="px-6 md:px-12 container mx-auto">
          <div className="max-w-2xl space-y-4 mb-16">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-ink text-[10px] font-black uppercase tracking-[0.25em] w-fit">
              <Award className="w-3.5 h-3.5 text-[#D4AF37]" /> Global Arenas
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-ink tracking-tight" style={{ fontFamily: "Playfair Display, serif" }}>
              Premium <span className="italic font-light opacity-80 text-[#D4AF37]">Stadiums.</span>
            </h2>
            <p className="text-sm font-medium text-ink-muted">
              Secure seats in the world's most legendary stadiums, arenas, and cultural landmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {ALL_VENUES.map((venue, idx) => (
              <motion.div
                key={venue.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
              >
                <VenueCard venue={venue} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
}
