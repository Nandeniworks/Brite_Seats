import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar    from "./components/Navbar";
import Footer    from "./components/Footer";
import AuthGuard from "./components/AuthGuard";
import ScrollToTop from "./components/ScrollToTop";
import { ThemeProvider } from "./context/ThemeContext";
import MotionBackground from "./components/MotionBackground";

// Lazy load pages for better performance
const Home      = lazy(() => import("./pages/Home"));
const Booking   = lazy(() => import("./pages/Booking"));
const Events    = lazy(() => import("./pages/Events"));
const Venues    = lazy(() => import("./pages/Venues"));
const Login     = lazy(() => import("./pages/Login"));
const Profile   = lazy(() => import("./pages/Profile"));
const Support   = lazy(() => import("./pages/Support"));
const Pricing   = lazy(() => import("./pages/Pricing"));
const MyTickets = lazy(() => import("./pages/MyTickets"));
const Weather   = lazy(() => import("./pages/Weather"));
const VenueDetail = lazy(() => import("./pages/VenueDetail"));
const TicketView = lazy(() => import("./pages/TicketView"));

// Simple loading fallback that matches the premium aesthetic
const LoadingFallback = () => (
  <div className="flex-1 flex items-center justify-center bg-transparent">
    <div className="w-12 h-12 border-2 border-[#D4AF37]/25 border-t-[#D4AF37] rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <MotionBackground />
      <div className="min-h-screen flex flex-col relative z-10" style={{ backgroundColor: "transparent" }}>
        <Navbar />
        <main className="flex-1 flex flex-col">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/"         element={<Home />}      />
              <Route path="/booking"  element={<AuthGuard><Booking /></AuthGuard>}   />
              <Route path="/my-tickets" element={<AuthGuard><MyTickets /></AuthGuard>} />
              <Route path="/events"    element={<Events />} />
              <Route path="/venues"    element={<Venues />} />
              <Route path="/login"    element={<Login />}     />
              <Route path="/saved"    element={<Navigate to="/events" replace />}     />
              <Route path="/profile"  element={<Profile />}   />
              <Route path="/support"  element={<Support />}   />
              <Route path="/pricing"  element={<Pricing />}   />
              <Route path="/weather"  element={<Weather />}   />
              <Route path="/venue/:id" element={<VenueDetail />} />
              <Route path="/ticket/:ticketId" element={<TicketView />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
