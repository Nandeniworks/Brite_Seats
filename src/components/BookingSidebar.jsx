import React, { useState } from "react";
import { Info, ShieldCheck, Tag, X } from "lucide-react";
import { useTicket } from "../context/TicketContext";

const BookingSidebar = ({
  event,
  venue,
  sectionObj,
  ticketQuantity,
  setTicketQuantity,
  selectedSeats,
  basePricePerTicket,
  subtotal,
  gstTax,
  bookingFee,
  total,
  timeLeft,
  handleConfirmBooking
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

  return (
    <div className="sticky top-24 cream-card grain-el p-6 md:p-8 space-y-6 text-left">
      <div className="flex justify-between items-center border-b border-black/5 pb-2">
        <h3 className="text-xl font-black text-ink font-serif" style={{ fontFamily: "Playfair Display, serif" }}>
          Booking Summary
        </h3>
      </div>

      {/* Countdown Timer Display inside Booking Summary Sidebar */}
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

      <div className="space-y-4">
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
          <span className="font-black text-ink text-right">{sectionObj.name}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="font-bold text-ink-muted">Quantity</span>
          <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 rounded-xl p-1">
            <button 
              onClick={() => setTicketQuantity(prev => Math.max(1, prev - 1))}
              className="w-7 h-7 bg-white dark:bg-[#242424] rounded-lg font-black text-ink hover:scale-105 transition-all"
            >-</button>
            <span className="font-black text-ink text-sm px-1">{ticketQuantity}</span>
            <button 
              onClick={() => setTicketQuantity(prev => Math.min(10, prev + 1))}
              className="w-7 h-7 bg-white dark:bg-[#242424] rounded-lg font-black text-ink hover:scale-105 transition-all"
            >+</button>
          </div>
        </div>
        
        {selectedSeats.length > 0 && (
          <div className="flex justify-between items-start text-sm">
            <span className="font-bold text-ink-muted shrink-0">Seats</span>
            <div className="flex flex-wrap justify-end gap-1.5 max-w-[200px]">
              {selectedSeats.map(s => (
                <span key={s} className="px-2 py-0.5 rounded-md bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[9px] font-black text-ink">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-black/5" />

      {/* Promo Code Input */}
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
            <button onClick={clearPromo} className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center hover:bg-emerald-500/35 transition-colors">
              <X className="w-3.5 h-3.5 text-emerald-600" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyPromo} className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. SEATS10" 
              value={promoInput}
              onChange={(e) => {
                setPromoInput(e.target.value);
                setPromoFeedback(null);
              }}
              className="flex-1 px-4 py-2 text-xs font-bold bg-[#FAF8F3] dark:bg-[#1C1C1C] border border-black/5 rounded-xl outline-none focus:border-[#D4AF37]"
            />
            <button type="submit" className="px-4 py-2 bg-black dark:bg-[#242424] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:opacity-90">
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

      {/* Price breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="font-bold text-ink-muted">Price ({ticketQuantity} x ₹{basePricePerTicket.toLocaleString()})</span>
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
          <span className="font-black text-base text-ink font-serif" style={{ fontFamily: "Playfair Display, serif" }}>Total Price</span>
          <span className="font-black text-2xl text-ink">₹{finalTotal.toLocaleString()}</span>
        </div>
      </div>

      <button
        onClick={(e) => handleConfirmBooking(e, finalTotal)}
        className="w-full py-4 bg-[#D4AF37] hover:bg-[#AA8413] text-black font-black text-[11px] uppercase tracking-[0.2em] rounded-xl shadow-xl transition-all hover:scale-102 flex items-center justify-center gap-2"
      >
        <ShieldCheck className="w-4 h-4" /> Confirm Booking
      </button>
    </div>
  );
};

export default BookingSidebar;
