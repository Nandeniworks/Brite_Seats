import React from "react";
import { Check, Zap, Star, Shield, Crown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTicket } from "../context/TicketContext";
import { cn } from "../lib/utils";

const Pricing = () => {
  const { eventThemePack } = useTicket();
  const accentColor = eventThemePack?.visuals?.accent || "var(--sage)";

  const plans = [
    {
      name: "Fan",
      tagline: "For the casual event-goer",
      price: "0",
      features: [
        "Up to 5 saved events",
        "Standard queue booking access",
        "Digital QR entry passes",
        "Upcoming event email alerts",
        "Standard venue seat mappings",
      ],
      icon: Zap,
      buttonText: "Stay Free",
      popular: false,
    },
    {
      name: "BriteSeats Pro",
      tagline: "For the dedicated music & sports fan",
      price: "499",
      features: [
        "Unlimited saved events",
        "Early access ticket pre-sales",
        "10% off service fee bookings",
        "3D venue seat sightline visualizer",
        "Unlimited Event Journal photo uploads",
        "Custom ticket theme passes",
      ],
      icon: Crown,
      buttonText: "Start 7-Day Free Trial",
      popular: true,
    },
    {
      name: "VIP Elite",
      tagline: "The ultimate live pass experience",
      price: "1,499",
      features: [
        "Everything in Pro plan",
        "1-on-1 VIP hospitality concierge",
        "Pre-show lounge hospitality access",
        "Artist meet & greet queue alerts",
        "Autographed memorabilia entries",
        "Early ticket queues bypass",
      ],
      icon: Star,
      buttonText: "Get Elite Access",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 bg-[#FAF5EB] dark:bg-[#121212] transition-colors duration-500" style={{ backgroundColor: "var(--cream)" }}>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <div 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2"
            style={{ backgroundColor: `${accentColor}33`, color: "var(--ink)" }}
          >
            <Shield className="w-3 h-3" />
            Flexible Premium Tiers
          </div>
          <h1 
            className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-ink"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Book Seats Without <span className="italic">Limits</span>.
          </h1>
          <p className="text-lg text-ink-muted max-w-2xl mx-auto font-medium">
            Choose the membership that elevates your live experience. From casual gigs to premium stadium hospitality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <div
                key={i}
                className={cn(
                  "relative p-8 rounded-[2rem] border transition-all duration-500 hover:scale-[1.02] flex flex-col justify-between",
                  plan.popular 
                    ? "shadow-2xl border-black/10 z-10 scale-105 bg-white dark:bg-[#1C1C1C]" 
                    : "border-black/5 shadow-xl hover:shadow-2xl bg-white/70 dark:bg-[#1C1C1C]/70"
                )}
              >
                {plan.popular && (
                  <div 
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg"
                    style={{ backgroundColor: accentColor, color: "black" }}
                  >
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="mb-8">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                      style={{ backgroundColor: `${accentColor}22` }}
                    >
                      <Icon className="w-6 h-6 text-ink" />
                    </div>
                    <h3 className="text-2xl font-black mb-1 text-ink">{plan.name}</h3>
                    <p className="text-sm text-ink-muted font-medium">{plan.tagline}</p>
                  </div>

                  <div className="mb-8 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-ink">₹{plan.price}</span>
                    <span className="text-ink-muted text-sm font-bold">/ month</span>
                  </div>

                  <div className="space-y-4 mb-10">
                    {plan.features.map((feature, j) => (
                      <div key={j} className="flex items-start gap-3 text-left">
                        <div 
                          className="mt-1 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${accentColor}44` }}
                        >
                          <Check className="w-2.5 h-2.5 text-ink" />
                        </div>
                        <span className="text-sm font-medium leading-tight text-ink-muted">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  className={cn(
                    "w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 group mt-auto",
                    plan.popular ? "btn-ink shadow-lg" : "border-2 border-black/10 dark:border-white/10 hover:border-black/20"
                  )}
                  style={plan.popular ? { backgroundColor: "var(--ink)", color: "white" } : { color: "var(--ink)" }}
                >
                  {plan.buttonText}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-20 p-10 rounded-[3rem] text-center border border-black/5 dark:border-white/5 bg-white/40 dark:bg-white/5 backdrop-blur-sm shadow-xl">
          <h4 className="text-xl font-black mb-2 text-ink">Need a custom plan for your group?</h4>
          <p className="text-ink-muted mb-6 font-medium">We offer custom boxes, group ticket reservations, and corporate hospitality packages.</p>
          <a 
            href="mailto:support@briteseats.com" 
            className="font-black text-sm underline underline-offset-4 decoration-2 hover:opacity-70 transition-opacity text-ink"
          >
            Contact our Sales Team
          </a>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
