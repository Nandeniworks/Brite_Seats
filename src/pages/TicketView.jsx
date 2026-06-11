import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTicket } from "../context/TicketContext";
import { TicketStub } from "./MyTickets";
import { ArrowLeft, Ticket } from "lucide-react";

export default function TicketView() {
  const { ticketId } = useParams();
  const { bookings } = useTicket();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let foundTicket = null;

    // 1. Try loading directly from localStorage to ensure immediate availability and bypass context load lag
    const bookingsStr = localStorage.getItem("briteseats-bookings");
    if (bookingsStr) {
      try {
        const parsedBookings = JSON.parse(bookingsStr);
        if (Array.isArray(parsedBookings)) {
          for (const b of parsedBookings) {
            if (b.tickets && Array.isArray(b.tickets)) {
              const found = b.tickets.find((t) => t.ticketId === ticketId);
              if (found) {
                foundTicket = found;
                break;
              }
            }
          }
        }
      } catch (e) {
        console.warn("[TICKET VIEW] Failed to parse bookings from localStorage", e);
      }
    }

    // 2. Fallback: Search context bookings
    if (!foundTicket && bookings && Array.isArray(bookings)) {
      for (const b of bookings) {
        if (b.tickets && Array.isArray(b.tickets)) {
          const found = b.tickets.find((t) => t.ticketId === ticketId);
          if (found) {
            foundTicket = found;
            break;
          }
        }
      }
    }

    setTicket(foundTicket);
    setLoading(false);
  }, [ticketId, bookings]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF5EB] dark:bg-[#121212]">
        <div className="w-12 h-12 border-2 border-[#D4AF37]/25 border-t-[#D4AF37] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#FAF5EB] dark:bg-[#121212] transition-colors duration-500 pb-24 text-left">
      {/* Decorative background blobs to match premium aesthetic */}
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: "var(--sage)", filter: "blur(80px)" }} />
      <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full opacity-10 pointer-events-none"
        style={{ background: "var(--lavender)", filter: "blur(70px)" }} />

      <div className="container mx-auto px-4 py-32 max-w-3xl relative z-10">
        <div className="mb-8">
          <Link
            to="/my-tickets"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#D4AF37] hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" /> Back to My Tickets
          </Link>
        </div>

        {ticket ? (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-ink mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
                Your Ticket Details 🎟️
              </h1>
              <p className="text-sm font-medium text-ink-muted">
                Present this digital ticket and its QR code for entry gate confirmation.
              </p>
            </div>
            <TicketStub ticket={ticket} />
          </div>
        ) : (
          <div className="cream-card grain-el p-16 text-center space-y-6">
            <div className="w-20 h-20 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto border border-black/5">
              <Ticket className="w-10 h-10 text-ink-muted" />
            </div>
            <div>
              <h3 className="font-black text-2xl text-ink" style={{ fontFamily: "Playfair Display, serif" }}>
                Ticket Not Found
              </h3>
              <p className="text-sm font-medium text-ink-muted mt-2 max-w-md mx-auto">
                We couldn't find a ticket matching the reference ID <span className="font-mono text-[#D4AF37]">{ticketId}</span>. Please verify the URL or check the browser used for booking.
              </p>
            </div>
            <Link to="/" className="btn-sage px-6 py-3.5 text-xs inline-flex items-center gap-2 text-black mx-auto block w-fit">
              Explore Events
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
