import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { TicketProvider } from "./context/TicketContext";
import SeatMapErrorBoundary from "./components/SeatMapErrorBoundary";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <TicketProvider>
        <App />
      </TicketProvider>
    </BrowserRouter>
  </React.StrictMode>
);
