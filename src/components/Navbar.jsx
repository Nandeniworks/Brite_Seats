import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Ticket, Armchair, LogOut, Settings, 
  User, ChevronDown, ShieldAlert, Crown, CalendarDays, Sun, Moon, 
  Music, Menu, X, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import { useTheme } from "../context/ThemeContext";
import { useTicket } from "../context/TicketContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggle } = useTheme();
  const { eventThemePack, activeBooking, bookings, activeBookingId, setActiveBookingId } = useTicket();
  
  const currentUser = (() => {
    try {
      const saved = localStorage.getItem("briteseats-current-user");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  })();

  const [activeLogoIndex, setActiveLogoIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveLogoIndex((prev) => (prev + 1) % 5);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const logoIcons = [
    {
      id: "ticket",
      component: <Ticket className="w-5 h-5 text-[#D4AF37]" />
    },
    {
      id: "music",
      component: <Music className="w-5 h-5 text-[#D4AF37]" />
    },
    {
      id: "football",
      component: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" fill="#0A0A0A" stroke="#D4AF37" />
          <polygon points="12 8 9.5 10.5 10.5 13.5 13.5 13.5 14.5 10.5" fill="#D4AF37" />
          <path d="M12 2v6M2 12h6M12 22v-6M22 12h-6M4.93 4.93l3.57 3.57M19.07 19.07l-3.57-3.57M4.93 19.07l3.57-3.57M19.07 4.93l-3.57 3.57" stroke="#D4AF37" />
        </svg>
      )
    },
    {
      id: "cricket",
      component: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 21l11-11 2.5 2.5-11 11H3z" fill="#D4AF37" stroke="#8B6508" />
          <path d="M14 10l2-2 1.5 1.5-2 2" fill="#8B6508" stroke="#8B6508" />
          <circle cx="18.5" cy="5.5" r="2.5" fill="#D4AF37" stroke="#8B6508" />
        </svg>
      )
    },
    {
      id: "f1",
      component: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 11h16v3H4zm2-5h12l3 5H3zM5 14h14a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 012-2z" fill="#0A0A0A" stroke="#D4AF37" />
          <circle cx="7" cy="18" r="1.5" fill="#D4AF37" />
          <circle cx="17" cy="18" r="1.5" fill="#D4AF37" />
          <path d="M12 6V3M8 3h8" stroke="#D4AF37" />
        </svg>
      )
    }
  ];

  const [hoveredTab, setHoveredTab] = useState(null);
  const [dropOpen, setDropOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("briteseats-current-user");
    setDropOpen(false);
    setMobileOpen(false);
    navigate("/login");
  };

  const initials = currentUser
    ? currentUser.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : null;

  // Active status helpers
  const isEventsActive = location.pathname === "/events";
  const isVenuesActive = location.pathname === "/venues" || location.pathname.startsWith("/venue/");
  const isMyTicketsActive = location.pathname === "/my-tickets";
  const isSupportActive = location.pathname === "/support";

  // Metallic style pattern for backgrounds
  const metallicGridStyle = {
    backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 1px, transparent 1px, transparent 8px), linear-gradient(135deg, #0A0A0A 0%, #151515 50%, #0A0A0A 100%)"
  };

  return (
    <>
      <nav
        className="sticky top-0 z-[999] w-full border-b border-[#D4AF37]/25 backdrop-blur-md transition-all duration-300"
        style={{
          backgroundColor: "rgba(10, 10, 10, 0.92)",
          ...metallicGridStyle
        }}
      >
        <div className="container mx-auto flex h-20 items-center justify-between px-6 gap-4">
          
          {/* Left: Animated BriteSeats Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-black/60 border border-[#D4AF37]/40 overflow-hidden relative shadow-[0_0_15px_rgba(212,175,55,0.15)]"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLogoIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="flex items-center justify-center w-full h-full"
                >
                  {logoIcons[activeLogoIndex].component}
                </motion.div>
              </AnimatePresence>
            </div>
            <span
              className="font-black text-xl tracking-[0.25em] uppercase text-white font-sans transition-all duration-300 group-hover:text-[#D4AF37]"
            >
              BriteSeats
            </span>
          </Link>

          {/* Center: F1 Experiences Premium Menu (Desktop) */}
          <div className="hidden lg:flex items-center gap-10">
            {/* EVENTS Tab */}
            <div 
              className="relative py-7"
              onMouseEnter={() => setHoveredTab("EVENTS")}
              onMouseLeave={() => setHoveredTab(null)}
            >
              <button className={cn(
                "flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.2em] transition-all duration-300",
                isEventsActive ? "text-[#D4AF37]" : "text-white/80 hover:text-white"
              )}>
                Events <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>
              {(isEventsActive || hoveredTab === "EVENTS") && (
                <motion.div 
                  layoutId="navUnderline"
                  className={cn("absolute bottom-0 left-0 right-0 h-[3px]", isEventsActive ? "bg-[#D4AF37]" : "bg-[#D4AF37]/50")}
                />
              )}
              <AnimatePresence>
                {hoveredTab === "EVENTS" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-[80px] left-1/2 -translate-x-1/2 w-64 bg-[#0A0A0A] border border-[#D4AF37]/35 rounded-2xl p-5 shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-[1000] space-y-4"
                    style={metallicGridStyle}
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] opacity-80 border-b border-white/10 pb-2">Choose Category</p>
                    <div className="flex flex-col gap-3">
                      <Link to="/events" className="text-sm font-bold text-white/95 hover:text-[#D4AF37] transition-colors flex items-center justify-between group/item">
                        <span>All Events</span>
                        <ChevronRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-[#D4AF37]" />
                      </Link>
                      <Link to="/events?category=Concerts" className="text-sm font-bold text-white/90 hover:text-[#D4AF37] transition-colors flex items-center justify-between group/item">
                        <span>Concerts</span>
                        <ChevronRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-[#D4AF37]" />
                      </Link>
                      <Link to="/events?category=Football" className="text-sm font-bold text-white/90 hover:text-[#D4AF37] transition-colors flex items-center justify-between group/item">
                        <span>Football</span>
                        <ChevronRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-[#D4AF37]" />
                      </Link>
                      <Link to="/events?category=Cricket" className="text-sm font-bold text-white/90 hover:text-[#D4AF37] transition-colors flex items-center justify-between group/item">
                        <span>Cricket</span>
                        <ChevronRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-[#D4AF37]" />
                      </Link>
                      <Link to="/events?category=Formula 1" className="text-sm font-bold text-white/90 hover:text-[#D4AF37] transition-colors flex items-center justify-between group/item">
                        <span>Formula 1</span>
                        <ChevronRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-[#D4AF37]" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* VENUES Tab */}
            <div 
              className="relative py-7"
              onMouseEnter={() => setHoveredTab("VENUES")}
              onMouseLeave={() => setHoveredTab(null)}
            >
              <button className={cn(
                "flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.2em] transition-all duration-300",
                isVenuesActive ? "text-[#D4AF37]" : "text-white/80 hover:text-white"
              )}>
                Venues <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>
              {(isVenuesActive || hoveredTab === "VENUES") && (
                <motion.div 
                  layoutId="navUnderline"
                  className={cn("absolute bottom-0 left-0 right-0 h-[3px]", isVenuesActive ? "bg-[#D4AF37]" : "bg-[#D4AF37]/50")}
                />
              )}
              <AnimatePresence>
                {hoveredTab === "VENUES" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[460px] bg-[#0A0A0A] border border-[#D4AF37]/35 rounded-2xl p-5 shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-[1000] space-y-4"
                    style={metallicGridStyle}
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] opacity-80 border-b border-white/10 pb-2">Premium Stadium Partners</p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                      <Link to="/venues" className="text-sm font-bold text-white/95 hover:text-[#D4AF37] transition-colors col-span-2 flex items-center justify-between border-b border-white/5 pb-1 group/item">
                        <span>All Stadium Venues</span>
                        <ChevronRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-[#D4AF37]" />
                      </Link>
                      <Link to="/venue/seoulolympic" className="text-sm font-bold text-white/90 hover:text-[#D4AF37] transition-colors group/item flex items-center justify-between">
                        <span>Seoul Olympic Stadium</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover/item:opacity-100 transition-opacity text-[#D4AF37]" />
                      </Link>
                      <Link to="/venue/wembley" className="text-sm font-bold text-white/90 hover:text-[#D4AF37] transition-colors group/item flex items-center justify-between">
                        <span>Wembley Stadium</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover/item:opacity-100 transition-opacity text-[#D4AF37]" />
                      </Link>
                      <Link to="/venue/campnou" className="text-sm font-bold text-white/90 hover:text-[#D4AF37] transition-colors group/item flex items-center justify-between">
                        <span>Camp Nou</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover/item:opacity-100 transition-opacity text-[#D4AF37]" />
                      </Link>
                      <Link to="/venue/bernabeu" className="text-sm font-bold text-white/90 hover:text-[#D4AF37] transition-colors group/item flex items-center justify-between">
                        <span>Santiago Bernabéu</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover/item:opacity-100 transition-opacity text-[#D4AF37]" />
                      </Link>
                      <Link to="/venue/modi" className="text-sm font-bold text-white/90 hover:text-[#D4AF37] transition-colors group/item flex items-center justify-between">
                        <span>Narendra Modi Stadium</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover/item:opacity-100 transition-opacity text-[#D4AF37]" />
                      </Link>
                      <Link to="/venue/dypatil" className="text-sm font-bold text-white/90 hover:text-[#D4AF37] transition-colors group/item flex items-center justify-between">
                        <span>DY Patil Stadium</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover/item:opacity-100 transition-opacity text-[#D4AF37]" />
                      </Link>
                      <Link to="/venue/metlife" className="text-sm font-bold text-white/90 hover:text-[#D4AF37] transition-colors group/item flex items-center justify-between col-span-2">
                        <span>MetLife Stadium</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover/item:opacity-100 transition-opacity text-[#D4AF37]" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* MY TICKETS Tab */}
            <div 
              className="relative py-7"
              onMouseEnter={() => setHoveredTab("MY_TICKETS")}
              onMouseLeave={() => setHoveredTab(null)}
            >
              <button className={cn(
                "flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.2em] transition-all duration-300",
                isMyTicketsActive ? "text-[#D4AF37]" : "text-white/80 hover:text-white"
              )}>
                My Tickets <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>
              {(isMyTicketsActive || hoveredTab === "MY_TICKETS") && (
                <motion.div 
                  layoutId="navUnderline"
                  className={cn("absolute bottom-0 left-0 right-0 h-[3px]", isMyTicketsActive ? "bg-[#D4AF37]" : "bg-[#D4AF37]/50")}
                />
              )}
              <AnimatePresence>
                {hoveredTab === "MY_TICKETS" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-[80px] left-1/2 -translate-x-1/2 w-80 bg-[#0A0A0A] border border-[#D4AF37]/35 rounded-2xl p-5 shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-[1000] space-y-4"
                    style={metallicGridStyle}
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] opacity-80 border-b border-white/10 pb-2">My Reservations</p>
                    <div className="flex flex-col gap-2">
                      <Link to="/my-tickets" className="text-sm font-bold text-white hover:text-[#D4AF37] transition-colors flex items-center justify-between group/item mb-1">
                        <span>View All Tickets</span>
                        <ChevronRight className="w-4 h-4 text-[#D4AF37] opacity-60 group-hover/item:opacity-100 transition-opacity" />
                      </Link>
                      
                      {bookings.length > 0 && (
                        <>
                          <div className="h-px bg-white/15 my-2" />
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D4AF37] opacity-80 mb-1">Active booking session</p>
                          <div className="max-h-[160px] overflow-y-auto custom-scrollbar space-y-1 pr-1">
                            {bookings.map(booking => (
                              <button
                                key={booking.id}
                                onClick={() => setActiveBookingId(booking.id)}
                                className={cn(
                                  "w-full text-left p-3 rounded-xl transition-all border text-xs flex items-center justify-between",
                                  activeBookingId === booking.id 
                                    ? "bg-[#D4AF37]/15 border-[#D4AF37]/45 text-white" 
                                    : "bg-white/5 border-transparent text-white/70 hover:bg-white/10 hover:text-white"
                                )}
                              >
                                <div className="truncate max-w-[190px]">
                                  <p className="font-bold truncate text-[11px] uppercase tracking-wider">{booking.venue.name}</p>
                                  <p className="text-[9px] opacity-40">Ticket Session</p>
                                </div>
                                {activeBookingId === booking.id && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
                                )}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* SUPPORT Tab */}
            <div 
              className="relative py-7"
              onMouseEnter={() => setHoveredTab("SUPPORT")}
              onMouseLeave={() => setHoveredTab(null)}
            >
              <button className={cn(
                "flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.2em] transition-all duration-300",
                isSupportActive ? "text-[#D4AF37]" : "text-white/80 hover:text-white"
              )}>
                Support <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>
              {(isSupportActive || hoveredTab === "SUPPORT") && (
                <motion.div 
                  layoutId="navUnderline"
                  className={cn("absolute bottom-0 left-0 right-0 h-[3px]", isSupportActive ? "bg-[#D4AF37]" : "bg-[#D4AF37]/50")}
                />
              )}
              <AnimatePresence>
                {hoveredTab === "SUPPORT" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-[80px] left-1/2 -translate-x-1/2 w-64 bg-[#0A0A0A] border border-[#D4AF37]/35 rounded-2xl p-5 shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-[1000] space-y-4"
                    style={metallicGridStyle}
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] opacity-80 border-b border-white/10 pb-2">Help & Support</p>
                    <div className="flex flex-col gap-3">
                      <Link to="/support" className="text-sm font-bold text-white/95 hover:text-[#D4AF37] transition-colors flex items-center justify-between group/item">
                        <span>Support Center</span>
                        <ChevronRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-[#D4AF37]" />
                      </Link>
                      <Link to="/support#faq" className="text-sm font-bold text-white/90 hover:text-[#D4AF37] transition-colors flex items-center justify-between group/item">
                        <span>Common FAQs</span>
                        <ChevronRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-[#D4AF37]" />
                      </Link>
                      <Link to="/support#contact" className="text-sm font-bold text-white/90 hover:text-[#D4AF37] transition-colors flex items-center justify-between group/item">
                        <span>Contact Support</span>
                        <ChevronRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-[#D4AF37]" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Theme Toggle + User Settings Profile (Desktop & Mobile trigger) */}
          <div className="flex items-center gap-3">
            
            {/* Theme Toggle (F1 Style Dark Button) */}
            <button
              onClick={toggle}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-[#D4AF37]/40 transition-all"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-[#D4AF37]" />
              ) : (
                <Moon className="w-4 h-4 text-white" />
              )}
            </button>

            {/* Go Pro Promo Link (if currentUser logged in) */}
            {currentUser && (
              <Link 
                to="/pricing" 
                className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-[#D4AF37] to-[#AA8413] text-black shadow-[0_0_15px_rgba(212,175,55,0.25)] hover:scale-105 transition-all"
              >
                <Crown className="w-3.5 h-3.5 text-black" />
                Go Pro
              </Link>
            )}

            {/* Profile Dropdown */}
            {currentUser ? (
              <div className="relative inline-block" ref={dropRef}>
                <button
                  onClick={() => {
                    setDropOpen((d) => !d);
                    setSettingsOpen(false);
                  }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all hover:scale-105 border border-[#D4AF37]/50 shadow-[0_0_12px_rgba(212,175,55,0.2)]"
                  style={{
                    background: "linear-gradient(135deg, #D4AF37 0%, #AA8413 100%)",
                    color: "#000000",
                  }}
                >
                  {initials}
                </button>
                <AnimatePresence>
                  {dropOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-14 w-64 rounded-2xl border border-[#D4AF37]/35 overflow-hidden z-[1000] p-2 space-y-1 shadow-[0_25px_60px_rgba(0,0,0,0.85)]"
                      style={{
                        backgroundColor: "#0A0A0A",
                        ...metallicGridStyle
                      }}
                    >
                      <div className="px-5 py-4 border-b border-white/10 mb-2">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1 text-[#D4AF37] opacity-80">Signed in as</p>
                        <p className="font-black text-sm truncate text-white">{currentUser.name}</p>
                        <p className="text-xs font-medium truncate text-white/50">{currentUser.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setDropOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold w-full text-white/90 hover:bg-white/5 hover:text-[#D4AF37] transition-all"
                      >
                        <User className="h-4 w-4 text-[#D4AF37]" />
                        Your Profile
                      </Link>

                      <Link
                        to="/pricing"
                        onClick={() => setDropOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold w-full text-white/90 hover:bg-white/5 hover:text-[#D4AF37] transition-all"
                      >
                        <Crown className="h-4 w-4 text-[#D4AF37]" />
                        Premium Passes
                      </Link>

                      <div className="h-px bg-white/10 my-1 mx-2" />

                      <button
                        onClick={() => setSettingsOpen((s) => !s)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold w-full text-white/90 hover:bg-white/5 hover:text-[#D4AF37] transition-all"
                      >
                        <Settings className="h-4 w-4 text-white/60" />
                        <span>Settings</span>
                        <ChevronDown className={cn("h-3.5 w-3.5 ml-auto transition-transform duration-300", settingsOpen && "rotate-180")} />
                      </button>

                      {settingsOpen && (
                        <div className="mx-2 mb-2 p-3 rounded-xl space-y-3 bg-white/5 border border-white/10">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37] opacity-80">Theme</span>
                            <div className="flex items-center gap-1 p-1 rounded-lg bg-black/40 border border-white/5">
                              <button
                                onClick={() => isDark && toggle()}
                                className={cn(
                                  "px-2.5 py-1 rounded-md transition-all text-[9px] font-black",
                                  !isDark ? "bg-[#D4AF37] text-black shadow-sm" : "text-white/60 hover:text-white"
                                )}
                              >
                                LIGHT
                              </button>
                              <button
                                onClick={() => !isDark && toggle()}
                                className={cn(
                                  "px-2.5 py-1 rounded-md transition-all text-[9px] font-black",
                                  isDark ? "bg-[#D4AF37] text-black shadow-sm" : "text-white/60 hover:text-white"
                                )}
                              >
                                DARK
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="h-px bg-white/10 my-1 mx-2" />

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-black w-full text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-white text-black hover:bg-[#D4AF37] transition-all"
              >
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Hamburger Trigger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-over Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black z-[9998]"
            />
            {/* Slide-over Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-[#0A0A0A] border-l border-[#D4AF37]/35 z-[9999] p-6 flex flex-col justify-between overflow-y-auto"
              style={metallicGridStyle}
            >
              <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="font-black text-lg tracking-[0.2em] uppercase text-white font-sans">BRITESEATS</span>
                  <button 
                    onClick={() => setMobileOpen(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Nav Links List */}
                <div className="space-y-6">
                  {/* EVENTS Section */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] opacity-80">Events</p>
                    <div className="flex flex-col gap-2.5 pl-2 border-l border-white/10">
                      <Link to="/events" onClick={() => setMobileOpen(false)} className="text-sm font-bold text-white hover:text-[#D4AF37]">All Events</Link>
                      <Link to="/events?category=Concerts" onClick={() => setMobileOpen(false)} className="text-sm font-bold text-white/80 hover:text-[#D4AF37]">Concerts</Link>
                      <Link to="/events?category=Football" onClick={() => setMobileOpen(false)} className="text-sm font-bold text-white/80 hover:text-[#D4AF37]">Football</Link>
                      <Link to="/events?category=Cricket" onClick={() => setMobileOpen(false)} className="text-sm font-bold text-white/80 hover:text-[#D4AF37]">Cricket</Link>
                      <Link to="/events?category=Formula 1" onClick={() => setMobileOpen(false)} className="text-sm font-bold text-white/80 hover:text-[#D4AF37]">Formula 1</Link>
                    </div>
                  </div>

                  {/* VENUES Section */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] opacity-80">Venues</p>
                    <div className="flex flex-col gap-2.5 pl-2 border-l border-white/10">
                      <Link to="/venues" onClick={() => setMobileOpen(false)} className="text-sm font-bold text-white hover:text-[#D4AF37]">All Venues</Link>
                      <Link to="/venue/seoulolympic" onClick={() => setMobileOpen(false)} className="text-xs font-bold text-white/80 hover:text-[#D4AF37]">Seoul Olympic Stadium</Link>
                      <Link to="/venue/wembley" onClick={() => setMobileOpen(false)} className="text-xs font-bold text-white/80 hover:text-[#D4AF37]">Wembley Stadium</Link>
                      <Link to="/venue/campnou" onClick={() => setMobileOpen(false)} className="text-xs font-bold text-white/80 hover:text-[#D4AF37]">Camp Nou</Link>
                      <Link to="/venue/modi" onClick={() => setMobileOpen(false)} className="text-xs font-bold text-white/80 hover:text-[#D4AF37]">Narendra Modi Stadium</Link>
                    </div>
                  </div>

                  {/* MY TICKETS Section */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] opacity-80">My Tickets</p>
                    <div className="flex flex-col gap-2.5 pl-2 border-l border-white/10">
                      <Link to="/my-tickets" onClick={() => setMobileOpen(false)} className="text-sm font-bold text-white hover:text-[#D4AF37]">View My Tickets</Link>
                      {bookings.length > 0 && (
                        <div className="pt-2 space-y-1">
                          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#D4AF37]/70">Session Switcher</p>
                          {bookings.map(booking => (
                            <button
                              key={booking.id}
                              onClick={() => {
                                setActiveBookingId(booking.id);
                                setMobileOpen(false);
                              }}
                              className={cn(
                                "w-full text-left p-2 rounded-lg text-[10px] font-bold border transition-all truncate",
                                activeBookingId === booking.id 
                                  ? "bg-[#D4AF37]/20 border-[#D4AF37]/50 text-white"
                                  : "bg-white/5 border-transparent text-white/60"
                              )}
                            >
                              {booking.venue.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SUPPORT Section */}
                  <div className="space-y-2">
                    <Link to="/support" onClick={() => setMobileOpen(false)} className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] hover:underline block">Support Center</Link>
                  </div>
                </div>
              </div>

              {/* Footer Profile Details inside mobile drawer */}
              <div className="border-t border-white/10 pt-4 mt-6">
                {currentUser ? (
                  <div className="flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-2 truncate max-w-[170px]">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black" style={{ background: "linear-gradient(135deg, #D4AF37 0%, #AA8413 100%)", color: "#000" }}>
                        {initials}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-black text-white truncate">{currentUser.name}</p>
                        <p className="text-[10px] text-white/40 truncate">{currentUser.email}</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-wider border border-red-500/25"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-white text-black text-center font-black uppercase tracking-wider text-xs block"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
