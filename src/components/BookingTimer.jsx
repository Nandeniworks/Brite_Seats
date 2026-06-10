import React, { useState, useEffect } from "react";
import { Clock, AlertTriangle } from "lucide-react";

const BookingTimer = ({ durationSeconds = 600, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isCritical = timeLeft < 120; // less than 2 minutes

  return (
    <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border backdrop-blur-md transition-all duration-300 w-fit ${
      isCritical 
        ? "bg-red-500/10 border-red-500/30 text-red-500 animate-pulse" 
        : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-ink"
    }`}>
      {isCritical ? <AlertTriangle className="w-4 h-4 text-red-500 animate-bounce" /> : <Clock className="w-4 h-4 text-[#D4AF37]" />}
      <div>
        <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Seating Lock Session</p>
        <p className="text-sm font-black tracking-tight">{formatTime(timeLeft)}</p>
      </div>
    </div>
  );
};

export default BookingTimer;
