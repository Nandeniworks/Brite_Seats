import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "../context/ChatContext";
import { 
  MessageSquare, X, Minus, Trash2, Send, Sparkles 
} from "lucide-react";

export default function SupportChatModal() {
  const {
    isOpen,
    isMinimized,
    isTyping,
    messages,
    closeChat,
    minimizeChat,
    restoreChat,
    clearChat,
    sendMessage
  } = useChat();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when messages list or typing state changes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      // Small timeout to let rendering finish
      const timer = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timer);
    }
  }, [messages, isTyping, isOpen, isMinimized]);

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const handleChipClick = (query) => {
    sendMessage(query);
  };

  const chips = [
    { label: "Refund", query: "Refund" },
    { label: "QR Code", query: "QR Code" },
    { label: "Tickets", query: "Tickets" },
    { label: "Seating", query: "Seating" },
    { label: "Venue", query: "Venue" },
    { label: "Transfer", query: "Transfer" }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* MINIMIZED BUBBLE BADGE */}
      <AnimatePresence>
        {isMinimized && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={restoreChat}
            className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-zinc-950/90 border border-[#D4AF37]/40 flex items-center justify-center cursor-pointer shadow-[0_8px_32px_rgba(212,175,55,0.15)] hover:scale-105 active:scale-95 transition-all"
            title="Open BriteSeats Support Chat"
          >
            <div className="relative">
              <MessageSquare className="w-6 h-6 text-[#D4AF37]" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border border-zinc-950 animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULL CHAT MODAL */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ y: 80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed bottom-6 right-6 z-[9999] w-[380px] h-[580px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-48px)] rounded-3xl bg-zinc-950/85 backdrop-blur-xl border border-[#D4AF37]/20 flex flex-col overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(212,175,55,0.05)] text-left font-sans"
          >
            {/* HEADER */}
            <div className="relative z-10 h-20 px-6 pb-4 bg-zinc-900/80 border-b border-white/10 flex items-end justify-between shrink-0">
              {/* Left Section: Title & Status */}
              <div className="flex flex-col justify-end">
                <div className="text-sm font-bold text-white font-sans leading-none">
                  BriteSeats Support
                </div>
                <div className="text-xs text-emerald-400 font-semibold font-sans mt-1.5 leading-none">
                  ● Online
                </div>
              </div>

              {/* Right Section: Controls */}
              <div className="flex items-center gap-4 text-white/70 shrink-0 pb-0.5">
                <button
                  onClick={clearChat}
                  className="p-1.5 hover:text-red-400 hover:bg-white/5 rounded transition-colors"
                  title="Clear Chat History"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={minimizeChat}
                  className="p-1.5 hover:text-white hover:bg-white/5 rounded transition-colors"
                  title="Minimize"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={closeChat}
                  className="p-1.5 hover:text-white hover:bg-white/5 rounded transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SUBTITLE BAR */}
            <div className="relative z-10 px-6 py-2.5 bg-[#D4AF37]/5 border-b border-[#D4AF37]/10 shrink-0">
              <div className="text-[10px] leading-relaxed font-semibold text-white/70 italic font-sans">
                "Instant assistance for tickets, bookings, QR codes, venues, and refunds."
              </div>
            </div>

            {/* MESSAGES LIST */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 relative z-10 scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((msg) => {
                const isBot = msg.sender === "bot";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isBot ? "items-start" : "items-end"}`}
                  >
                    <div
                      className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                        isBot
                          ? "bg-white/10 text-white border border-white/5 rounded-tl-none"
                          : "bg-[#D4AF37] text-black rounded-tr-none font-medium"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <div className="text-[8px] text-white/40 mt-1 px-1 font-sans">
                      {msg.timestamp}
                    </div>
                  </div>
                );
              })}

              {/* TYPING INDICATOR */}
              {isTyping && (
                <div className="flex flex-col items-start">
                  <div className="flex gap-1.5 items-center bg-white/10 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none self-start max-w-[70px]">
                    <div
                      className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* QUICK ACTIONS ROW */}
            <div className="px-6 pt-3 pb-2 border-t border-white/5 bg-zinc-900/40 relative z-10 shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none snap-x snap-mandatory">
                {chips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChipClick(chip.query)}
                    className="snap-center shrink-0 px-3 py-1 rounded-full bg-white/5 hover:bg-[#D4AF37]/15 hover:border-[#D4AF37]/40 border border-white/10 text-[10px] font-black uppercase tracking-wider text-[#D4AF37] transition-all active:scale-95"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* INPUT FOOTER */}
            <form
              onSubmit={handleSend}
              className="p-4 bg-zinc-900/80 border-t border-white/5 flex items-center gap-2 relative z-10 shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about refunds, QR codes, seatings..."
                className="flex-1 h-10 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/60 focus:bg-white/10 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-10 h-10 rounded-xl bg-[#D4AF37] disabled:bg-[#D4AF37]/40 disabled:cursor-not-allowed flex items-center justify-center text-black hover:opacity-90 active:scale-95 transition-all shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Dark gold ambient glow - placed at bottom to prevent layout shifts */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
