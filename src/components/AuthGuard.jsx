import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const currentUser = (() => {
    try {
      const saved = localStorage.getItem("briteseats-current-user");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn("[STABILITY] Corrupted user session data, clearing...", e);
      localStorage.removeItem("briteseats-current-user");
      return null;
    }
  })();
  const [dismissed, setDismissed] = useState(false);

  // If signed in, render the page normally
  if (currentUser) return children;

  // If they dismissed the popup, redirect to login
  if (dismissed) {
    navigate("/login");
    return null;
  }

  // Show the popup overlay instead of the page
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 min-h-screen"
      style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)" }}
    >
      <div
        className="rounded-3xl p-10 max-w-md w-full text-center shadow-2xl border grain-el"
        style={{
          backgroundColor: "var(--cream)",
          borderColor: "rgba(140,120,100,0.2)"
        }}
      >
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: "#d4e6d4" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            style={{ color: "var(--sage)" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>

        {/* Title */}
        <h3
          className="text-2xl font-black uppercase tracking-widest mb-4"
          style={{ color: "var(--ink)" }}
        >
          Sign In Required
        </h3>

        {/* Message */}
        <p
          className="font-medium mb-10 leading-relaxed text-base"
          style={{ color: "var(--ink-muted)" }}
        >
          Please sign in to view your tickets and book your seats.
        </p>

        {/* Ok Button */}
        <button
          onClick={() => setDismissed(true)}
          className="w-full py-4 rounded-xl text-white font-black uppercase tracking-widest transition-all hover:opacity-90 hover:scale-[1.02] shadow-lg"
          style={{ backgroundColor: "var(--ink)" }}
        >
          Ok, Let&apos;s Sign In
        </button>
      </div>
    </div>
  );
};

export default AuthGuard;
