import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation, Phone, Hospital, Building2, Star, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTicket } from "../context/TicketContext";
import { ALL_VENUES } from "../data/venueData";
import { cn } from "../lib/utils";

// Fix Leaflet default icon path issues in React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Custom Icon for Venues (Capacity Badge)
const createVenueIcon = (capacity) => L.divIcon({
  className: "custom-price-badge",
  html: `
    <div style="
      background-color: white; 
      color: #1a1a1a; 
      padding: 5px 12px; 
      border-radius: 99px; 
      border: 1.5px solid rgba(212,175,55,0.3); 
      box-shadow: 0 4px 15px rgba(0,0,0,0.15); 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-weight: 900; 
      font-size: 11px; 
      white-space: nowrap; 
    ">
      Cap: ${capacity}
    </div>`,
  iconSize: [100, 30],
  iconAnchor: [50, 15],
});

// Custom Icon for Pinpoint
const createPinpointIcon = (accentColor) => L.divIcon({
  className: "custom-schedule-marker",
  html: `
    <div style="
      position: relative;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: ${accentColor || '#D4AF37'};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      "></div>
      <div style="
        position: relative;
        width: 10px;
        height: 10px;
        background-color: white;
        border-radius: 50%;
        z-index: 10;
      "></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 32],
});

const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
};

const InteractiveMap = ({
  center = { lat: 51.5560, lng: -0.2796 },
  schedule,
  venueName,
  embedded,
  variant = 'default',
  safetySpots = []
}) => {
  const navigate = useNavigate();
  const { eventThemePack } = useTicket();
  const theme = eventThemePack?.visuals || {};

  const createSafetyIcon = (type) => L.divIcon({
    className: "custom-safety-marker",
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 30px; height: 30px; background-color: ${type === 'Hospital' ? '#ef4444' : '#3b82f6'}; border-radius: 50%; opacity: 0.3; transform: scale(1.5);"></div>
        <div style="position: relative; width: 28px; height: 28px; rounded-full; display: flex; align-items: center; justify-content: center; border: 2px solid white; border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.2); background-color: ${type === 'Hospital' ? '#ef4444' : '#3b82f6'}; color: white; font-weight: 900; font-size: 11px;">
          ${type === 'Hospital' ? 'H' : 'P'}
        </div>
      </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  // Filter venues based on location matching
  const recommendations = useMemo(() => {
    if (!venueName) return ALL_VENUES;
    const destLower = venueName.toLowerCase();
    
    const matched = ALL_VENUES.filter(v => 
      v.name.toLowerCase().includes(destLower) || 
      destLower.includes(v.name.toLowerCase()) ||
      v.location.toLowerCase().includes(destLower) ||
      destLower.includes(v.location.toLowerCase())
    );

    return matched.length > 0 ? matched : ALL_VENUES;
  }, [venueName]);

  // Safe coordinates check
  const safeCenter = useMemo(() => {
    const lat = parseFloat(center?.lat);
    const lng = parseFloat(center?.lng);
    if (isFinite(lat) && isFinite(lng)) return { lat, lng };
    return { lat: 51.5560, lng: -0.2796 }; // Fallback to Wembley Stadium
  }, [center]);

  return (
    <div className={cn("h-full w-full relative group", variant === 'safety' && "brightness-90 contrast-125")}>
      <MapContainer
        center={safeCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
        zoomControl={false}
      >
        <ChangeView center={safeCenter} />
        
        {variant === 'safety' ? (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
        ) : (
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        )}

        {/* Safety Assets (Only in safety variant) */}
        {variant === 'safety' && (safetySpots || []).map(spot => (
          <Marker
            key={spot.id}
            position={[spot.lat, spot.lng]}
            icon={createSafetyIcon(spot.type)}
          >
            <Popup className="safety-popup">
              <div className="p-2 text-left">
                <h4 className="font-black text-sm text-black">{spot.name}</h4>
                <p className="text-[10px] uppercase font-bold text-gray-500">{spot.type}</p>
                <p className="text-xs text-gray-700 mt-1">{spot.phone}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Venue Recommendations (Hidden in Safety Mode) */}
        {variant !== 'safety' && (recommendations || []).map((venue) => {
          if (!venue) return null;
          const pos = [venue.coordinates.lat, venue.coordinates.lng];

          return (
            <Marker key={venue.id} position={pos} icon={createVenueIcon(venue.capacity)}>
              <Popup>
                <div className="w-[220px] overflow-hidden rounded-2xl bg-white shadow-2xl border border-black/5 text-left">
                  <div className="relative h-28 overflow-hidden">
                    <img src={venue.image} className="w-full h-full object-cover" alt="" />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-full text-white text-[8px] font-black uppercase tracking-widest">
                      Stadium
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <h4 className="font-black text-sm text-black leading-tight">{venue.name}</h4>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{venue.location}</p>
                    </div>
                    
                    <button
                      onClick={() => navigate(`/venue/${venue.id}`)}
                      className="w-full py-2.5 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-black/90 transition-all flex items-center justify-center gap-1.5"
                    >
                      View Stadium Detail
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Zoom Control indicator */}
      <div className="absolute top-6 right-6 z-[1000] flex flex-col gap-3">
        <div className="p-2 bg-white rounded-2xl shadow-2xl border border-black/5 flex flex-col gap-1 backdrop-blur-md bg-white/90">
          <span className="text-[9px] font-black uppercase text-center py-1 text-black">Map</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
