import React, { useState, useMemo } from "react";
import { 
  CheckCircle2, 
  ShieldCheck, 
  Plus,
  RotateCcw,
  Search,
  HelpCircle,
  ChevronDown,
  Trash2
} from "lucide-react";
import { useTicket } from "../context/TicketContext";
import { cn } from "../lib/utils";
import { GlassCard } from "./ui/GlassCard";
import { SectionHeader } from "./ui/SectionHeader";
import { AnimatedContainer, AnimatedItem } from "./ui/AnimatedContainer";

const FAQ_DATABASE = [
  {
    category: "Tickets",
    q: "How will I receive my tickets?",
    a: "All tickets are delivered digitally as secure QR codes. You can access them instantly under 'My Tickets' after booking confirmation."
  },
  {
    category: "Tickets",
    q: "Can I transfer my booking to a friend?",
    a: "Yes, tickets can be shared. Simply download the PDF ticket pass from the 'My Tickets' page and forward the QR code to them."
  },
  {
    category: "Entry Rules",
    q: "What is the stadium bag policy?",
    a: "For security, only clear bags smaller than A4 size (12x6x12 inches) are permitted. Backpacks and large luggage will be turned away."
  },
  {
    category: "Entry Rules",
    q: "Are professional cameras allowed?",
    a: "Professional cameras with detachable lenses, recording equipment, and tripods are strictly prohibited without official press credentials."
  },
  {
    category: "Transport",
    q: "Is parking available at the venues?",
    a: "Yes, parking lots open 3-4 hours prior to the events. We recommend booking parking slots in advance or using local rail/metro."
  },
  {
    category: "Refunds",
    q: "Can I cancel my ticket booking?",
    a: "Bookings are generally non-refundable unless the event is cancelled or rescheduled. In such cases, full refunds are processed automatically."
  }
];

export default function SupportCenter() {
  const { venue, supportChecks, toggleSupportCheck, addSupportCheck, deleteSupportCheck } = useTicket();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  
  // Custom check inputs
  const [newCheckLabel, setNewCheckLabel] = useState("");
  const [newCheckCat, setNewCheckCat] = useState("General");

  const completionRate = supportChecks.length > 0 
    ? Math.round((supportChecks.filter(i => i.checked).length / supportChecks.length) * 100) 
    : 0;

  // Filter FAQs based on search
  const filteredFAQs = useMemo(() => {
    if (!searchQuery.trim()) return FAQ_DATABASE;
    const qLower = searchQuery.toLowerCase();
    return FAQ_DATABASE.filter(f => 
      f.q.toLowerCase().includes(qLower) || 
      f.a.toLowerCase().includes(qLower) ||
      f.category.toLowerCase().includes(qLower)
    );
  }, [searchQuery]);

  const handleAddCustomCheck = (e) => {
    e.preventDefault();
    if (!newCheckLabel.trim()) return;
    addSupportCheck({ label: newCheckLabel, category: newCheckCat });
    setNewCheckLabel("");
  };

  const categories = ["Tickets", "Requirements", "General"];

  return (
    <AnimatedContainer className="max-w-4xl mx-auto space-y-12 pb-20 w-full px-4 text-left">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6">
        <SectionHeader 
          title="BriteSeats Support Center" 
          subtitle={`Need help preparing for the event at ${venue.name || 'the venue'}? Check the guides below.`} 
          align="left" 
          badge="Ticketing Support Active" 
        />
        <GlassCard className="px-8 py-6 text-right w-full md:w-auto" gradient>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Readiness Score</p>
          <p className="text-4xl font-black text-[#D4AF37]">{completionRate}%</p>
        </GlassCard>
      </header>

      {/* Searchable FAQ list */}
      <AnimatedItem className="space-y-6">
        <div className="cream-card p-6 md:p-8 space-y-6">
          <h3 className="text-xl font-black text-ink flex items-center gap-2 border-b border-black/5 pb-3" style={{ fontFamily: "Playfair Display, serif" }}>
            <HelpCircle className="w-6 h-6 text-[#D4AF37]" /> Frequently Asked Questions
          </h3>
          
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted opacity-45" />
            <input 
              type="text" 
              placeholder="Search tickets, parking, entry rules..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-black/5 dark:bg-white/5 border border-black/5 rounded-2xl text-xs font-bold focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Accordion list */}
          <div className="space-y-3">
            {filteredFAQs.map((faq, idx) => {
              const isOpen = expandedFAQ === idx;
              return (
                <div key={idx} className="border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden bg-white/40 dark:bg-[#1C1C1C]/40">
                  <button 
                    onClick={() => setExpandedFAQ(isOpen ? null : idx)}
                    className="w-full px-6 py-4 flex items-center justify-between font-black text-xs md:text-sm text-ink hover:bg-black/5 dark:hover:bg-white/5 text-left transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[9px] bg-black/5 dark:bg-white/5 text-ink-muted uppercase">{faq.category}</span>
                      {faq.q}
                    </span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isOpen && "rotate-180")} />
                  </button>
                  {isOpen && (
                    <div className="px-6 py-4 border-t border-black/5 bg-[#FAF8F3]/60 dark:bg-[#1C1C1C]/60 text-xs md:text-sm text-ink-muted font-medium leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
            {filteredFAQs.length === 0 && (
              <p className="text-center py-6 text-xs font-bold text-ink-muted">No matching support questions found.</p>
            )}
          </div>
        </div>
      </AnimatedItem>

      {/* Interactive Preparation checklist */}
      <AnimatedItem className="space-y-6">
        <div className="cream-card p-6 md:p-8 space-y-6">
          <h3 className="text-xl font-black text-ink flex items-center gap-2 border-b border-black/5 pb-3" style={{ fontFamily: "Playfair Display, serif" }}>
            <ShieldCheck className="w-6 h-6 text-[#D4AF37]" /> Game Day Readiness Checklist
          </h3>
          
          {/* Custom Checklist Form */}
          <form onSubmit={handleAddCustomCheck} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Add item (e.g. Charge phone, book cab...)" 
              value={newCheckLabel}
              onChange={(e) => setNewCheckLabel(e.target.value)}
              className="flex-1 h-12 bg-black/5 dark:bg-white/5 border border-black/5 rounded-2xl px-4 text-xs font-bold focus:outline-none focus:border-[#D4AF37]"
            />
            <select 
              value={newCheckCat} 
              onChange={(e) => setNewCheckCat(e.target.value)}
              className="h-12 px-4 bg-black/5 dark:bg-white/5 border border-black/5 rounded-2xl text-xs font-bold focus:outline-none"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button type="submit" className="h-12 w-12 rounded-2xl bg-[#D4AF37] flex items-center justify-center text-black shadow-lg">
              <Plus className="h-5 w-5" />
            </button>
          </form>

          {/* List grouped by category */}
          <div className="space-y-8 mt-6">
            {categories.map(cat => {
              const catItems = supportChecks.filter(i => i.category === cat);
              if (catItems.length === 0) return null;
              
              return (
                <div key={cat} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-6 bg-[#D4AF37] opacity-55 rounded-full" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-ink-muted">{cat}</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {catItems.map(item => (
                      <GlassCard 
                        key={item.id} 
                        className={cn(
                          "p-4 flex items-center justify-between group transition-all duration-300 border border-black/5", 
                          item.checked ? "bg-gray-50/50 opacity-60" : "bg-white hover:border-[#D4AF37]/50 shadow-sm"
                        )} 
                      >
                        <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => toggleSupportCheck(item.id)}>
                          <div className={cn(
                            "h-5 w-5 rounded-md flex items-center justify-center transition-all border", 
                            item.checked 
                              ? "bg-[#D4AF37] border-[#D4AF37] text-black" 
                              : "border-black/15 text-transparent"
                          )}>
                            <CheckCircle2 className="h-3 w-3" />
                          </div>
                          <span className={cn(
                            "text-xs md:text-sm font-bold transition-all", 
                            item.checked ? "text-ink-muted line-through" : "text-ink"
                          )}>
                            {item.label}
                          </span>
                        </div>
                        
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteSupportCheck(item.id); }}
                          className="p-1.5 text-ink-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </GlassCard>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AnimatedItem>
    </AnimatedContainer>
  );
}
