import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTicket } from "../context/TicketContext";
import { ALL_EVENTS } from "../data/eventImages";
import { ALL_VENUES } from "../data/venueData";
import { 
  Sparkles, MapPin, Calendar, CheckCircle2
} from "lucide-react";
import { cn } from "../lib/utils";
import SeatMap from "../components/SeatMap";
import BookingSidebar from "../components/BookingSidebar";
import SeatMapErrorBoundary from "../components/SeatMapErrorBoundary";

const DEFAULT_SECTORS = [
  { id: "vip", name: "VIP Box / Lounge", multiplier: 2.5, desc: "Premium seats, lounge access, free catering" },
  { id: "premium", name: "Premium Stand", multiplier: 1.5, desc: "Excellent elevated stadium visibility" },
  { id: "general", name: "General Admission", multiplier: 1.0, desc: "Standard pitch side & general seating" }
];

export default function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addTicket, activeBooking, createBooking } = useTicket();

  // Find selected event from URL or context
  const searchParams = new URLSearchParams(location.search);
  const eventIdParam = searchParams.get("event");

  const event = useMemo(() => {
    if (eventIdParam) {
      return ALL_EVENTS.find(e => e.id === eventIdParam);
    }
    if (activeBooking?.venue?.name) {
      const activeName = activeBooking.venue.name;
      return ALL_EVENTS.find(e => e.title.toLowerCase().includes(activeName.toLowerCase()) || activeName.toLowerCase().includes(e.title.toLowerCase())) || ALL_EVENTS[0];
    }
    return ALL_EVENTS[0];
  }, [eventIdParam, activeBooking]);

  const venue = useMemo(() => {
    if (!event) return null;
    return ALL_VENUES.find(v => v.name === event.venue) || ALL_VENUES[0];
  }, [event]);

  const sectors = useMemo(() => {
    if (event?.category === "Formula 1") {
      return [
        { id: "main", name: "Main Grandstand", multiplier: 1.0, desc: "Prime seats along the start/finish straight" },
        { id: "turn1", name: "Turn 1 Grandstand", multiplier: 1.25, desc: "Spectacular views of the opening corner action" },
        { id: "pit", name: "Pit Lane Grandstand", multiplier: 1.5, desc: "Direct views of pit stops and garage activity" },
        { id: "champions", name: "Champions Club", multiplier: 2.9167, desc: "Premium hospitality and trackside views" },
        { id: "paddock", name: "Paddock Club", multiplier: 6.25, desc: "Ultimate luxury hospitality and pit lane walks" }
      ];
    }
    return DEFAULT_SECTORS;
  }, [event]);

  // Load state from localStorage for Basket Memory
  const [selectedSection, setSelectedSection] = useState(() => {
    return localStorage.getItem("briteseats_selected_section") || "general";
  });
  // selectedSeats: array of { id, row, col, sectionId, sectionName, price }
  const [selectedSeats, setSelectedSeats] = useState(() => {
    const saved = localStorage.getItem("briteseats_selected_seats");
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      // Discard legacy string-array format
      if (!Array.isArray(parsed) || (parsed.length > 0 && typeof parsed[0] === "string")) return [];
      return parsed;
    } catch { return []; }
  });
  const [bookingFeedback, setBookingFeedback] = useState(null);

  // Safety sync: ensure selectedSection remains valid when switching categories
  useEffect(() => {
    if (sectors.length > 0 && !sectors.some(s => s.id === selectedSection)) {
      setSelectedSection(sectors[0].id);
    }
  }, [sectors, selectedSection]);

  const f1Schedule = useMemo(() => {
    if (event?.category !== "Formula 1") return null;
    const v = event.venue.toLowerCase();
    if (v.includes("silverstone")) {
      return {
        capacity: "150,000",
        grandstands: "Hamilton Straight (Main), Abbey, Becketts, Stowe, Luffield",
        schedule: [
          { day: "Friday, July 3", events: ["Practice 1: 14:30 - 15:30 BST", "Practice 2: 18:00 - 19:00 BST"] },
          { day: "Saturday, July 4", events: ["Practice 3: 13:30 - 14:30 BST", "Qualifying: 17:00 - 18:00 BST"] },
          { day: "Sunday, July 5", events: ["Grand Prix Race (52 Laps): 15:00 BST"] }
        ]
      };
    }
    if (v.includes("spa") || v.includes("belgian")) {
      return {
        capacity: "70,000",
        grandstands: "Gold 1 (Main), Eau Rouge, Kemmel, Pouhon, Chicane",
        schedule: [
          { day: "Friday, July 17", events: ["Practice 1: 13:30 - 14:30 CEST", "Practice 2: 17:00 - 18:00 CEST"] },
          { day: "Saturday, July 18", events: ["Practice 3: 12:30 - 13:30 CEST", "Qualifying: 16:00 - 17:00 CEST"] },
          { day: "Sunday, July 19", events: ["Grand Prix Race (44 Laps): 15:00 CEST"] }
        ]
      };
    }
    if (v.includes("monza") || v.includes("italian")) {
      return {
        capacity: "113,860",
        grandstands: "Centrale (Main), Laterale, Prima Variante, Ascari, Parabolica",
        schedule: [
          { day: "Friday, Sept 4", events: ["Practice 1: 13:30 - 14:30 CEST", "Practice 2: 17:00 - 18:00 CEST"] },
          { day: "Saturday, Sept 5", events: ["Practice 3: 12:30 - 13:30 CEST", "Qualifying: 16:00 - 17:00 CEST"] },
          { day: "Sunday, Sept 6", events: ["Grand Prix Race (53 Laps): 15:00 CEST"] }
        ]
      };
    }
    if (v.includes("singapore") || v.includes("marina")) {
      return {
        capacity: "90,000",
        grandstands: "Pit Grandstand (Main), Stamford, Connaught, Padang, Bay",
        schedule: [
          { day: "Friday, Oct 9", events: ["Practice 1: 17:30 - 18:30 SST", "Practice 2: 21:00 - 22:00 SST"] },
          { day: "Saturday, Oct 10", events: ["Practice 3: 17:30 - 18:30 SST", "Qualifying: 21:00 - 22:00 SST"] },
          { day: "Sunday, Oct 11", events: ["Night Grand Prix (61 Laps): 20:00 SST"] }
        ]
      };
    }
    if (v.includes("yas") || v.includes("abu dhabi")) {
      return {
        capacity: "60,000",
        grandstands: "Main Grandstand, West, North, South, Marina Grandstands",
        schedule: [
          { day: "Friday, Dec 4", events: ["Practice 1: 13:30 - 14:30 GST", "Practice 2: 17:00 - 18:00 GST"] },
          { day: "Saturday, Dec 5", events: ["Practice 3: 14:30 - 15:30 GST", "Qualifying: 18:00 - 19:00 GST"] },
          { day: "Sunday, Dec 6", events: ["Twilight Grand Prix (58 Laps): 17:00 GST"] }
        ]
      };
    }
    return null;
  }, [event]);

  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState(600);


  const getSectionFromRow = (r) => {
    if (event?.category === "Formula 1") {
      if (r === "A") return "paddock";
      if (r === "B") return "champions";
      if (r === "C") return "pit";
      if (r === "D") return "turn1";
      return "main";
    }
    return (r === "A" || r === "B") ? "vip" : (r === "C" || r === "D") ? "premium" : "general";
  };

  // Sync active booking in context
  useEffect(() => {
    if (event && venue && activeBooking?.venue?.name !== event.title) {
      createBooking(event.title, venue.coordinates.lat, venue.coordinates.lng);
    }
  }, [event, venue, activeBooking, createBooking]);

  // Generate seats grid
  const seatGrid = useMemo(() => {
    const rows = ["A", "B", "C", "D", "E"];
    const cols = Array.from({ length: 8 }, (_, i) => i + 1);
    
    // Seed some reserved seats randomly based on section
    const seedReserved = (row, col) => {
      const hash = (row.charCodeAt(0) * col) % 5;
      return hash === 0 || hash === 3;
    };

    return rows.map(row => 
      cols.map(col => ({
        id: `${row}-${col}`,
        row,
        col,
        reserved: seedReserved(row, col)
      }))
    );
  }, []);

  // Toggle a seat on/off — freely across any section
  const handleSeatClick = (seatId, reserved) => {
    if (reserved) return;

    const row = seatId.charAt(0);
    const col = parseInt(seatId.split("-")[1], 10);
    const secId = getSectionFromRow(row);
    const sec = sectors.find(s => s.id === secId) || sectors[0];
    const seatPrice = event ? Math.round(event.ticketPrice * sec.multiplier) : 0;

    setSelectedSeats(prev => {
      const exists = prev.some(s => s.id === seatId);
      if (exists) return prev.filter(s => s.id !== seatId);
      if (prev.length >= 10) {
        alert("Maximum 10 tickets can be booked at once.");
        return prev;
      }
      return [...prev, { id: seatId, row, col, sectionId: secId, sectionName: sec.name, price: seatPrice }];
    });
  };

  // Section panel highlights the selected tier for reference — no auto-fill
  const handleSectionChange = (sectionId) => {
    setSelectedSection(sectionId);
  };

  // Pricing — sum each individual seat's price
  const ticketQuantity = selectedSeats.length;
  const subtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const gstTax = Math.round(subtotal * 0.18);
  const bookingFee = ticketQuantity * 50;
  const total = subtotal + gstTax + bookingFee;

  // Basket memory — persist rich seat objects
  useEffect(() => {
    if (selectedSeats.length > 0) {
      localStorage.setItem("briteseats_selected_seats", JSON.stringify(selectedSeats));
      localStorage.setItem("briteseats_selected_section", selectedSection);
      localStorage.setItem("briteseats_total_price", total.toString());
    } else {
      localStorage.removeItem("briteseats_selected_seats");
      localStorage.removeItem("briteseats_selected_section");
      localStorage.removeItem("briteseats_total_price");
    }
  }, [selectedSeats, selectedSection, total]);

  // Booking countdown timer
  useEffect(() => {
    if (selectedSeats.length === 0) {
      setTimeLeft(600);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setSelectedSeats([]);
          localStorage.removeItem("briteseats_selected_seats");
          localStorage.removeItem("briteseats_selected_section");
          localStorage.removeItem("briteseats_total_price");
          alert("Your reservation has expired.");
          return 600;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedSeats.length]);

  const handleConfirmBooking = (e, finalTotal) => {
    e.preventDefault();
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    // Encode ticket ID using first seat for backward compatibility
    const eventIndex = ALL_EVENTS.findIndex(evt => evt.id === event.id);
    const firstSeat = selectedSeats[0];
    const sectorIndex = sectors.findIndex(s => s.id === firstSeat.sectionId);
    const rowIndex = firstSeat.row.charCodeAt(0) - 65;
    const seatStart = firstSeat.col;
    const quantity = selectedSeats.length;

    // Build the 6-digit encoded string
    const p1 = String(eventIndex !== -1 ? eventIndex : 0).padStart(2, '0');
    const p2 = String(sectorIndex !== -1 ? sectorIndex : 0);
    const p3 = String(rowIndex >= 0 && rowIndex < 10 ? rowIndex : 0);
    const p4 = String(seatStart >= 1 && seatStart <= 8 ? seatStart : 1);
    const p5 = String(quantity === 10 ? 0 : quantity >= 1 && quantity <= 9 ? quantity : 1);

    const ticketId = `BS-${p1}${p2}${p3}${p4}${p5}`;
    const bookingReference = `BR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Section label: single section or "Mixed" for multi-section bookings
    const uniqueSectionNames = [...new Set(selectedSeats.map(s => s.sectionName))];
    const sectionLabel = uniqueSectionNames.length === 1 ? uniqueSectionNames[0] : "Mixed";

    const ticketPayload = {
      id: `tkt-${Date.now()}`,
      eventId: event.id,
      name: event.title,
      venue: event.venue,
      location: event.location,
      image: event.image,
      date: event.date,
      quantity: selectedSeats.length,
      section: sectionLabel,
      seats: selectedSeats.map(s => s.id),
      seatDetails: selectedSeats,
      price: finalTotal,
      ticketId: ticketId,
      bookingReference: bookingReference,
      qrCode: `briteseats_ticket_${Date.now()}_${ticketId}`
    };

    const success = addTicket(ticketPayload);
    if (success) {
      setSelectedSeats([]);
      localStorage.removeItem("briteseats_selected_seats");
      localStorage.removeItem("briteseats_selected_section");
      localStorage.removeItem("briteseats_total_price");

      setBookingFeedback("Booking Confirmed!");
      setTimeout(() => {
        setBookingFeedback(null);
        navigate("/my-tickets");
      }, 1500);
    }
  };

  if (!event) return null;

  return (
    <div className="relative min-h-screen bg-[#FAF5EB] dark:bg-[#121212] transition-colors duration-500 pb-24 text-left">
      {/* Background visual hero */}
      <div className="fixed inset-0 z-0 h-[50vh] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-[0.4]"
             style={{ backgroundImage: `url(${event.image})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#FAF5EB]/90 to-[#FAF5EB] dark:via-[#121212]/95 dark:to-[#121212]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-32 max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: SEAT & SECTION SELECTION */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Header */}
          <div className="space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/20 dark:bg-white/5 border border-white/20 backdrop-blur-md rounded-full text-ink text-[9px] font-black uppercase tracking-widest w-fit">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> SECURE TICKETING
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-ink leading-none font-serif" style={{ fontFamily: "Playfair Display, serif" }}>
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-xs font-bold text-ink-muted">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-[#D4AF37]" /> {event.venue}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-[#D4AF37]" /> {event.date}</span>
            </div>
          </div>

          {f1Schedule && (
            <div className="cream-card grain-el p-6 md:p-8 space-y-6 border-red-500/25 bg-neutral-950/80 dark:bg-neutral-950/90 text-white shadow-[0_0_30px_rgba(239,68,68,0.1)] rounded-[24px]">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                <span className="w-2.5 h-6 bg-[#ef4444] rounded-sm" />
                <h3 className="text-lg font-black uppercase tracking-wider text-white" style={{ fontFamily: "Playfair Display, serif" }}>
                  Formula 1 Weekend Hub
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <p className="font-black text-[#ef4444] uppercase tracking-wider text-[9px]">Circuit Name</p>
                  <p className="font-bold text-white/80">{event.venue}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-black text-[#ef4444] uppercase tracking-wider text-[9px]">Capacity</p>
                  <p className="font-bold text-white/80">{f1Schedule.capacity} Spectators</p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <p className="font-black text-[#ef4444] uppercase tracking-wider text-[9px]">Available Grandstands</p>
                  <p className="font-medium text-white/75">{f1Schedule.grandstands}</p>
                </div>
              </div>
              
              <div className="space-y-3 pt-2">
                <p className="font-black text-[#ef4444] uppercase tracking-wider text-[9px]">Official Weekend Schedule</p>
                <div className="space-y-2.5">
                  {f1Schedule.schedule.map((dayItem, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/5 p-3 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <span className="font-black text-[10px] uppercase tracking-widest text-[#D4AF37] md:w-36">{dayItem.day}</span>
                      <div className="flex-1 space-y-1">
                        {dayItem.events.map((evt, eIdx) => (
                          <p key={eIdx} className="text-[11px] font-bold text-white/80">{evt}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <SeatMapErrorBoundary>
            {/* Section Selection */}
            <div className="cream-card grain-el p-6 md:p-8 space-y-6">
              <div className="border-b border-black/5 pb-2 space-y-0.5">
                <h3 className="text-xl font-black text-ink font-serif" style={{ fontFamily: "Playfair Display, serif" }}>Seating Sections & Pricing</h3>
                <p className="text-[10px] font-bold text-ink-muted">Select seats freely on the map below — mix and match sections.</p>
              </div>
              <div className="space-y-4">
                {sectors.map(sec => (
                  <button
                    key={sec.id}
                    onClick={() => handleSectionChange(sec.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-5 rounded-2xl border text-left transition-all",
                      selectedSection === sec.id 
                        ? "bg-black dark:bg-[#242424] text-white border-black" 
                        : "bg-[#FAF8F3] dark:bg-[#1C1C1C] border-black/5 hover:border-black/10 text-ink"
                    )}
                  >
                    <div>
                      <h4 className="font-black text-sm">{sec.name}</h4>
                      <p className="text-[10px] font-bold opacity-60 mt-1">{sec.desc}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold opacity-50 uppercase">Base Price</p>
                      <p className="text-base font-black text-[#D4AF37] mt-0.5">₹{Math.round(event.ticketPrice * sec.multiplier).toLocaleString()}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Seat Grid Selector wrapped in SeatMapErrorBoundary */}
            <SeatMap 
              seatGrid={seatGrid} 
              selectedSeats={selectedSeats} 
              handleSeatClick={handleSeatClick} 
              isF1={event?.category === "Formula 1"}
            />
          </SeatMapErrorBoundary>

        </div>

        {/* RIGHT COLUMN: BOOKING SUMMARY */}
        <div className="lg:col-span-5">
          <SeatMapErrorBoundary>
            <BookingSidebar 
              event={event}
              venue={venue}
              selectedSeats={selectedSeats}
              subtotal={subtotal}
              gstTax={gstTax}
              bookingFee={bookingFee}
              total={total}
              timeLeft={timeLeft}
              handleConfirmBooking={handleConfirmBooking}
            />
          </SeatMapErrorBoundary>
        </div>

      </div>

      {/* Confirmation Feedback Toast */}
      <AnimatePresence>
        {bookingFeedback && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 50, opacity: 0 }} 
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[2000] bg-black text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4"
          >
            <CheckCircle2 className="w-6 h-6 text-[#D4AF37]" />
            <span className="font-black text-[10px] uppercase tracking-[0.2em]">{bookingFeedback}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
