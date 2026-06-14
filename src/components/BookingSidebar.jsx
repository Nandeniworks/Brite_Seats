import React, { useState } from "react";
import { ShieldCheck, Tag, X, LayoutGrid } from "lucide-react";
import { useTicket } from "../context/TicketContext";
import { cn } from "../lib/utils";

// Section badge styles — keyed by sectionId
const BADGE_STYLES = {
  vip:       "bg-[#D4AF37]/15 text-[#9A7210] border-[#D4AF37]/30",
  premium:   "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
  general:   "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  // F1 sections
  paddock:   "bg-red-500/15 text-red-500 border-red-500/30",
  champions: "bg-red-500/15 text-red-500 border-red-500/30",
  pit:       "bg-red-500/15 text-red-500 border-red-500/30",
  turn1:     "bg-orange-500/15 text-orange-600 border-orange-500/30",
  main:      "bg-red-500/15 text-red-500 border-red-500/30",
};

const BADGE_LABEL = {
  vip: "VIP", premium: "PRE", general: "GEN",
  paddock: "PDK", champions: "CHM", pit: "PIT", turn1: "T1", main: "MAIN",
};

const BookingSidebar = ({
  event,
  venue,
  selectedSeats,      // SeatDetail[] — { id, row, col, sectionId, sectionName, price }
  subtotal,
  gstTax,
  bookingFee,
  total,
  timeLeft,
  handleConfirmBooking,
}) => {
  const { activePromo, applyPromoCode, clearPromo } = useTicket();
  const [promoInput, setPromoInput] = useState("");
  const [promoFeedback, setPromoFeedback] = useState(null);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    if (res.success) {
      setPromoFeedback({ success: true, msg: res.message });
      setPromoInput("");
    } else {
      setPromoFeedback({ success: false, msg: res.message });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const discountAmount = activePromo ? Math.round(subtotal * activePromo.discount) : 0;
  const finalTotal = Math.max(0, total - discountAmount);

  // Derive section label from selected seats
  const uniqueSectionNames = [...new Set(selectedSeats.map(s => s.sectionName))];
  const sectionLabel =
    uniqueSectionNames.length === 0 ? "—" :
    uniqueSectionNames.length === 1 ? uniqueSectionNames[0] : "Multi-Section";

  return (
    <div className="sticky top-24 cream-card grain-el p-6 md:p-8 space-y-6 text-left">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-black/5 pb-2">
        <h3 className="text-xl font-black text-ink font-serif" style={{ fontFamily: "Playfair Display, serif" }}>
          Booking Summary
        </h3>
      </div>

      {/* Countdown Timer */}
      {selectedSeats.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-center space-y-1">
          <p className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">
            Seats Reserved For:
          </p>
          <p className="text-2xl font-black text-ink font-mono tracking-tight">
            {formatTime(timeLeft)}
          </p>
        </div>
      )}

      {/* Event + section summary */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="font-bold text-ink-muted">Event</span>
          <span className="font-black text-ink text-right max-w-[200px] truncate">{event.title}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="font-bold text-ink-muted">Venue</span>
          <span className="font-black text-ink text-right">{event.venue}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="font-bold text-ink-muted">Section</span>
          <span className="font-black text-ink text-right">{sectionLabel}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="font-bold text-ink-muted">Seats Selected</span>
          <span className="font-black text-ink">{selectedSeats.length}</span>
        </div>
      </div>

      <div className="h-px bg-black/5" />

      {/* Per-Seat Breakdown */}
      {selectedSeats.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-3 h-3 text-ink-muted" />
            <p className="text-[10px] font-black uppercase tracking-widest text-ink-muted">Seat Breakdown</p>
          </div>
          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-0.5">
            {selectedSeats.map(seat => (
              <div
                key={seat.id}
                className="flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] hover:bg-black/[0.06] dark:hover:bg-white/[0.06] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[8px] font-black uppercase border tracking-wide",
                    BADGE_STYLES[seat.sectionId] || "bg-black/10 text-ink border-black/10"
                  )}>
                    {BADGE_LABEL[seat.sectionId] || (seat.sectionId || "?").toUpperCase()}
                  </span>
                  <span className="text-[11px] font-bold text-ink">
                    Row {seat.row} · Seat {seat.col}
                  </span>
                </div>
                <span className="text-[11px] font-black text-ink">₹{seat.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="h-px bg-black/5" />

      {/* Promo Code */}
      <div className="space-y-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-ink-muted">Apply Coupon Code</p>
        {activePromo ? (
          <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-500" />
              <div>
                <span className="text-xs font-black text-emerald-600 block">{activePromo.code} Applied</span>
                <span className="text-[9px] text-emerald-500/80 font-bold block">{activePromo.label}</span>
              </div>
            </div>
            <button
              onClick={clearPromo}
              className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center hover:bg-emerald-500/35 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-emerald-600" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyPromo} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. SEATS10"
              value={promoInput}
              onChange={(e) => { setPromoInput(e.target.value); setPromoFeedback(null); }}
              className="flex-1 px-4 py-2 text-xs font-bold bg-[#FAF8F3] dark:bg-[#1C1C1C] border border-black/5 rounded-xl outline-none focus:border-[#D4AF37]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-black dark:bg-[#242424] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:opacity-90"
            >
              Apply
            </button>
          </form>
        )}
        {promoFeedback && (
          <p className={`text-[10px] font-bold mt-1 ${promoFeedback.success ? "text-emerald-500" : "text-red-500"}`}>
            {promoFeedback.msg}
          </p>
        )}
      </div>

      <div className="h-px bg-black/5" />

      {/* Price Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="font-bold text-ink-muted">Seat Subtotal ({selectedSeats.length} seat{selectedSeats.length !== 1 ? "s" : ""})</span>
          <span className="font-black text-ink">₹{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="font-bold text-ink-muted">Taxes (18% GST)</span>
          <span className="font-black text-ink">₹{gstTax.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="font-bold text-ink-muted">Booking Fee</span>
          <span className="font-black text-ink">₹{bookingFee.toLocaleString()}</span>
        </div>
        {activePromo && (
          <div className="flex justify-between items-center text-sm text-emerald-500">
            <span className="font-bold">Promo Discount ({activePromo.discount * 100}%)</span>
            <span className="font-black">-₹{discountAmount.toLocaleString()}</span>
          </div>
        )}
        <div className="h-px bg-black/5" />
        <div className="flex justify-between items-center">
          <span className="font-black text-base text-ink font-serif" style={{ fontFamily: "Playfair Display, serif" }}>
            Total Price
          </span>
          <span className="font-black text-2xl text-ink">₹{finalTotal.toLocaleString()}</span>
        </div>
      </div>

      <button
        onClick={(e) => handleConfirmBooking(e, finalTotal)}
        disabled={selectedSeats.length === 0}
        className="w-full py-4 bg-[#D4AF37] hover:bg-[#AA8413] disabled:opacity-40 disabled:cursor-not-allowed text-black font-black text-[11px] uppercase tracking-[0.2em] rounded-xl shadow-xl transition-all hover:scale-102 flex items-center justify-center gap-2"
      >
        <ShieldCheck className="w-4 h-4" /> Confirm Booking
      </button>
    </div>
  );
};

export default BookingSidebar;
