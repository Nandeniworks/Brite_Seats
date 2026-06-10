import { useState, useMemo } from "react";
import { Navigate, Link } from "react-router-dom";
import { useTicket } from "../context/TicketContext";
import { useTheme } from "../context/ThemeContext";
import { Mail, Calendar, MapPin, Bookmark, Crown, Ticket } from "lucide-react";
import { cn } from "../lib/utils";

const Profile = () => {
  const currentUser = JSON.parse(localStorage.getItem("briteseats-current-user") || "null");
  const { savedEvents, bookings } = useTicket(); 
  const { isDark, toggle } = useTheme();

  const allTickets = useMemo(() => (bookings || []).flatMap(b => b.tickets || []), [bookings]);
  
  const hasTickets = allTickets.length > 0;
  
  const concertCount = useMemo(() => {
    return hasTickets 
      ? allTickets.filter(t => t.eventId && t.eventId.startsWith("concert-")).reduce((acc, t) => acc + (t.quantity || 1), 0)
      : 4; // demonstration fallback
  }, [allTickets, hasTickets]);
  
  const footballCount = useMemo(() => {
    return hasTickets 
      ? allTickets.filter(t => t.eventId && t.eventId.startsWith("football-")).reduce((acc, t) => acc + (t.quantity || 1), 0)
      : 2; // demonstration fallback
  }, [allTickets, hasTickets]);

  const cricketCount = useMemo(() => {
    return hasTickets 
      ? allTickets.filter(t => t.eventId && t.eventId.startsWith("cricket-")).reduce((acc, t) => acc + (t.quantity || 1), 0)
      : 1; // demonstration fallback
  }, [allTickets, hasTickets]);

  const f1Count = useMemo(() => {
    return hasTickets 
      ? allTickets.filter(t => t.eventId && t.eventId.startsWith("f1-")).reduce((acc, t) => acc + (t.quantity || 1), 0)
      : 0; // demonstration fallback
  }, [allTickets, hasTickets]);

  const totalTickets = concertCount + footballCount + cricketCount + f1Count;

  const collectionLevel = useMemo(() => {
    if (totalTickets >= 8) return "Gold Collector";
    if (totalTickets >= 3) return "Silver Collector";
    return "Bronze Collector";
  }, [totalTickets]);

  const progressPercentage = useMemo(() => {
    const cap = 10;
    return Math.min(100, Math.round((totalTickets / cap) * 100));
  }, [totalTickets]);

  const savedCount = useMemo(() => (savedEvents || []).filter(item => item.saved).length, [savedEvents]);
  const purchasedCount = useMemo(() => (bookings || []).filter(b => b.tickets && b.tickets.length > 0).length, [bookings]);

  if (!currentUser) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF5EB] dark:bg-[#121212] transition-colors duration-500 pb-24">
      <main className="flex-1 container mx-auto px-4 py-32 max-w-4xl">
        
        {/* Header / Account Details */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8 p-8 md:p-10 rounded-[32px] bg-white dark:bg-[#1C1C1C] border border-black/5 dark:border-white/5 shadow-xl">
            <div className="w-28 h-28 rounded-[24px] bg-black text-[#D4AF37] flex items-center justify-center text-4xl font-black grain-el shadow-lg">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-ink" style={{ fontFamily: "Playfair Display, serif" }}>
                  {currentUser.name}
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-1 opacity-60 text-ink-muted">
                  <Mail className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-sm font-bold">{currentUser.email}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <div className="px-4 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 text-ink-muted text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" /> Joined May 2026
                </div>
                <div className="px-4 py-1.5 rounded-xl bg-[#D4AF37]/10 dark:bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-black uppercase tracking-widest flex items-center gap-2 border border-[#D4AF37]/20">
                  <Crown className="w-3.5 h-3.5" /> BriteSeats Elite
                </div>
                <Link 
                  to="/pricing"
                  className="px-4 py-1.5 rounded-xl bg-black dark:bg-[#242424] text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                  Manage Plan
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-[#1C1C1C] border border-black/5 dark:border-white/5 rounded-3xl p-6 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center">
              <Bookmark className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-ink-muted">Saved Events</p>
              <p className="text-2xl font-black text-ink mt-0.5">{savedCount} Bookmarks</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1C1C1C] border border-black/5 dark:border-white/5 rounded-3xl p-6 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center">
              <Ticket className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-ink-muted">Tickets Purchased</p>
              <p className="text-2xl font-black text-ink mt-0.5">{purchasedCount} Booked</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1C1C1C] border border-black/5 dark:border-white/5 rounded-3xl p-6 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center">
              <Crown className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-ink-muted">Theme Preference</p>
              <button 
                onClick={toggle}
                className="px-3 py-1 bg-black/5 dark:bg-white/5 rounded-xl text-xs font-bold text-ink hover:bg-black/10 mt-1 uppercase"
              >
                {isDark ? "Dark Mode" : "Light Mode"}
              </button>
            </div>
          </div>
        </section>

        {/* Collector's Showcase Card */}
        <section className="mb-12">
          <div className="bg-[#111111] border border-[#D4AF37]/35 p-8 rounded-[32px] shadow-2xl text-left hover:scale-[1.01] hover:border-[#D4AF37]/50 transition-all duration-300 relative overflow-hidden grain-el">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-8 relative z-10">
              <div className="space-y-6 flex-1">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#D4AF37]">
                    <Ticket className="w-5 h-5" />
                    <h3 className="text-xs font-black uppercase tracking-[0.25em] font-sans">Collector's Showcase</h3>
                  </div>
                  <p className="text-xs font-semibold text-white/50">Every event ticket becomes part of your personal collection.</p>
                </div>
                
                 {/* Counts */}
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10 pt-4">
                   <div className="flex items-center gap-2 text-white">
                     <span className="text-xl">🎵</span>
                     <div>
                       <p className="text-[9px] font-black uppercase tracking-wider text-[#D4AF37]/80">Concerts</p>
                       <p className="text-lg font-black">{concertCount}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-2 text-white">
                     <span className="text-xl">⚽</span>
                     <div>
                       <p className="text-[9px] font-black uppercase tracking-wider text-[#D4AF37]/80">Football</p>
                       <p className="text-lg font-black">{footballCount}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-2 text-white">
                     <span className="text-xl">🏏</span>
                     <div>
                       <p className="text-[9px] font-black uppercase tracking-wider text-[#D4AF37]/80">Cricket</p>
                       <p className="text-lg font-black">{cricketCount}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-2 text-white">
                     <span className="text-xl">🏎️</span>
                     <div>
                       <p className="text-[9px] font-black uppercase tracking-wider text-[#ef4444]">Formula 1</p>
                       <p className="text-lg font-black">{f1Count}</p>
                     </div>
                   </div>
                 </div>
              </div>
              
              {/* Showcase Level info card */}
              <div className="w-full md:w-72 bg-white/5 rounded-2xl p-5 border border-white/5 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#D4AF37]/85">Collection Level</p>
                  <p className="text-xl font-black text-white font-serif tracking-wide" style={{ fontFamily: "Playfair Display, serif" }}>
                    {collectionLevel}
                  </p>
                </div>
                
                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider text-white/45">
                    <span>Rare Ticket Collection Progress</span>
                    <span className="text-[#D4AF37] font-black">{progressPercentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#D4AF37] to-[#AA8413] rounded-full transition-all duration-500" 
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
                
                <Link 
                  to="/my-tickets"
                  className="w-full py-2.5 rounded-xl border border-[#D4AF37] text-center text-[10px] font-black uppercase tracking-widest text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300 block shadow-md"
                >
                  View Collection
                </Link>
              </div>
            </div>
          </div>
        </section>


        {/* Saved Events Cards Display */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-2 text-left">
            <Bookmark className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="text-2xl font-black text-ink" style={{ fontFamily: "Playfair Display, serif" }}>
              My Saved Events
            </h2>
          </div>

          {savedCount === 0 ? (
            <div className="p-16 rounded-[32px] border-2 border-dashed border-black/10 dark:border-white/10 text-center space-y-4 bg-white/20 dark:bg-white/5">
              <p className="text-sm font-bold text-ink-muted">No saved events bookmarks yet.</p>
              <Link 
                to="/"
                className="btn-sage px-6 py-3 text-xs font-black inline-block"
              >
                Explore Upcoming Events
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {(savedEvents || []).filter(item => item.saved).map((item) => (
                <div 
                  key={item.id} 
                  className="group relative p-6 rounded-[24px] bg-white dark:bg-[#1C1C1C] border border-black/5 dark:border-white/5 shadow-sm transition-all hover:scale-[1.01]"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-10 w-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 bg-black/5 dark:bg-white/5 rounded-full text-ink-muted">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-ink truncate mb-1">{item.name}</h3>
                  <p className="text-xs font-medium text-ink-muted mb-4">{item.venue} · {item.date}</p>
                  
                  <Link 
                    to={`/booking?event=${item.id}`}
                    className="btn-sage px-4 py-2 text-[10px] font-bold uppercase tracking-wider inline-block text-center"
                  >
                    Book Tickets
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Profile;
