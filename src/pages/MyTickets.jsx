import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTicket } from "../context/TicketContext";
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { 
  Ticket, Calendar, MapPin, Download, ArrowRight, Info, Clock 
} from "lucide-react";

// Month mapping for calendar parser
const monthMap = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
};

// Date Parsing Utility for Calendar
const parseEventDate = (dateStr) => {
  if (!dateStr) return { year: new Date().getFullYear(), month: "january", day: 1 };
  
  const yearMatch = dateStr.match(/\d{4}/);
  const year = yearMatch ? yearMatch[0] : new Date().getFullYear();
  
  const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const month = months.find(m => dateStr.toLowerCase().includes(m)) || "january";
  
  const cleanedWithoutYear = dateStr.replace(year, "");
  
  // Handle multi-day range like "July 3–5" or "July 3-5" by extracting the Sunday (last day)
  let day = "1";
  if (cleanedWithoutYear.includes("–") || cleanedWithoutYear.includes("-")) {
    const parts = cleanedWithoutYear.split(/[–-]/);
    if (parts.length > 1) {
      const secondPartMatch = parts[1].match(/\d+/);
      if (secondPartMatch) {
        day = secondPartMatch[0];
      }
    }
  } else {
    const dayMatch = cleanedWithoutYear.match(/\d+/);
    day = dayMatch ? dayMatch[0] : "1";
  }
  
  return {
    year: parseInt(year, 10),
    month,
    day: parseInt(day, 10)
  };
};

// Download .ics Calendar File
const downloadIcsFile = (ticket) => {
  const { name, venue, date, ticketId } = ticket;
  const parsedDate = parseEventDate(date);
  
  let startHour = 19;
  let startMin = 30;
  let durationHours = 3;
  
  const titleLower = name.toLowerCase();
  const isF1 = titleLower.includes("grand prix") || titleLower.includes("gp") || titleLower.includes("f1") || (ticket.category || "").toLowerCase() === "formula 1";
  
  if (isF1) {
    if (titleLower.includes("singapore")) {
      startHour = 20; // 8 PM local time night race
    } else {
      startHour = 15; // 3 PM default race start
    }
    startMin = 0;
    durationHours = 3.5;
  } else if (titleLower.includes("test") || titleLower.includes("wtc")) {
    startHour = 10;
    startMin = 0;
    durationHours = 7;
  } else if (titleLower.includes("cricket") || titleLower.includes("ipl") || titleLower.includes("indpak")) {
    startHour = 19;
    startMin = 30;
    durationHours = 4;
  } else if (titleLower.includes("football") || titleLower.includes("fifa") || titleLower.includes("ucl")) {
    startHour = 19;
    startMin = 30;
    durationHours = 2.5;
  }
  
  const monthNum = monthMap[parsedDate.month] ?? 0;
  const startDate = new Date(parsedDate.year, monthNum, parsedDate.day, startHour, startMin, 0);
  const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);
  
  const formatIcsDate = (dObj) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${dObj.getFullYear()}${pad(dObj.getMonth() + 1)}${pad(dObj.getDate())}T${pad(dObj.getHours())}${pad(dObj.getMinutes())}${pad(dObj.getSeconds())}`;
  };
  
  const dtStart = formatIcsDate(startDate);
  const dtEnd = formatIcsDate(endDate);
  const dtStamp = formatIcsDate(new Date());
  
  const bookingRef = ticket.bookingReference || `BR-${ticketId.replace('BS-', '')}`;
  const seatInfo = ticket.seats?.join(", ") || "N/A";
  const sectionInfo = ticket.section || "N/A";
  const uid = `${ticketId}-${Date.now()}@briteseats.com`;
  
  const description = `BriteSeats Premium Ticket\\nTicket ID: ${ticketId}\\nBooking Reference: ${bookingRef}\\nSection: ${sectionInfo}\\nSeat(s): ${seatInfo}`;
  
  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BriteSeats//Ticketing System//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${name}`,
    `LOCATION:${venue}`,
    `DESCRIPTION:${description}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ];
  
  const blob = new Blob([icsLines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `BriteSeats-${name.replace(/[^a-z0-9]/gi, '_')}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Generate high-resolution PDF download using html2canvas and jsPDF
const handleDownloadPDF = async (ticketRef, ticketId) => {
  if (!ticketRef.current) return;
  try {
    const canvas = await html2canvas(ticketRef.current, {
      scale: 3, // Render at 3x resolution for high sharpness
      useCORS: true,
      allowTaint: true,
      backgroundColor: null
    });
    const imgData = canvas.toDataURL("image/png");
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    const pdf = new jsPDF({
      orientation: imgWidth > imgHeight ? "l" : "p",
      unit: "px",
      format: [imgWidth, imgHeight]
    });
    
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`BriteSeats-Ticket-${ticketId}.pdf`);
  } catch (err) {
    console.error("PDF generation failed:", err);
    alert("Could not generate PDF. Please try again.");
  }
};

// Layout: Concert tickets
const ConcertLayout = ({ ticket, qrUrl }) => {
  const row = ticket.seats?.[0]?.split("-")?.[0] || "A";
  const seatNumbers = ticket.seats?.map(s => s.split("-")[1]).join(", ") || "N/A";
  const bookingRef = ticket.bookingReference || `BR-${ticket.ticketId?.replace('BS-', '') || 'UNKNOWN'}`;
  
  return (
    <>
      {/* Left Body */}
      <div className="w-[450px] h-full relative rounded-l-[24px] overflow-hidden flex flex-col justify-between p-6">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${ticket.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#150030]/95 via-[#00092C]/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#EC4899]/15 via-transparent to-[#06B6D4]/15 pointer-events-none" />
        
        {/* Border indicator */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#A855F7]" />
        
        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-pink-400" />
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-cyan-400">BRITESEATS LIVE PASS</span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider text-pink-500 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/30">
              Concert VIP
            </span>
          </div>
          
          {/* Event details */}
          <div className="space-y-1">
            <h3 className="text-xl font-black text-white leading-tight font-serif truncate" style={{ fontFamily: "Playfair Display, serif" }}>
              {ticket.name}
            </h3>
            <div className="flex items-center gap-3 text-[9px] font-bold text-cyan-300/90 tracking-wide">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-pink-500" /> {ticket.venue}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-pink-500" /> {ticket.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-pink-500" /> 19:30</span>
            </div>
          </div>
          
          {/* Seat Grid */}
          <div className="grid grid-cols-3 gap-2 bg-[#150030]/60 border border-purple-500/20 px-3 py-2 rounded-xl backdrop-blur-md">
            <div>
              <p className="text-[7px] font-black uppercase text-purple-300/60 tracking-wider">Section</p>
              <p className="text-[10px] font-black text-white truncate">{ticket.section || "VIP"}</p>
            </div>
            <div>
              <p className="text-[7px] font-black uppercase text-purple-300/60 tracking-wider">Row</p>
              <p className="text-[10px] font-black text-white truncate">{row}</p>
            </div>
            <div>
              <p className="text-[7px] font-black uppercase text-purple-300/60 tracking-wider">Seat(s)</p>
              <p className="text-[10px] font-black text-white truncate">{seatNumbers}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Stub */}
      <div className="w-[190px] h-full relative rounded-r-[24px] overflow-hidden flex flex-col justify-between p-5 bg-[#0A001F] text-center border-l border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-[#150030]/20 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col justify-between h-full items-center">
          <div className="space-y-0.5">
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-pink-500">ADMIT ONE</p>
            <p className="text-[6px] text-white/40 uppercase tracking-widest font-black">Gate open 17:30</p>
          </div>
          
          {/* QR wrapper */}
          <div className="bg-white p-1 rounded-xl shadow-lg border border-cyan-400/50 flex items-center justify-center">
            {qrUrl ? (
              <img src={qrUrl} alt="QR Code" className="w-20 h-20 object-contain rounded-md" />
            ) : (
              <div className="w-20 h-20 bg-neutral-900 animate-pulse rounded-md" />
            )}
          </div>
          
          <div className="space-y-0.5 text-center">
            <p className="text-[6px] font-black uppercase text-white/50">Ticket ID</p>
            <p className="text-[9px] font-black text-cyan-400 font-mono tracking-tight">{ticket.ticketId}</p>
            <p className="text-[6px] font-bold text-[#D4AF37] tracking-tight truncate w-[150px] mx-auto">
              REF: {bookingRef}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

// Layout: Football tickets
const FootballLayout = ({ ticket, qrUrl }) => {
  const row = ticket.seats?.[0]?.split("-")?.[0] || "A";
  const seatNumbers = ticket.seats?.map(s => s.split("-")[1]).join(", ") || "N/A";
  const bookingRef = ticket.bookingReference || `BR-${ticket.ticketId?.replace('BS-', '') || 'UNKNOWN'}`;
  
  return (
    <>
      {/* Left Body */}
      <div className="w-[450px] h-full relative rounded-l-[24px] overflow-hidden flex flex-row p-0">
        {/* Left Gold Accent Band */}
        <div className="w-9 h-full bg-[#D4AF37] flex items-center justify-center shrink-0 relative overflow-hidden select-none">
          <div className="absolute inset-0 opacity-10 mix-blend-multiply bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22%3E%3Cpath d=%22M0 0h100v100H0z%22 fill=%22%23000%22/%3E%3C/svg%3E')]" />
          <span className="text-black font-black uppercase text-[8px] tracking-[0.25em] whitespace-nowrap transform -rotate-90 select-none">
            MATCHDAY PASS
          </span>
        </div>
        
        {/* Content Body */}
        <div className="flex-1 h-full relative p-6 flex flex-col justify-between">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${ticket.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#022c22]/95 via-[#01140f]/90 to-transparent" />
          
          <div className="relative z-10 flex flex-col justify-between h-full">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#D4AF37]">
                BRITESEATS STADIUM TICKETING
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                Football Match
              </span>
            </div>
            
            {/* Event Name */}
            <div className="space-y-1">
              <h3 className="text-xl font-black text-white leading-tight font-serif truncate" style={{ fontFamily: "Playfair Display, serif" }}>
                {ticket.name}
              </h3>
              <div className="flex items-center gap-3 text-[9px] font-bold text-[#D4AF37]/90 tracking-wide">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-white/60" /> {ticket.venue}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-white/60" /> {ticket.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-white/60" /> KICKOFF 19:30</span>
              </div>
            </div>
            
            {/* Seating Grid */}
            <div className="grid grid-cols-3 gap-2 bg-black/55 border border-[#D4AF37]/25 px-3 py-2 rounded-xl backdrop-blur-md">
              <div>
                <p className="text-[7px] font-black uppercase text-[#D4AF37]/65 tracking-wider">Stand</p>
                <p className="text-[10px] font-black text-white truncate">{ticket.section || "General"}</p>
              </div>
              <div>
                <p className="text-[7px] font-black uppercase text-[#D4AF37]/65 tracking-wider">Row</p>
                <p className="text-[10px] font-black text-white truncate">{row}</p>
              </div>
              <div>
                <p className="text-[7px] font-black uppercase text-[#D4AF37]/65 tracking-wider">Seat(s)</p>
                <p className="text-[10px] font-black text-white truncate">{seatNumbers}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Stub */}
      <div className="w-[190px] h-full relative rounded-r-[24px] overflow-hidden flex flex-col justify-between p-5 bg-[#01140f] text-center border-l border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-[#022c22]/20 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col justify-between h-full items-center">
          <div className="space-y-0.5">
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">SECURED ENTRY</p>
            <p className="text-[6px] text-white/40 uppercase tracking-widest font-black">Gate opens 2h before</p>
          </div>
          
          {/* QR wrapper */}
          <div className="bg-white p-1 rounded-xl shadow-lg border border-[#D4AF37]/50 flex items-center justify-center">
            {qrUrl ? (
              <img src={qrUrl} alt="QR Code" className="w-20 h-20 object-contain rounded-md" />
            ) : (
              <div className="w-20 h-20 bg-neutral-900 animate-pulse rounded-md" />
            )}
          </div>
          
          <div className="space-y-0.5 text-center">
            <p className="text-[6px] font-black uppercase text-white/50">Ticket ID</p>
            <p className="text-[9px] font-black text-white font-mono tracking-tight">{ticket.ticketId}</p>
            <p className="text-[6px] font-bold text-[#D4AF37] tracking-tight truncate w-[150px] mx-auto">
              REF: {bookingRef}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

// Layout: Cricket tickets
const CricketLayout = ({ ticket, qrUrl }) => {
  const row = ticket.seats?.[0]?.split("-")?.[0] || "A";
  const seatNumbers = ticket.seats?.map(s => s.split("-")[1]).join(", ") || "N/A";
  const bookingRef = ticket.bookingReference || `BR-${ticket.ticketId?.replace('BS-', '') || 'UNKNOWN'}`;
  
  const isTestMatch = ticket.name?.toLowerCase().includes("test") || ticket.name?.toLowerCase().includes("wtc");
  const matchTime = isTestMatch ? "10:00" : "19:30";
  
  return (
    <>
      {/* Left Body */}
      <div className="w-[450px] h-full relative rounded-l-[24px] overflow-hidden flex flex-col justify-between p-6">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${ticket.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B192C]/95 via-[#1E3E62]/90 to-transparent" />
        
        {/* Gold Frame around left side */}
        <div className="absolute inset-2 border border-[#D4AF37]/30 pointer-events-none rounded-[16px] z-20" />
        
        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#D4AF37]">
                BRITESEATS PLATINUM
              </span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-full border border-[#D4AF37]/35">
              Official Cricket Pass
            </span>
          </div>
          
          {/* Event details */}
          <div className="space-y-1">
            <h3 className="text-xl font-black text-white leading-tight font-serif truncate" style={{ fontFamily: "Playfair Display, serif" }}>
              {ticket.name}
            </h3>
            <div className="flex items-center gap-3 text-[9px] font-bold text-[#D4AF37]/90 tracking-wide">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-white/70" /> {ticket.venue}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-white/70" /> {ticket.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-white/70" /> {matchTime}</span>
            </div>
          </div>
          
          {/* Seat Grid */}
          <div className="grid grid-cols-3 gap-2 bg-[#0B192C]/70 border border-[#D4AF37]/25 px-3 py-2 rounded-xl backdrop-blur-md">
            <div>
              <p className="text-[7px] font-black uppercase text-slate-400 tracking-wider">Pavilion</p>
              <p className="text-[10px] font-black text-white truncate">{ticket.section || "Club"}</p>
            </div>
            <div>
              <p className="text-[7px] font-black uppercase text-slate-400 tracking-wider">Row</p>
              <p className="text-[10px] font-black text-white truncate">{row}</p>
            </div>
            <div>
              <p className="text-[7px] font-black uppercase text-slate-400 tracking-wider">Seat(s)</p>
              <p className="text-[10px] font-black text-white truncate">{seatNumbers}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Stub */}
      <div className="w-[190px] h-full relative rounded-r-[24px] overflow-hidden flex flex-col justify-between p-5 bg-[#0B192C] text-center border-l border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3E62]/20 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col justify-between h-full items-center">
          <div className="space-y-0.5">
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">OFFICIAL PASS</p>
            <p className="text-[6px] text-white/40 uppercase tracking-widest font-black">Verify at Turnstiles</p>
          </div>
          
          {/* QR wrapper */}
          <div className="bg-white p-1 rounded-xl shadow-lg border border-[#D4AF37]/50 flex items-center justify-center">
            {qrUrl ? (
              <img src={qrUrl} alt="QR Code" className="w-20 h-20 object-contain rounded-md" />
            ) : (
              <div className="w-20 h-20 bg-neutral-900 animate-pulse rounded-md" />
            )}
          </div>
          
          <div className="space-y-0.5 text-center">
            <p className="text-[6px] font-black uppercase text-slate-400">Ticket ID</p>
            <p className="text-[9px] font-black text-[#D4AF37] font-mono tracking-tight">{ticket.ticketId}</p>
            <p className="text-[6px] font-bold text-white/60 tracking-tight truncate w-[150px] mx-auto">
              REF: {bookingRef}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

// Layout: F1 tickets
const F1Layout = ({ ticket, qrUrl }) => {
  const row = ticket.seats?.[0]?.split("-")?.[0] || "A";
  const seatNumbers = ticket.seats?.map(s => s.split("-")[1]).join(", ") || "N/A";
  const bookingRef = ticket.bookingReference || `BR-${ticket.ticketId?.replace('BS-', '') || 'UNKNOWN'}`;
  
  const getTrackSvg = (venueName) => {
    const v = (venueName || "").toLowerCase();
    if (v.includes("silverstone")) {
      return (
        <svg viewBox="0 0 100 100" className="w-36 h-36 text-red-500/10 absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
          <path d="M 30,75 L 15,55 L 20,35 L 45,15 L 65,10 L 85,25 L 90,45 L 75,55 L 70,75 L 50,80 Z" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    if (v.includes("spa") || v.includes("francorchamps")) {
      return (
        <svg viewBox="0 0 100 100" className="w-36 h-36 text-red-500/10 absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
          <path d="M 20,20 L 45,20 L 55,30 L 75,25 L 85,45 L 65,65 L 55,55 L 45,80 L 25,60 Z" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    if (v.includes("monza")) {
      return (
        <svg viewBox="0 0 100 100" className="w-36 h-36 text-red-500/10 absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
          <path d="M 15,40 L 80,40 C 95,40 95,60 80,60 L 45,60 L 25,80 C 10,70 10,50 15,40 Z" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    if (v.includes("singapore") || v.includes("marina bay")) {
      return (
        <svg viewBox="0 0 100 100" className="w-36 h-36 text-red-500/10 absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
          <path d="M 20,30 L 40,30 L 45,45 L 60,45 L 65,30 L 80,35 L 85,60 L 70,60 L 65,75 L 45,75 L 40,60 L 25,60 Z" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    if (v.includes("yas marina") || v.includes("abu dhabi")) {
      return (
        <svg viewBox="0 0 100 100" className="w-36 h-36 text-red-500/10 absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
          <path d="M 20,20 L 60,20 L 80,40 L 80,60 L 60,80 L 40,80 L 20,50 Z" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    return null;
  };

  const isSingapore = (ticket.name || "").toLowerCase().includes("singapore");
  const raceTime = isSingapore ? "20:00" : "15:00";

  return (
    <>
      {/* Left Body */}
      <div 
        className="w-[450px] h-full relative rounded-l-[24px] overflow-hidden flex flex-col justify-between p-6 bg-[#111]"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #151515 25%, transparent 25%), 
            linear-gradient(-45deg, #151515 25%, transparent 25%), 
            linear-gradient(135deg, #1a1a1a 25%, transparent 25%), 
            linear-gradient(-135deg, #1a1a1a 25%, transparent 25%)
          `,
          backgroundSize: "8px 8px",
          backgroundColor: "#111"
        }}
      >
        {/* Event background image - low opacity underlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.22] mix-blend-luminosity pointer-events-none"
          style={{ backgroundImage: `url(${ticket.image})` }}
        />
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent pointer-events-none" />
        
        {/* Track outline SVG Watermark */}
        {getTrackSvg(ticket.venue)}

        {/* Left F1 Red Accent Band */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#ef4444] shadow-[0_0_10px_rgba(239,68,68,0.7)]" />

        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-[#ef4444] rounded-sm" />
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#ef4444] drop-shadow-[0_0_5px_rgba(239,68,68,0.4)]">BRITESEATS RACING</span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider text-[#ef4444] bg-[#ef4444]/15 px-2 py-0.5 rounded-full border border-[#ef4444]/40">
              FORMULA 1 PASS
            </span>
          </div>

          {/* Event details */}
          <div className="space-y-1">
            <h3 className="text-xl font-black text-white leading-tight font-serif truncate" style={{ fontFamily: "Playfair Display, serif" }}>
              {ticket.name}
            </h3>
            <div className="flex items-center gap-3 text-[9px] font-bold text-white/95 tracking-wide">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#ef4444]" /> {ticket.venue}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[#ef4444]" /> {ticket.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#ef4444]" /> {raceTime}</span>
            </div>
          </div>

          {/* Seat Grid */}
          <div className="grid grid-cols-3 gap-2 bg-black/75 border border-[#ef4444]/25 px-3 py-2 rounded-xl backdrop-blur-md">
            <div>
              <p className="text-[7px] font-black uppercase text-neutral-400 tracking-wider">Grandstand</p>
              <p className="text-[10px] font-black text-white truncate">{ticket.section || "Main"}</p>
            </div>
            <div>
              <p className="text-[7px] font-black uppercase text-neutral-400 tracking-wider">Row</p>
              <p className="text-[10px] font-black text-white truncate">{row}</p>
            </div>
            <div>
              <p className="text-[7px] font-black uppercase text-neutral-400 tracking-wider">Seat(s)</p>
              <p className="text-[10px] font-black text-white truncate">{seatNumbers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Stub */}
      <div className="w-[190px] h-full relative rounded-r-[24px] overflow-hidden flex flex-col justify-between p-5 bg-[#090909] text-center border-l border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ef4444]/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col justify-between h-full items-center">
          <div className="space-y-0.5">
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#ef4444]">OFFICIAL PASS</p>
            <p className="text-[6px] text-white/40 uppercase tracking-widest font-black">Gate open 4h before</p>
          </div>

          {/* QR wrapper */}
          <div className="bg-white p-1 rounded-xl shadow-lg border border-[#ef4444]/40 flex items-center justify-center">
            {qrUrl ? (
              <img src={qrUrl} alt="QR Code" className="w-20 h-20 object-contain rounded-md" />
            ) : (
              <div className="w-20 h-20 bg-neutral-900 animate-pulse rounded-md" />
            )}
          </div>

          <div className="space-y-0.5 text-center">
            <p className="text-[6px] font-black uppercase text-neutral-500">Ticket ID</p>
            <p className="text-[9px] font-black text-[#ef4444] font-mono tracking-tight">{ticket.ticketId}</p>
            <p className="text-[6px] font-bold text-[#D4AF37] tracking-tight truncate w-[150px] mx-auto">
              REF: {bookingRef}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

// Main TicketStub Component
const TicketStub = ({ ticket }) => {
  const ticketRef = useRef(null);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [qrUrl, setQrUrl] = useState("");

  // Responsive scaling logic for mobile screens
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const parentWidth = containerRef.current.parentElement.getBoundingClientRect().width;
      const ticketWidth = 660; // 640px ticket + padding margin safety
      if (parentWidth < ticketWidth) {
        setScale(parentWidth / ticketWidth);
      } else {
        setScale(1);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Generate dynamic QR code encoding ticket URL
  useEffect(() => {
    const qrText = `https://briteseats.vercel.app/ticket/${ticket.ticketId || "BS-DEFAULT"}`;
    
    QRCode.toDataURL(qrText, {
      margin: 4,
      width: 256,
      color: {
        dark: "#000000",
        light: "#FFFFFF"
      }
    })
      .then(url => setQrUrl(url))
      .catch(err => console.error("QR Code generation error:", err));
  }, [ticket.ticketId]);

  // Determine category dynamically
  const getCategory = (tkt) => {
    const cat = tkt.category || "";
    const name = (tkt.name || "").toLowerCase();
    const eventId = (tkt.eventId || "").toLowerCase();
    
    if (cat.toLowerCase().includes("formula 1") || cat.toLowerCase().includes("f1") || eventId.includes("f1-") || name.includes("grand prix") || name.includes("gp")) {
      return "f1";
    }
    if (cat.toLowerCase().includes("concert") || eventId.includes("concert") || name.includes("concert") || name.includes("coldplay") || name.includes("arijit") || name.includes("diljit") || name.includes("weeknd") || name.includes("lipa") || name.includes("sheeran") || name.includes("dragons") || name.includes("bts")) {
      return "concert";
    }
    if (cat.toLowerCase().includes("football") || eventId.includes("football") || name.includes("football") || name.includes("fifa") || name.includes("ucl") || name.includes("arsenal") || name.includes("united") || name.includes("bayern") || name.includes("dortmund") || name.includes("clasico")) {
      return "football";
    }
    if (cat.toLowerCase().includes("cricket") || eventId.includes("cricket") || name.includes("cricket") || name.includes("ipl") || name.includes("wtc") || name.includes("indpak") || name.includes("super kings") || name.includes("mumbai indians")) {
      return "cricket";
    }
    return "concert";
  };

  const category = getCategory(ticket);

  return (
    <div className="flex flex-col items-center w-full my-4">
      {/* Scaled Ticket Wrapper */}
      <div 
        ref={containerRef} 
        className="w-full flex justify-center overflow-visible"
        style={{ 
          height: `${240 * scale}px`, 
          marginBottom: scale < 1 ? `${-240 * (1 - scale)}px` : "0px" 
        }}
      >
        <div 
          ref={ticketRef}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
          className="shrink-0 w-[640px] h-[240px] relative flex flex-row text-white select-none bg-neutral-900 rounded-[24px] shadow-2xl border border-white/10"
        >
          {/* Main Ticket Layouts */}
          {category === "concert" && <ConcertLayout ticket={ticket} qrUrl={qrUrl} />}
          {category === "football" && <FootballLayout ticket={ticket} qrUrl={qrUrl} />}
          {category === "cricket" && <CricketLayout ticket={ticket} qrUrl={qrUrl} />}
          {category === "f1" && <F1Layout ticket={ticket} qrUrl={qrUrl} />}
          
          {/* Perforation/Stub Circular Notches */}
          <div className="absolute top-[-12px] right-[178px] w-6 h-6 rounded-full bg-[#FAF5EB] dark:bg-[#121212] z-20 shadow-[inset_0_-1px_3px_rgba(0,0,0,0.15)] transition-colors duration-500" />
          <div className="absolute bottom-[-12px] right-[178px] w-6 h-6 rounded-full bg-[#FAF5EB] dark:bg-[#121212] z-20 shadow-[inset_0_1px_3px_rgba(0,0,0,0.15)] transition-colors duration-500" />
          <div className="absolute top-4 bottom-4 right-[190px] border-l border-dashed border-white/20 z-10" />
        </div>
      </div>
      
      {/* Action panel underneath card */}
      <div 
        className="w-full max-w-xl flex flex-row justify-between items-center gap-3 mt-4 px-4 transition-all"
        style={{
          marginTop: scale < 1 ? `calc(1rem + ${240 * (1 - scale)}px)` : "1rem"
        }}
      >
        <span className="text-[10px] font-black text-ink-muted uppercase tracking-widest">
          Secured: {ticket.seats?.length} x Seats
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => handleDownloadPDF(ticketRef, ticket.ticketId)}
            className="btn-sage px-5 py-2.5 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md text-black"
          >
            <Download className="w-3.5 h-3.5" /> Download PDF
          </button>
          <button
            onClick={() => downloadIcsFile(ticket)}
            className="btn-lavender px-5 py-2.5 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md text-black"
          >
            <Calendar className="w-3.5 h-3.5" /> Add to Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default function MyTickets() {
  const { tickets } = useTicket();

  // Filter valid tickets to display
  const activeTickets = (tickets || []).filter(t => t.ticketId);

  return (
    <div className="relative min-h-screen bg-[#FAF5EB] dark:bg-[#121212] transition-colors duration-500 pb-24 text-left">
      <div className="container mx-auto px-4 py-32 max-w-3xl">
        
        {/* Header */}
        <div className="mb-12 space-y-2">
          <p className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">
            My Purchases
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-ink" style={{ fontFamily: "Playfair Display, serif" }}>
            My Tickets 🎫
          </h1>
          <p className="text-sm font-medium text-ink-muted">
            All your secured gate entry passes, seating details, and unique QR codes.
          </p>
        </div>

        {/* Tickets Stack */}
        {activeTickets.length === 0 ? (
          <div className="cream-card grain-el p-16 text-center space-y-6">
            <div className="w-20 h-20 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto border border-black/5">
              <Ticket className="w-10 h-10 text-ink-muted" />
            </div>
            <div>
              <h3 className="font-black text-2xl text-ink" style={{ fontFamily: "Playfair Display, serif" }}>
                No tickets purchased yet
              </h3>
              <p className="text-sm font-medium text-ink-muted mt-2 max-w-md mx-auto">
                Explore upcoming concerts, football, and cricket matches on the homepage to book your seats.
              </p>
            </div>
            <Link to="/" className="btn-sage px-6 py-3.5 text-xs inline-flex items-center gap-2 text-black">
              Explore Events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {activeTickets.map((tkt) => (
              <TicketStub key={tkt.id} ticket={tkt} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center text-[10px] font-black text-ink-muted flex items-center justify-center gap-2">
          <Info className="w-4 h-4" /> Gate doors open 2 hours before the scheduled time. Bring a downloaded digital copy or print on paper.
        </div>

      </div>
    </div>
  );
}
