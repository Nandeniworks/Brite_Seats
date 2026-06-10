import React from "react";
import { Link } from "react-router-dom";
import { 
  ShieldCheck,
  Ticket
} from "lucide-react";

// Inline social SVGs for reliable cross-version building
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/>
    <polygon points="10 15 15 12 10 9"/>
  </svg>
);

const Footer = () => {
  return (
    <footer className="grain-black w-full text-white" style={{ fontFamily: "Inter, sans-serif" }}>

      {/* ── Main footer content ──────────────── */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-left">

          {/* Brand & Socials */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/45 flex items-center justify-center">
                <Ticket className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <h3 className="text-2xl font-black text-white" style={{ fontFamily: "Playfair Display, serif" }}>
                BriteSeats
              </h3>
            </div>
            <p className="text-white/50 text-sm font-medium leading-relaxed max-w-xs">
              Your premium gateway for stadium concerts, football championships, and international cricket matches. Secure your seats in real-time.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-4 pt-2">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all text-white/70"
              >
                <FacebookIcon />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all text-white/70"
              >
                <InstagramIcon />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all text-white/70"
              >
                <TwitterIcon />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all text-white/70"
              >
                <YoutubeIcon />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-5">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Explore</h4>
            <div className="flex flex-col gap-3">
              {[
                { label: "Home", path: "/" },
                { label: "Events", path: "/events" },
                { label: "Venues", path: "/venues" },
                { label: "My Tickets", path: "/my-tickets" },
                { label: "Support Center", path: "/support" },
              ].map((l) => (
                <Link
                  key={l.path}
                  to={l.path}
                  className="text-white/60 hover:text-white text-sm font-semibold transition-colors duration-200 w-fit"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Policies */}
          <div className="space-y-5">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Policies & Info</h4>
            <div className="flex flex-col gap-3">
              {[
                { label: "Privacy Policy", path: "#" },
                { label: "Terms & Conditions", path: "#" },
                { label: "Refund Policy", path: "#" },
                { label: "Stadium Bag Policy", path: "/support" },
                { label: "Pricing Details", path: "/pricing" },
              ].map((p, idx) => (
                <Link
                  key={idx}
                  to={p.path}
                  className="text-white/60 hover:text-white text-sm font-semibold transition-colors duration-200 w-fit"
                >
                  {p.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Mantra / Security */}
          <div className="space-y-5">
            <h4 className="text-xs font-black uppercase tracking-widest text-white/40">Secure Booking</h4>
            <blockquote className="text-white/70 text-sm font-medium italic leading-relaxed border-l-2 border-[#D4AF37]/50 pl-4">
              "Live events, music, and sports are the ultimate human connection."
              <footer className="text-white/35 text-xs font-bold mt-2 not-italic">— BriteSeats Team</footer>
            </blockquote>
            <div className="flex items-center gap-2 pt-2 text-white/40 text-[10px] font-black uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 256-Bit SSL Encrypted
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs font-semibold">
            © {new Date().getFullYear()} BriteSeats Platform. All rights reserved. Designed for concerts and stadium seating.
          </p>
          <div className="flex gap-6 text-white/20 text-[10px] font-black tracking-widest uppercase">
            <span>OFFICIAL TICKETING PARTNER</span>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
