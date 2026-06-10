import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTicket } from "../context/TicketContext";
import { useTheme } from "../context/ThemeContext";
import { GlassCard } from "../components/ui/GlassCard";
import { AnimatedContainer, AnimatedItem } from "../components/ui/AnimatedContainer";
import SupportCenter from "../components/SupportCenter";
import { cn } from "../lib/utils";
import { 
  Phone, Mail, MessageSquare, Clock, Send, CheckCircle2, LifeBuoy
} from "lucide-react";

export default function Support() {
  const { venue, eventThemePack } = useTicket();
  const { isDark } = useTheme();

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "Ticket Access",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [ticketRefNum, setTicketRefNum] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill out all fields.");
      return;
    }
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      const ref = "BS-" + Math.floor(10000 + Math.random() * 90000);
      setTicketRefNum(ref);
      setShowToast(true);
      setFormData({
        name: "",
        email: "",
        category: "Ticket Access",
        message: ""
      });
      // Auto-hide toast after 5s
      setTimeout(() => setShowToast(false), 5000);
    }, 1200);
  };

  const [activeChat, setActiveChat] = useState(false);

  const startChat = () => {
    setActiveChat(true);
    alert("Initiating Live Chat agent connection... Please hold.");
    setTimeout(() => {
      setActiveChat(false);
    }, 3000);
  };

  return (
    <div className={cn(
      "relative min-h-screen transition-colors duration-500 overflow-hidden pb-24 text-left",
      isDark ? "bg-[#0A0A0A] text-white" : "bg-[#F7F0E6] text-[#111111]"
    )} style={eventThemePack?.bookingCssVars}>
      
      {/* Background Ambiance */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className={cn(
          "absolute top-0 right-0 w-[600px] h-[600px] blur-[150px] rounded-full transition-opacity duration-1000",
          isDark ? "bg-[#D4AF37]/5 opacity-100" : "bg-[#B8860B]/5 opacity-60"
        )} />
        <div className={cn(
          "absolute bottom-0 left-0 w-[400px] h-[400px] blur-[120px] rounded-full transition-opacity duration-1000",
          isDark ? "bg-amber-700/5 opacity-100" : "bg-amber-700/3 opacity-60"
        )} />
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl px-4 pt-32">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row items-center md:items-end justify-between mb-16 gap-10">
          <div className="space-y-6 text-center md:text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "inline-flex items-center gap-3 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.3em] shadow-lg transition-all",
                isDark 
                  ? "bg-[#D4AF37]/10 border-[#D4AF37]/20 text-[#D4AF37] shadow-[#D4AF37]/5" 
                  : "bg-[#B8860B]/10 border-[#B8860B]/20 text-[#B8860B] shadow-[#B8860B]/5"
              )}
            >
              <LifeBuoy className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" /> Customer Support Care
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none" style={{ fontFamily: "Playfair Display, serif" }}>
               Customer <br/> <span className="text-[#D4AF37] italic">Care Center</span>
            </h1>
            <p className="text-sm font-medium text-ink-muted max-w-2xl">
              Get immediate ticketing support, learn about venue entries, or contact our coordinators before matchday or concert doors open.
            </p>
          </div>

          {venue && (
            <div className="flex flex-col items-center md:items-end gap-3 text-center md:text-right bg-black/5 dark:bg-white/5 border border-black/5 p-6 rounded-3xl backdrop-blur-sm">
               <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Active Event Stadium</span>
               <h3 className="text-2xl font-black text-ink" style={{ fontFamily: "Playfair Display, serif" }}>{venue.name}</h3>
            </div>
          )}
        </header>

        {/* Support Grid (Ticket form & Care Channels) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 relative z-10">
          
          {/* Left Column: Raise Ticket Form */}
          <div className="lg:col-span-7">
            <GlassCard className="p-8 md:p-10 flex flex-col justify-between flex-1 space-y-6 animate-fadeIn" border gradient>
              <div className="space-y-2">
                 <h3 className="text-2xl font-black text-ink" style={{ fontFamily: "Playfair Display, serif" }}>Raise a Support Ticket</h3>
                 <p className="text-xs text-ink-muted">Can't find what you need in the FAQs? Submit a ticket and our support specialists will email you shortly.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black uppercase tracking-wider text-ink-muted">Full Name</label>
                    <input 
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl text-xs font-bold focus:outline-none focus:border-[#D4AF37] transition-all text-ink"
                    />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black uppercase tracking-wider text-ink-muted">Email Address</label>
                    <input 
                      type="email"
                      name="email"
                      required
                      placeholder="e.g. john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl text-xs font-bold focus:outline-none focus:border-[#D4AF37] transition-all text-ink"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-black uppercase tracking-wider text-ink-muted">Issue Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl text-xs font-bold focus:outline-none focus:border-[#D4AF37] transition-all text-ink"
                  >
                    <option value="Ticket Access" className="bg-[#111] text-white">Ticket Access & QR Codes</option>
                    <option value="Seating Allocation" className="bg-[#111] text-white">Seating Allocation & Map</option>
                    <option value="Refund Request" className="bg-[#111] text-white">Refund / Cancellations</option>
                    <option value="Venue Parking" className="bg-[#111] text-white">Venue Access & Parking</option>
                    <option value="General Inquiry" className="bg-[#111] text-white">General Inquiry</option>
                  </select>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-black uppercase tracking-wider text-ink-muted">Your Message</label>
                  <textarea 
                    name="message"
                    required
                    rows={4}
                    placeholder="Describe your issue or question in detail..."
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl text-xs font-bold focus:outline-none focus:border-[#D4AF37] transition-all text-ink"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-sage py-4 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all"
                  style={{
                    background: "var(--booking-btn-gradient)",
                    color: "black"
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin animate-infinite" /> Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Raise Ticket
                    </>
                  )}
                </button>
              </form>
            </GlassCard>
          </div>

          {/* Right Column: Contact Channels */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            {/* Priority Phone Card */}
            <GlassCard className="p-6 flex items-start gap-5" border gradient>
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/35 flex items-center justify-center text-[#D4AF37] shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div className="space-y-1 flex-1 text-left">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-black text-ink" style={{ fontFamily: "Playfair Display, serif" }}>Priority Phone Line</h4>
                  <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">24/7 Live</span>
                </div>
                <p className="text-[10px] text-ink-muted">For ticketing emergencies, immediate seat releases, and entrance Gate VIP support.</p>
                <a href="tel:+18005557328" className="inline-block text-sm font-black text-[#D4AF37] hover:underline mt-2">
                  +1 (800) 555-SEAT (7328)
                </a>
              </div>
            </GlassCard>

            {/* Email Support Card */}
            <GlassCard className="p-6 flex items-start gap-5" border gradient>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/35 flex items-center justify-center text-cyan-400 shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div className="space-y-1 flex-1 text-left">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-black text-ink" style={{ fontFamily: "Playfair Display, serif" }}>Email Helpdesk</h4>
                  <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">2h Reply</span>
                </div>
                <p className="text-[10px] text-ink-muted">Refund inquiries, group bookings, corporate stadium suites, or advertising sponsorships.</p>
                <a href="mailto:support@briteseats.com" className="inline-block text-sm font-black text-cyan-400 hover:underline mt-2">
                  support@briteseats.com
                </a>
              </div>
            </GlassCard>

            {/* Live Chat Support Card */}
            <GlassCard className="p-6 flex items-start gap-5" border gradient>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-center text-emerald-400 shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="space-y-1 flex-1 text-left">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-black text-ink" style={{ fontFamily: "Playfair Display, serif" }}>Live Virtual Chat</h4>
                  <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Online</span>
                </div>
                <p className="text-[10px] text-ink-muted">Connect instantly with our automated bot or stadium coordinator to review your seating rows.</p>
                <button 
                  onClick={startChat} 
                  disabled={activeChat}
                  className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest px-3 py-1.5 mt-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 transition-all"
                >
                  {activeChat ? "Connecting..." : "Start Chat Now"}
                </button>
              </div>
            </GlassCard>
          </div>

        </div>

        {/* Support Center Accordions & Checklist */}
        <SupportCenter />

      </div>

      {/* Floating Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: -20, scale: 0.9 }} 
            className="fixed top-8 right-8 z-[9999] max-w-sm w-full bg-[#111111]/90 dark:bg-black/90 backdrop-blur-md border border-[#D4AF37]/30 rounded-3xl p-5 shadow-2xl flex items-start gap-4 text-left"
          >
            <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/40 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="text-xs font-black text-[#D4AF37] uppercase tracking-wider">Support Ticket Raised</h4>
              <p className="text-[10px] font-bold text-white leading-normal">
                Ticket <span className="font-mono text-cyan-400 font-black">{ticketRefNum}</span> successfully created. Check your email inbox for automatic confirmation.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
