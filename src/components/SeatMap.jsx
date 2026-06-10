import React, { useState } from "react";
import { cn } from "../lib/utils";

const SeatMap = ({ seatGrid, selectedSeats, handleSeatClick, isF1 }) => {
  const [focusedSeat, setFocusedSeat] = useState(null);

  const handleKeyDown = (e) => {
    let currentFocus = focusedSeat || { rIdx: 0, cIdx: 0 };
    let { rIdx, cIdx } = currentFocus;
    const numRows = seatGrid.length;
    const numCols = seatGrid[0].length;

    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        rIdx = Math.max(0, rIdx - 1);
        break;
      case "ArrowDown":
        e.preventDefault();
        rIdx = Math.min(numRows - 1, rIdx + 1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        cIdx = Math.max(0, cIdx - 1);
        break;
      case "ArrowRight":
        e.preventDefault();
        cIdx = Math.min(numCols - 1, cIdx + 1);
        break;
      case "Enter":
        e.preventDefault();
        const seatToSelect = seatGrid[rIdx][cIdx];
        handleSeatClick(seatToSelect.id, seatToSelect.reserved);
        break;
      case "Escape":
        e.preventDefault();
        const seatToDeselect = seatGrid[rIdx][cIdx];
        if (selectedSeats.includes(seatToDeselect.id)) {
          handleSeatClick(seatToDeselect.id, false);
        }
        break;
      default:
        return;
    }
    setFocusedSeat({ rIdx, cIdx });
  };

  const handleSeatClickWrapper = (seatId, reserved, rIdx, cIdx) => {
    setFocusedSeat({ rIdx, cIdx });
    handleSeatClick(seatId, reserved);
  };

  return (
    <div 
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={() => {
        if (!focusedSeat) setFocusedSeat({ rIdx: 0, cIdx: 0 });
      }}
      className="cream-card grain-el p-6 md:p-8 space-y-8 text-left outline-none focus:ring-2 focus:ring-[#D4AF37]/30 rounded-[24px]"
    >
      <div className="flex items-center justify-between border-b border-black/5 pb-2">
        <div className="space-y-1">
          <h3 className="text-xl font-black text-ink font-serif" style={{ fontFamily: "Playfair Display, serif" }}>
            2. Select Your Seats
          </h3>
          <p className="text-[10px] text-ink-muted font-bold">
            Interactive Seat Map. Use Arrow keys + Enter to book, Esc to deselect.
          </p>
        </div>
        <span className={cn(
          "text-[10px] font-black uppercase bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/20",
          isF1 && "bg-red-500/10 border-red-500/20 text-red-500"
        )}>
          {selectedSeats.length} Selected
        </span>
      </div>

      {/* Stadium Screen/Stage/Track Indicator */}
      <div className="w-full flex flex-col items-center space-y-2">
        <div className="w-[85%] h-2.5 bg-ink/30 dark:bg-white/20 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)]" />
        <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">
          {isF1 ? "START / FINISH STRAIGHT" : "STAGE / PITCH"}
        </span>
      </div>

      {/* Seating Sections Container */}
      <div className="space-y-6">
        
        {/* VIP / F1 Elite Hospitality Section */}
        <div className={cn(
          "border border-[#D4AF37]/20 rounded-2xl p-4 bg-[#D4AF37]/5 space-y-3",
          isF1 && "border-red-500/20 bg-red-500/5 text-white"
        )}>
          <div className="flex justify-between items-center">
            <span className={cn("text-xs font-black uppercase tracking-wider", isF1 ? "text-red-500" : "text-[#D4AF37]")}>
              {isF1 ? "Elite Hospitality (Paddock & Champions)" : "VIP Lounge (Rows A - B)"}
            </span>
            <span className={cn("text-[10px] font-black", isF1 ? "text-red-500/80" : "text-[#D4AF37]/80")}>
              {isF1 ? "Trackside & Lounge Pass" : "Premium Experience"}
            </span>
          </div>
          <div className="flex flex-col gap-2.5 items-center overflow-x-auto py-2">
            {seatGrid.slice(0, 2).map((row, rIdx) => (
              <div key={rIdx} className="flex gap-2.5 items-center">
                <span className={cn(
                  "w-16 text-[9px] font-black flex items-center justify-start uppercase tracking-wider",
                  isF1 ? "text-red-500" : "text-[#D4AF37]"
                )}>
                  {isF1 ? (row[0].row === "A" ? "Paddock" : "Champions") : `Row ${row[0].row}`}
                </span>
                {row.map((seat, cIdx) => {
                  const isSelected = selectedSeats.includes(seat.id);
                  const isFocused = focusedSeat && focusedSeat.rIdx === rIdx && focusedSeat.cIdx === cIdx;
                  return (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatClickWrapper(seat.id, seat.reserved, rIdx, cIdx)}
                      disabled={seat.reserved}
                      className={cn(
                        "w-8 h-8 rounded-lg text-[9px] font-black transition-all flex items-center justify-center border",
                        seat.reserved 
                          ? "bg-red-500/25 border-red-500/10 text-red-500 cursor-not-allowed" 
                          : isSelected
                            ? isF1 
                              ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20 scale-105"
                              : "bg-[#D4AF37] border-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 scale-105"
                            : "bg-[#FAF8F3] dark:bg-[#1C1C1C] border-black/5 hover:border-[#D4AF37] text-ink",
                        isFocused && (isF1 
                          ? "border-2 border-black dark:border-white ring-4 ring-red-500/50 scale-110 z-10"
                          : "border-2 border-black dark:border-white ring-4 ring-[#D4AF37]/50 scale-110 z-10"
                        )
                      )}
                      title={seat.reserved ? `Seat ${seat.id} (Booked)` : `Seat ${seat.id} (Available)`}
                    >
                      {seat.col}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Premium / F1 Grandstands Section */}
        <div className={cn(
          "border border-indigo-500/20 rounded-2xl p-4 bg-indigo-500/5 space-y-3",
          isF1 && "border-red-500/20 bg-red-500/5 text-white"
        )}>
          <div className="flex justify-between items-center">
            <span className={cn("text-xs font-black uppercase tracking-wider", isF1 ? "text-red-500" : "text-indigo-400")}>
              {isF1 ? "Grandstands (Pit Lane & Turn 1)" : "Premium Stand (Rows C - D)"}
            </span>
            <span className={cn("text-[10px] font-black", isF1 ? "text-red-500/80" : "text-indigo-400/80")}>
              {isF1 ? "Action Corners & Pit Lane" : "Elevated Views"}
            </span>
          </div>
          <div className="flex flex-col gap-2.5 items-center overflow-x-auto py-2">
            {seatGrid.slice(2, 4).map((row, rIdxOffset) => {
              const rIdx = rIdxOffset + 2;
              return (
                <div key={rIdx} className="flex gap-2.5 items-center">
                  <span className={cn(
                    "w-16 text-[9px] font-black flex items-center justify-start uppercase tracking-wider",
                    isF1 ? "text-red-500" : "text-indigo-400"
                  )}>
                    {isF1 ? (row[0].row === "C" ? "Pit Lane" : "Turn 1") : `Row ${row[0].row}`}
                  </span>
                  {row.map((seat, cIdx) => {
                    const isSelected = selectedSeats.includes(seat.id);
                    const isFocused = focusedSeat && focusedSeat.rIdx === rIdx && focusedSeat.cIdx === cIdx;
                    return (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClickWrapper(seat.id, seat.reserved, rIdx, cIdx)}
                        disabled={seat.reserved}
                        className={cn(
                          "w-8 h-8 rounded-lg text-[9px] font-black transition-all flex items-center justify-center border",
                          seat.reserved 
                            ? "bg-red-500/25 border-red-500/10 text-red-500 cursor-not-allowed" 
                            : isSelected
                              ? isF1 
                                ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20 scale-105"
                                : "bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20 scale-105"
                              : "bg-[#FAF8F3] dark:bg-[#1C1C1C] border-black/5 hover:border-indigo-500/50 text-ink",
                          isFocused && (isF1 
                            ? "border-2 border-black dark:border-white ring-4 ring-red-500/50 scale-110 z-10"
                            : "border-2 border-black dark:border-white ring-4 ring-indigo-500/50 scale-110 z-10"
                          )
                        )}
                        title={seat.reserved ? `Seat ${seat.id} (Booked)` : `Seat ${seat.id} (Available)`}
                      >
                        {seat.col}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* General / F1 Main Grandstand Section */}
        <div className={cn(
          "border border-emerald-500/20 rounded-2xl p-4 bg-emerald-500/5 space-y-3",
          isF1 && "border-red-500/20 bg-red-500/5 text-white"
        )}>
          <div className="flex justify-between items-center">
            <span className={cn("text-xs font-black uppercase tracking-wider", isF1 ? "text-red-500" : "text-emerald-400")}>
              {isF1 ? "Main Grandstand (Row E)" : "General Stand (Row E)"}
            </span>
            <span className={cn("text-[10px] font-black", isF1 ? "text-red-500/80" : "text-emerald-400/80")}>
              {isF1 ? "Start/Finish Straight" : "Standard Seating"}
            </span>
          </div>
          <div className="flex flex-col gap-2.5 items-center overflow-x-auto py-2">
            {seatGrid.slice(4, 5).map((row, rIdxOffset) => {
              const rIdx = rIdxOffset + 4;
              return (
                <div key={rIdx} className="flex gap-2.5 items-center">
                  <span className={cn(
                    "w-16 text-[9px] font-black flex items-center justify-start uppercase tracking-wider",
                    isF1 ? "text-red-500" : "text-emerald-400"
                  )}>
                    {isF1 ? "Main GP" : `Row ${row[0].row}`}
                  </span>
                  {row.map((seat, cIdx) => {
                    const isSelected = selectedSeats.includes(seat.id);
                    const isFocused = focusedSeat && focusedSeat.rIdx === rIdx && focusedSeat.cIdx === cIdx;
                    return (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClickWrapper(seat.id, seat.reserved, rIdx, cIdx)}
                        disabled={seat.reserved}
                        className={cn(
                          "w-8 h-8 rounded-lg text-[9px] font-black transition-all flex items-center justify-center border",
                          seat.reserved 
                            ? "bg-red-500/25 border-red-500/10 text-red-500 cursor-not-allowed" 
                            : isSelected
                              ? isF1 
                                ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20 scale-105"
                                : "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-105"
                              : "bg-[#FAF8F3] dark:bg-[#1C1C1C] border-black/5 hover:border-emerald-500/50 text-ink",
                          isFocused && (isF1 
                            ? "border-2 border-black dark:border-white ring-4 ring-red-500/50 scale-110 z-10"
                            : "border-2 border-black dark:border-white ring-4 ring-emerald-500/50 scale-110 z-10"
                          )
                        )}
                        title={seat.reserved ? `Seat ${seat.id} (Booked)` : `Seat ${seat.id} (Available)`}
                      >
                        {seat.col}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-6 text-[10px] font-black uppercase tracking-widest pt-2 border-t border-black/5">
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-[#FAF8F3] dark:bg-[#1C1C1C] border border-black/5" />
          Available
        </div>
        {isF1 ? (
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-red-500" />
            Selected Grandstand
          </div>
        ) : (
          <>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-[#D4AF37]" />
              Selected (VIP)
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-indigo-500" />
              Selected (Premium)
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-emerald-500" />
              Selected (General)
            </div>
          </>
        )}
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-red-500/20 border border-red-500/20 text-red-500 flex items-center justify-center font-bold text-[8px]" />
          Booked
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
