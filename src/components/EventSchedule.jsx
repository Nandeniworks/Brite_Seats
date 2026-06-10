import React, { useState } from "react";
import { useTicket } from "../context/TicketContext";
import { MapPin, Plus, Trash2, CalendarPlus, Clock, Sparkles, Navigation } from "lucide-react";
import { motion } from "framer-motion";

const EventSchedule = () => {
  const { schedule, addPlaceToDay, removePlaceFromDay, addDay, eventThemePack, regenerateSchedule } = useTicket();
  const [newPlaceInputs, setNewPlaceInputs] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

  const accent = eventThemePack?.visuals?.accent || "#7bbf78";

  const schemes = React.useMemo(() => [
    { bg: `${accent}15`, dot: accent, border: `${accent}40` },
    { bg: "rgba(255,255,255,0.4)", dot: accent, border: "rgba(255,255,255,0.6)" },
  ], [accent]);

  const handleInputChange = (dayId, value) =>
    setNewPlaceInputs((prev) => ({ ...prev, [dayId]: value }));

  const handleAddPlace = (dayId) => {
    const value = newPlaceInputs[dayId];
    if (value?.trim()) {
      addPlaceToDay(dayId, value);
      setNewPlaceInputs((prev) => ({ ...prev, [dayId]: "" }));
    }
  };

  const handleRegenerate = async () => {
    setIsGenerating(true);
    // Fake cinematic delay
    await new Promise(res => setTimeout(res, 1500));
    regenerateSchedule();
    setIsGenerating(false);
  };

  return (
    <div className="space-y-8 relative">
      {/* Background timeline line */}
      <div className="absolute left-8 top-24 bottom-0 w-1 rounded-full opacity-20" style={{ backgroundColor: accent, boxShadow: `0 0 20px ${accent}` }} />

      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-50">
            Cinematic AI Timeline
          </p>
          <h2 className="text-3xl font-black tracking-tight" style={{ color: "var(--ink)", fontFamily: "Playfair Display, serif" }}>
            Your Masterplan
          </h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-widest rounded-full text-white shadow-xl transition-all hover:scale-105 disabled:opacity-50"
            style={{ backgroundColor: "var(--ink)" }}
          >
            <Sparkles className={`h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`} style={{ color: accent }} />
            {isGenerating ? "Crafting..." : "Regenerate Plan"}
          </button>
          <button
            onClick={addDay}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-widest rounded-full border-2 transition-all hover:scale-105"
            style={{ borderColor: accent, color: "var(--ink)", backgroundColor: `${accent}10` }}
          >
            <CalendarPlus className="h-3 w-3" /> Add Day
          </button>
        </div>
      </div>

      <div className="space-y-12">
        {schedule.map((day, dayIndex) => {
          const s = schemes[dayIndex % 2];
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: dayIndex * 0.1 }}
              key={day.id}
              className="relative z-10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl transition-all hover:shadow-2xl"
              style={{
                backgroundColor: s.bg,
                border: `1.5px solid ${s.border}`,
                boxShadow: `0 10px 40px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.8)`
              }}
            >
              {/* Day header */}
              <div
                className="px-8 py-6 flex items-center justify-between bg-white/30"
                style={{ borderBottom: `1px solid ${s.border}` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: accent }}>
                    <span className="font-black text-sm">{day.dayNumber}</span>
                  </div>
                  <h3 className="text-2xl font-black tracking-tight" style={{ color: "var(--ink)", fontFamily: "Playfair Display, serif" }}>
                    {day.date}
                  </h3>
                </div>
                <span
                  className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm"
                  style={{ backgroundColor: "rgba(255,255,255,0.9)", color: "var(--ink)" }}
                >
                  {day.places.length} Stop{day.places.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Places */}
              <div className="px-8 py-6 space-y-6">
                {day.places.length === 0 ? (
                  <div className="text-center py-8 opacity-50">
                    <p className="text-3xl mb-2">📍</p>
                    <p className="text-xs font-black uppercase tracking-widest">Awaiting schedule additions</p>
                  </div>
                ) : (
                  <div className="relative space-y-5">
                    {day.places.map((place, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={place.id} 
                        className="relative group flex gap-4 items-start"
                      >
                        <div className="flex flex-col items-center mt-2">
                           <div
                              className="h-4 w-4 rounded-full ring-4 shadow-xl z-10 transition-transform group-hover:scale-125"
                              style={{ backgroundColor: accent, ringColor: "white", boxShadow: `0 0 10px ${accent}` }}
                           />
                           {idx !== day.places.length - 1 && (
                              <div className="w-0.5 h-full mt-2 rounded-full opacity-30" style={{ backgroundColor: accent }} />
                           )}
                        </div>
                        
                        <div className="flex-1 bg-white/60 backdrop-blur-md rounded-3xl p-4 flex gap-4 transition-all hover:bg-white/90 shadow-sm border border-white hover:shadow-xl group-hover:-translate-y-1">
                          {place.img && (
                            <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
                              <img src={place.img} alt={place.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                            </div>
                          )}
                          {!place.img && (
                             <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0 shadow-md">
                                <MapPin className="w-6 h-6 text-gray-300" />
                             </div>
                          )}
                          <div className="flex-1 min-w-0 py-1">
                            <div className="flex items-center justify-between gap-2 mb-1">
                               <h4 className="font-black text-lg truncate text-ink tracking-tight">
                                 {place.name}
                               </h4>
                               {place.category && (
                                  <span className="text-[10px] font-black uppercase tracking-widest bg-black/5 px-2 py-1 rounded-md whitespace-nowrap">
                                     {place.category}
                                  </span>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                              {place.time !== "TBD" && (
                                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-white shadow-sm rounded-full px-3 py-1 text-ink">
                                  <Clock className="h-3 w-3 opacity-50" /> {place.time}
                                </span>
                              )}
                              {place.durationBadge && (
                                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-white shadow-sm rounded-full px-3 py-1 text-ink">
                                  ⏱ {place.durationBadge}
                                </span>
                              )}
                              {place.note && (
                                <span className="text-[10px] font-bold text-ink/50 uppercase tracking-wider flex items-center gap-1">
                                   <Navigation className="w-3 h-3" /> {place.note}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => removePlaceFromDay(day.id, place.id)}
                            className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:scale-110 flex-shrink-0 self-center"
                            style={{ color: "#e55" }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Add place input */}
                <div className="flex gap-3 pt-4 ml-8">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-30" />
                    <input
                      placeholder="Add a custom stop..."
                      value={newPlaceInputs[day.id] || ""}
                      onChange={(e) => handleInputChange(day.id, e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddPlace(day.id)}
                      className="w-full h-12 pl-11 pr-4 text-sm font-bold bg-white/50 backdrop-blur-md border-2 border-white/60 rounded-2xl focus:outline-none focus:border-ink/20 transition-colors shadow-inner"
                    />
                  </div>
                  <button
                    onClick={() => handleAddPlace(day.id)}
                    className="h-12 w-12 flex items-center justify-center rounded-2xl text-white shadow-lg transition-transform hover:scale-105 flex-shrink-0"
                    style={{ backgroundColor: accent }}
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default EventSchedule;
