import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { TicketProvider } from "./context/TicketContext";
import { ChatProvider } from "./context/ChatContext";
import SeatMapErrorBoundary from "./components/SeatMapErrorBoundary";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <TicketProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </TicketProvider>
    </BrowserRouter>
  </React.StrictMode>
);
