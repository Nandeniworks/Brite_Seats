import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ALL_EVENTS } from "../data/eventImages";
import EventCard from "../components/EventCard";
import { Search, Calendar, MapPin, Tag, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";

export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "All";
  const activeTab = categoryParam;
  
  const setActiveTab = (tab) => {
    if (tab === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: tab });
    }
  };

  const [searchQuery, setSearchQuery] = useState("");

  // Filter and search events
  const filteredEvents = useMemo(() => {
    return ALL_EVENTS.filter((event) => {
      const matchesCategory = activeTab === "All" || event.category === activeTab;
      const matchesSearch = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="relative min-h-screen bg-[#FAF5EB] dark:bg-[#0A0A0A] text-ink transition-colors duration-500 pb-24 text-left">
      {/* Visual background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 py-32 max-w-6xl relative z-10 space-y-12">
        {/* Header */}
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37] dark:text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em] rounded-full w-fit">
            <Sparkles className="w-3.5 h-3.5" /> EXPLORE LIVE EVENTS
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight" style={{ fontFamily: "Playfair Display, serif" }}>
            Upcoming Concerts & Sports
          </h1>
          <p className="text-sm font-medium text-ink-muted leading-relaxed">
            Discover and book verified front-row tickets for major worldwide stadium tours, football cups, and premier cricket matches.
          </p>
        </div>

        {/* Filter and Search Bar Row */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white/45 dark:bg-[#111111]/45 backdrop-blur-md p-4 rounded-[28px] border border-black/5 dark:border-white/5">
          {/* Categories Tab Selector */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 w-fit">
            {["All", "Concerts", "Football", "Cricket", "Formula 1"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                  activeTab === tab
                    ? "bg-white dark:bg-[#242424] shadow-md text-[#B8860B] dark:text-[#D4AF37]"
                    : "text-ink-muted opacity-50 hover:opacity-100"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted opacity-50" />
            <input
              type="text"
              placeholder="Search by artist, team, venue, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-12 pr-4 bg-white/50 dark:bg-black/45 border border-black/5 dark:border-white/5 rounded-2xl text-xs font-bold focus:outline-none focus:border-[#B8860B] dark:focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Event Grid */}
        {filteredEvents.length === 0 ? (
          <div className="cream-card grain-el p-16 text-center space-y-4 max-w-xl mx-auto rounded-[32px] border border-black/5 dark:border-white/5">
            <p className="text-4xl">🎟️</p>
            <h3 className="font-black text-2xl" style={{ fontFamily: "Playfair Display, serif" }}>
              No matches found
            </h3>
            <p className="text-xs font-medium text-ink-muted">
              We couldn't find any events matching "{searchQuery}" in the category "{activeTab}". Try checking your spelling or selecting another section.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
