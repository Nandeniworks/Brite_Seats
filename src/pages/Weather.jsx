import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTicket } from "../context/TicketContext";
import { 
  Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, CloudLightning, 
  Navigation, Eye, Gauge, Sunrise, Sunset, Sparkles, MapPin, Loader2,
  ChevronRight, Calendar, Zap, Waves
} from "lucide-react";
import { cn } from "../lib/utils";

const BACKGROUNDS = {
  clear: "https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=1600&fit=crop",
  cloudy: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1600&fit=crop",
  rain: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1600&fit=crop",
  storm: "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=1600&fit=crop",
  snow: "https://images.unsplash.com/photo-1478265409131-1f65c88f965c?w=1600&fit=crop",
  fog: "https://images.unsplash.com/photo-1487621167305-5d248087c724?w=1600&fit=crop",
};

const Weather = () => {
  const { venue, eventThemePack } = useTicket();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!venue?.lat || !venue?.lng) return;
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${venue.lat}&longitude=${venue.lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,uv_index,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum&timezone=auto`
        );
        const data = await response.json();
        setWeatherData(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to sync with atmospheric satellites.");
        setLoading(false);
      }
    };

    fetchWeather();
  }, [venue]);

  const getWeatherInfo = (code) => {
    if (code === 0) return { label: "Perfectly Clear", icon: Sun, color: "#f59e0b", bg: BACKGROUNDS.clear, vibe: "Golden" };
    if (code <= 3) return { label: "Soft Clouds", icon: Cloud, color: "#94a3b8", bg: BACKGROUNDS.cloudy, vibe: "Moody" };
    if (code <= 48) return { label: "Mystic Fog", icon: Eye, color: "#64748b", bg: BACKGROUNDS.fog, vibe: "Ethereal" };
    if (code <= 67) return { label: "Gentle Drizzle", icon: CloudRain, color: "#38bdf8", bg: BACKGROUNDS.rain, vibe: "Fresh" };
    if (code <= 82) return { label: "Heavy Rain", icon: CloudRain, color: "#0ea5e9", bg: BACKGROUNDS.rain, vibe: "Deep" };
    if (code <= 99) return { label: "Thunderstorm", icon: CloudLightning, color: "#7c3aed", bg: BACKGROUNDS.storm, vibe: "Tactical" };
    return { label: "Unknown", icon: Cloud, color: "#94a3b8", bg: BACKGROUNDS.cloudy, vibe: "Default" };
  };

  const current = weatherData?.current;
  const daily = weatherData?.daily;
  const info = current ? getWeatherInfo(current.weather_code) : null;
  const Icon = info?.icon || Sun;

  if (!venue) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
         <p className="text-white/40 font-black uppercase tracking-widest">No active venue selected.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
         <div className="text-center space-y-6">
            <Loader2 className="w-12 h-12 text-white animate-spin mx-auto" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 animate-pulse">Syncing Stadium Weather...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden selection:bg-white selection:text-black">
      
      {/* ── Immersive Environment Engine ── */}
      <div className="absolute inset-0 z-0">
         <AnimatePresence mode="wait">
            <motion.div 
               key={info?.bg}
               initial={{ opacity: 0, scale: 1.1 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 2, ease: "circOut" }}
               className="absolute inset-0"
            >
               <img src={info?.bg} className="w-full h-full object-cover brightness-[0.4] contrast-125" alt="" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />
               <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
            </motion.div>
         </AnimatePresence>

         {/* Atmospheric Effects */}
         {current?.weather_code > 90 && (
           <motion.div 
             animate={{ opacity: [0, 1, 0] }}
             transition={{ duration: 0.1, repeat: Infinity, repeatDelay: Math.random() * 5 }}
             className="absolute inset-0 bg-white/10 z-[1]" 
           />
         )}
      </div>

      {/* ── Main UI Overlay ── */}
      <div className="relative z-10 flex flex-col min-h-screen max-w-[1600px] mx-auto p-10">
         
         {/* Top Navigation / Header */}
         <div className="flex items-start justify-between">
            <div className="space-y-4">
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-[0.4em]">
                   <Zap className="w-3 h-3 text-amber-400" /> Venue Weather Scan Active
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-black shadow-2xl">
                      <MapPin className="w-6 h-6" />
                   </div>
                   <div>
                     <h2 className="text-4xl font-black tracking-tighter" style={{ fontFamily: "Playfair Display, serif" }}>{venue.name}</h2>
                     <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Stadium Coordinates: {venue.lat.toFixed(2)}°N, {venue.lng.toFixed(2)}°E</p>
                  </div>
                </div>
            </div>

            <div className="flex gap-4">
               {["Sat", "Radar", "Model"].map(btn => (
                 <button key={btn} className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">{btn}</button>
               ))}
            </div>
         </div>

         {/* Hero Section */}
         <div className="flex-1 flex flex-col justify-center max-w-4xl space-y-8">
            <motion.div 
               initial={{ x: -50, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ delay: 0.5 }}
               className="space-y-2"
            >
               <h1 className="text-8xl md:text-[10rem] font-black tracking-tighter leading-[0.8] mb-6" style={{ fontFamily: "Playfair Display, serif" }}>
                  {(info?.label || "Stadium Atmosphere").split(" ").map((w, i) => (
                    <span key={i} className={i === 0 ? "" : "italic font-light opacity-50"}> {w} </span>
                  ))}
               </h1>
               <p className="text-xl md:text-2xl font-medium text-white/60 max-w-2xl leading-relaxed">
                  Live conditions indicate a <span className="text-white">{info?.vibe || "unique"}</span> atmosphere. Perfect for the upcoming event at {venue.name}.
               </p>
            </motion.div>

            {/* Quick Daily Reel */}
            <div className="flex gap-8 overflow-x-auto no-scrollbar py-4">
               {daily?.time.map((t, i) => {
                 const dInfo = getWeatherInfo(daily.weather_code[i]);
                 const DIcon = dInfo.icon;
                 return (
                    <motion.div 
                      key={t}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="min-w-[140px] p-6 rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 text-center space-y-4 hover:bg-white/10 transition-all"
                    >
                       <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{new Date(t).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                       <div className="flex justify-center">
                          <DIcon className="w-8 h-8" style={{ color: dInfo.color }} />
                       </div>
                       <p className="text-2xl font-black">{Math.round(daily.temperature_2m_max[i])}°</p>
                    </motion.div>
                 );
               })}
            </div>
         </div>

         {/* Bottom Control Bar */}
         <div className="flex flex-col lg:flex-row items-end justify-between gap-10 pb-32">
            
            {/* Massive Stats Display */}
            <div className="flex items-end gap-12">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-2">Live Temperature</span>
                  <div className="flex items-start gap-4">
                     <span className="text-9xl font-black tracking-tighter leading-none">{Math.round(current?.temperature_2m)}°</span>
                     <div className="pt-4 space-y-2">
                        <div className="px-4 py-1.5 rounded-full bg-white text-black text-[10px] font-black">Celsius</div>
                        <p className="text-sm font-black text-white/40">Feels {Math.round(current?.apparent_temperature)}°</p>
                     </div>
                  </div>
               </div>

               <div className="h-24 w-px bg-white/10 hidden md:block" />

               <div className="hidden md:flex gap-12 pb-2">
                  {[
                    { icon: Wind, label: "Wind", val: `${current?.wind_speed_10m} km/h` },
                    { icon: Droplets, label: "Humidity", val: `${current?.relative_humidity_2m}%` },
                    { icon: Sun, label: "UV Index", val: current?.uv_index },
                    { icon: Gauge, label: "Pressure", val: `${current?.pressure_msl} hPa` }
                  ].map((stat, i) => (
                    <div key={i} className="space-y-1">
                       <p className="text-[9px] font-black uppercase tracking-widest text-white/20 flex items-center gap-2"><stat.icon className="w-3 h-3" /> {stat.label}</p>
                       <p className="text-xl font-black">{stat.val}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* Astral Intelligence Card */}
            <div className="p-8 rounded-[3rem] bg-white/10 backdrop-blur-2xl border border-white/20 min-w-[320px] flex items-center justify-between group">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-amber-500" />
                     <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Advisory Schedule</span>
                  </div>
                  <div>
                     <h4 className="text-2xl font-black">Sunset Advisory</h4>
                     <p className="text-3xl font-black text-amber-500">{new Date(daily?.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
               </div>
               <Sunset className="w-16 h-16 text-white/10 group-hover:text-amber-500/40 transition-colors" />
            </div>

         </div>

      </div>

      {/* Interactive Grain Effect */}
      <div className="fixed inset-0 z-[5] pointer-events-none opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

    </div>
  );
};

export default Weather;
