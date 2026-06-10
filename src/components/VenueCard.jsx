import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Users, Calendar } from "lucide-react";

const VenueCard = ({ venue }) => {
  if (!venue) return null;

  return (
    <div className="group flex flex-col h-full cream-card grain-el rounded-[32px] overflow-hidden">
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden m-3 rounded-[24px] shadow-inner flex-shrink-0">
        <img
          src={venue.image}
          alt={venue.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full text-white text-[9px] font-black uppercase tracking-widest z-10 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
          Cap: {venue.capacity}
        </div>
      </div>

      {/* Info Section */}
      <div className="p-6 pt-2 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-ink-muted">
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
            {venue.location}
          </div>
          <h4 className="font-black text-xl leading-tight text-ink group-hover:text-[#D4AF37] transition-colors" style={{ fontFamily: "Playfair Display, serif" }}>
            {venue.name}
          </h4>
          <p className="text-xs font-medium text-ink-muted line-clamp-2 leading-relaxed">
            {venue.description}
          </p>
        </div>

        <div className="pt-2 border-t border-black/5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
            <Calendar className="w-4 h-4" />
            {venue.upcomingEvents?.length || 0} Upcoming Events
          </div>
          
          <Link
            to={`/venue/${venue.id}`}
            className="btn-sage px-4 py-2 text-xs font-bold uppercase tracking-wider text-center"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
