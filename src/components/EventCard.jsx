import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, DollarSign, Heart, Tag } from "lucide-react";
import { useTicket } from "../context/TicketContext";
import { ALL_VENUES } from "../data/venueData";

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const { savedEvents, toggleSavedEvent, createBooking } = useTicket();

  if (!event) return null;

  const isSaved = savedEvents.some((f) => f.id === event.id);

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSavedEvent({
      id: event.id,
      name: event.title,
      image: event.image,
      date: event.date,
      venue: event.venue,
      location: event.location,
      category: event.category,
      ticketPrice: event.ticketPrice,
      saved: true
    });
  };

  return (
    <div
      className="cream-card grain-el overflow-hidden rounded-[24px] border transition-all duration-500 hover:scale-[1.02] flex flex-col h-full"
      style={{
        borderColor: "var(--booking-border, rgba(212,175,55,0.14))",
        boxShadow: "var(--booking-card-shadow, 0 8px 32px rgba(212,175,55,0.08))",
      }}
    >
      {/* Banner */}
      <div className="h-44 relative overflow-hidden mx-2 mt-2 rounded-[18px]">
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />
        
        {/* Category Tag */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-white text-[9px] font-black uppercase tracking-widest">
          <Tag className="w-3 h-3 text-[#D4AF37]" />
          {event.category}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleSave}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center border transition-all ${
            isSaved 
              ? "bg-[#D4AF37] border-[#D4AF37] text-black" 
              : "bg-black/30 border-white/20 text-white hover:bg-white hover:text-black"
          }`}
        >
          <Heart className={`h-4.5 w-4.5 ${isSaved ? "fill-current" : ""}`} />
        </button>
        
        {/* Venue & Location bottom left overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-white/90 drop-shadow-md">
          <MapPin className="h-4 w-4 text-[#D4AF37] shrink-0" />
          <span className="text-xs font-bold truncate">
            {event.venue}, {event.location.split(",")[0]}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
            <Calendar className="h-3.5 w-3.5" />
            {(() => {
              const d = new Date(event.date);
              if (isNaN(d.getTime())) return event.date;
              return d.toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              });
            })()}
          </div>
          <h3 className="text-lg font-black leading-tight text-ink line-clamp-2" style={{ fontFamily: "Playfair Display, serif" }}>
            {event.title}
          </h3>
          <p className="text-xs font-medium text-ink-muted line-clamp-3">
            {event.description}
          </p>
        </div>

        <div className="pt-2 border-t border-black/5 flex items-center justify-between">
          <div>
            <p className="text-[8px] font-black uppercase tracking-widest text-ink-muted">Tickets From</p>
            <p className="text-lg font-black text-ink">
              ₹{event.ticketPrice.toLocaleString()}
            </p>
          </div>
          
          <button
            onClick={() => {
              const venue = ALL_VENUES.find((v) => v.name === event.venue) || ALL_VENUES[0];
              createBooking(event.title, venue.coordinates.lat, venue.coordinates.lng);
              navigate(`/booking?event=${event.id}`);
            }}
            className="btn-sage px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
