import React, { createContext, useContext, useState, useEffect } from "react";

const ChatContext = createContext();

const LOCAL_STORAGE_KEY = "briteseats_support_chat_messages";
const LOCAL_STORAGE_STATE_KEY = "briteseats_support_chat_state";

const getFormattedTime = () => {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
};

const getWelcomeMessage = () => ({
  id: "welcome-" + Date.now(),
  text: "Hello! Welcome to BriteSeats Support. How can I assist you with your booking, seating, refunds, or tickets today?",
  sender: "bot",
  timestamp: getFormattedTime(),
});

const getBotResponse = (userMessage) => {
  const msg = userMessage.toLowerCase().trim();

  // keywords mapping
  const matchesRefund = msg.includes("refund") || msg.includes("cancel") || msg.includes("cancellation");
  const matchesQR = msg.includes("qr") || msg.includes("code") || msg.includes("scan");
  const matchesTicket = msg.includes("ticket");
  const matchesSeat = msg.includes("seat");
  const matchesVenue = msg.includes("venue") || msg.includes("stadium");
  const matchesPayment = msg.includes("payment");
  const matchesTransfer = msg.includes("transfer");
  const matchesMarketplace = msg.includes("marketplace");
  const matchesSupport = msg.includes("support") || msg.includes("help");

  if (matchesRefund) {
    return "Refund requests may be submitted up to 24 hours before the event. Please provide your ticket ID.";
  }
  if (matchesQR) {
    return "Please ensure your ticket QR code is visible and valid. You can also download a fresh copy from My Tickets.";
  }
  if (matchesPayment) {
    return "BriteSeats currently simulates booking workflows. Payment processing is not enabled.";
  }
  if (matchesTransfer) {
    return "Ticket transfer requests can be managed from the My Tickets section.";
  }
  if (matchesMarketplace) {
    return "Tickets listed for resale can be found in the Marketplace section.";
  }
  if (matchesTicket) {
    return "Your tickets can be viewed from the My Tickets section after booking confirmation.";
  }
  if (matchesSeat) {
    return "Seat availability depends on the venue and event. Premium and General categories may have different pricing.";
  }
  if (matchesVenue) {
    return "Venue details, capacity, and available events can be viewed from the Venues section.";
  }
  if (matchesSupport) {
    return "I'm here to help. Please describe your issue.";
  }

  return "Thank you for contacting BriteSeats Support. A support specialist would normally review this request. For this demo, please try asking about tickets, QR codes, refunds, venues, seating, transfers, or bookings.";
};

export function ChatProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);

  // Load state and messages on mount
  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        // Init with welcome message
        setMessages([getWelcomeMessage()]);
      }

      const storedState = localStorage.getItem(LOCAL_STORAGE_STATE_KEY);
      if (storedState) {
        const { open, minimized } = JSON.parse(storedState);
        setIsOpen(open);
        setIsMinimized(minimized);
      }
    } catch (e) {
      console.error("Error loading chat state from localStorage:", e);
      setMessages([getWelcomeMessage()]);
    }
  }, []);

  // Save messages to localStorage when updated
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Save visibility state to localStorage
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_STATE_KEY,
      JSON.stringify({ open: isOpen, isMinimized: isMinimized })
    );
  }, [isOpen, isMinimized]);

  const openChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const restoreChat = () => {
    setIsMinimized(false);
  };

  const clearChat = () => {
    const freshWelcome = getWelcomeMessage();
    setMessages([freshWelcome]);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([freshWelcome]));
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;

    const userMsg = {
      id: "user-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
      text: text,
      sender: "user",
      timestamp: getFormattedTime(),
    };

    // Append user message immediately
    setMessages((prev) => [...prev, userMsg]);

    // Trigger bot typing delay
    setIsTyping(true);

    setTimeout(() => {
      const responseText = getBotResponse(text);
      const botMsg = {
        id: "bot-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
        text: responseText,
        sender: "bot",
        timestamp: getFormattedTime(),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200); // 1.2s delay for typing animation
  };

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        isMinimized,
        isTyping,
        messages,
        openChat,
        closeChat,
        minimizeChat,
        restoreChat,
        clearChat,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
