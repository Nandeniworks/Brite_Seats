# BriteSeats: Premium Event Ticket Booking Platform

BriteSeats is a modern, premium web application designed to help users browse live events, select seats from interactive stadium maps, purchase tickets, manage bookings, and download digital entry passes. Built with React and CSS variables, it offers a stunning, responsive user interface with rich aesthetics (dark and light modes).

## Key Features

*   **Interactive Seat Booking Map**: Select seats from VIP, Premium, and General Admission sections using a detailed stadium map. Features a live seat status display and color-coded grid selection.
*   **Active Booking Countdown Timer**: Safe session lock with a 10-minute expiry countdown to hold selected seats during checkout.
*   **Promo and Discount Management**: Support for premium codes (e.g., SEATS10, VIP25) with live order breakdown calculations.
*   **Game Day Support & Checklists**: Accordion FAQ guidelines (stadium rules, bag policies) and interactive checklist trackers for entry requirements.
*   **Event Photo Journal**: Document and download live memories in a cinematic photobook timeline, complete with Instagram-ready story downloads.
*   **Live Stadium Maps**: Integrated Leaflet emergency and safety zoning maps for MetLife, Wembley, Camp Nou, and other partner venues.

## Tech Stack

*   **Frontend Framework**: React.js
*   **Build Tool**: Vite
*   **Styling**: CSS (Custom tokens, animations, dark/light modes)
*   **Routing**: React Router DOM
*   **Icons**: Lucide React
*   **State/Theme Management**: React Context API (`EventContext`, `ThemeContext`)

## Architecture & Structure

*   `src/components/`: Reusable components (e.g. `Navbar`, `Footer`, `SeatMap`, `BookingSidebar`, `BookingTimer`, `SupportCenter`).
*   `src/context/`: Global state management for event bookings, tickets, and application themes.
*   `src/pages/`: Main application views (`Home`, `Booking`, `Events`, `MyTickets`, `Support`, `Journal`, `Profile`, `Login`).
*   `src/lib/`: Theme pack builders, AI schedule generators, and currency utilities.

## Project Notes

This application uses localStorage to persist active ticket booking sessions, purchases, and saved events, keeping state consistent across navigation routes.
