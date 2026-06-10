import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ticket, Eye, EyeOff, LogIn } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Login = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // login | signup
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    if (mode === "signup") {
      if (!form.name) { setError("Name is required."); return; }
      
      const users = JSON.parse(localStorage.getItem("briteseats_users") || "[]");
      if (users.find((u) => u.email === form.email)) {
        setError("An account with this email already exists.");
        return;
      }
      const newUser = { name: form.name, email: form.email, password: form.password };
      localStorage.setItem("briteseats_users", JSON.stringify([...users, newUser]));
      localStorage.setItem("briteseats-current-user", JSON.stringify({ name: form.name, email: form.email }));
      navigate("/");
    } else {
      // Login
      const users = JSON.parse(localStorage.getItem("briteseats_users") || "[]");
      const found = users.find((u) => u.email === form.email && u.password === form.password);
      if (!found) {
        setError("Invalid email or password.");
        return;
      }
      localStorage.setItem("briteseats-current-user", JSON.stringify({ name: found.name, email: found.email }));
      navigate("/");
    }
  };
 
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16 bg-[#FAF5EB] dark:bg-[#121212] transition-colors duration-500"
    >
      {/* Decorative blobs */}
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: "var(--sage)", filter: "blur(80px)" }} />
      <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full opacity-10 pointer-events-none"
        style={{ background: "var(--lavender)", filter: "blur(70px)" }} />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-black shadow-xl">
            <Ticket className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <h1 className="text-3xl font-black text-ink" style={{ color: "var(--ink)", fontFamily: "Playfair Display, serif" }}>
            BriteSeats
          </h1>
          <p className="text-sm font-medium mt-1 text-ink-muted">
            Your premium gate pass to live events
          </p>
        </div>

        {/* Card */}
        <div className="cream-card grain-el p-8">
          {/* Mode Toggle */}
          <div className="flex rounded-2xl p-1 mb-8"
            style={{ backgroundColor: "var(--cream-dark)", border: "1.5px solid rgba(212,175,55,0.15)" }}>
            {["login", "signup"].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-200"
                style={mode === m ? {
                  backgroundColor: "var(--cream-light)",
                  color: "var(--ink)",
                  boxShadow: "0 2px 8px rgba(100,80,60,0.15), inset 0 1px 0 rgba(255,255,255,0.6)"
                } : { color: "var(--ink-muted)" }}
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-ink-muted">Your Name</label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  className="cream-input w-full h-12 px-4 text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-ink-muted">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="cream-input w-full h-12 px-4 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-ink-muted">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="cream-input w-full h-12 px-4 pr-12 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-80 text-ink"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm font-semibold text-red-600 bg-red-50 rounded-xl px-4 py-2.5 border border-red-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full h-12 text-sm mt-2 flex items-center justify-center gap-2 font-black rounded-xl transition-all hover:scale-[1.02] text-black"
              style={{
                backgroundColor: "var(--sage)"
              }}
            >
              <LogIn className="w-4 h-4" />
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Demo hint */}
          <p className="text-center text-xs mt-6 text-ink-muted">
            {mode === "login" ? (
              <>No account yet?{" "}
                <button onClick={() => setMode("signup")} className="font-bold underline underline-offset-2">Sign up</button>
              </>
            ) : (
              <>Already have one?{" "}
                <button onClick={() => setMode("login")} className="font-bold underline underline-offset-2">Sign in</button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
