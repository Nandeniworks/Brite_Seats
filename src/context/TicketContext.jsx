import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { convertToUSD, convertFromUSD } from "../lib/currencyUtils";
import { buildEventThemePack } from "../lib/buildBookingThemePack";
import { generateSchedule } from "../lib/aiSchedule";

const TicketContext = createContext();

export const useTicket = () => {
  return useContext(TicketContext);
};

export const TicketProvider = ({ children }) => {
  const saveToLocal = (key, data) => {
    try {
      localStorage.setItem(`briteseats-${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn(`[STABILITY] Failed to save ${key}`, e);
    }
  };

  const getFromLocal = (key, fallback) => {
    try {
      const saved = localStorage.getItem(`briteseats-${key}`);
      if (!saved) return fallback;
      const parsed = JSON.parse(saved);
      if (Array.isArray(fallback) && !Array.isArray(parsed)) {
        return fallback;
      }
      return parsed;
    } catch (e) {
      console.warn(`[STABILITY] Local parse error for ${key}`, e);
      return fallback;
    }
  };

  const [bookings, setBookings] = useState(
    getFromLocal("bookings", [
      {
        id: "session-coldplay-1",
        venue: {
          name: "Coldplay Music Of The Spheres Tour",
          lat: 51.5560,
          lng: -0.2796,
        },
        budget: 50000,
        currency: "INR",
        schedule: [],
        supportChecks: [
          {
            id: "s1",
            label: "Download mobile ticket QR code",
            category: "Tickets",
            checked: false,
          },
          {
            id: "s2",
            label: "Bring government-issued physical photo ID",
            category: "Requirements",
            checked: false,
          }
        ],
        gallery: [],
        tickets: [],
        savedEvents: [],
        expenses: [],
      },
    ])
  );

  const [activeBookingId, setActiveBookingId] = useState(
    getFromLocal("active-booking-id", "session-coldplay-1")
  );

  const activeBooking = useMemo(() => {
    return (
      bookings.find((b) => b.id === activeBookingId) ||
      bookings[0] || {
        venue: {
          name: "Default",
          lat: 0,
          lng: 0,
        },
        schedule: [],
        tickets: [],
        gallery: [],
        expenses: [],
        budget: 5000,
        currency: "INR",
        supportChecks: [],
        savedEvents: [],
      }
    );
  }, [bookings, activeBookingId]);

  const updateActiveBooking = (updates) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === activeBookingId
          ? { ...booking, ...updates }
          : booking
      )
    );
  };

  useEffect(() => {
    saveToLocal("bookings", bookings);
  }, [bookings]);

  useEffect(() => {
    saveToLocal("active-booking-id", activeBookingId);
  }, [activeBookingId]);

  const createBooking = (name, lat, lng) => {
    const normalizedName = name?.trim();
    if (!normalizedName) return;

    const existing = bookings.find(
      (b) =>
        b.venue?.name?.toLowerCase() ===
        normalizedName.toLowerCase()
    );

    if (existing) {
      setActiveBookingId(existing.id);
      return;
    }

    const newBooking = {
      id: `booking-${Date.now()}`,
      venue: {
        name: normalizedName,
        lat,
        lng,
      },
      budget: 5000,
      currency: "INR",
      schedule: generateSchedule(normalizedName, lat, lng),
      supportChecks: [
        {
          id: "s1",
          label: "Download mobile ticket QR code",
          category: "Tickets",
          checked: false,
        },
        {
          id: "s2",
          label: "Bring government-issued physical ID",
          category: "Requirements",
          checked: false,
        },
      ],
      gallery: [],
      tickets: [],
      savedEvents: [],
      expenses: [],
    };

    setBookings((prev) => {
      const updated = [...prev, newBooking];
      localStorage.setItem("briteseats-bookings", JSON.stringify(updated));
      return updated;
    });

    setActiveBookingId(newBooking.id);
    localStorage.setItem("briteseats-active-booking-id", JSON.stringify(newBooking.id));
  };

  const deleteBooking = (id) => {
    if (!id) return;
    if (bookings.length <= 1) {
      alert("At least one booking session must remain.");
      return;
    }

    setBookings((prevBookings) => {
      const updatedBookings = prevBookings.filter((b) => b.id !== id);
      if (activeBookingId === id) {
        const nextBooking = updatedBookings[0];
        if (nextBooking) {
          setActiveBookingId(nextBooking.id);
          localStorage.setItem("briteseats-active-booking-id", JSON.stringify(nextBooking.id));
        }
      }
      localStorage.setItem("briteseats-bookings", JSON.stringify(updatedBookings));
      return updatedBookings;
    });
  };

  const {
    venue = {
      name: "Default",
      lat: 0,
      lng: 0,
    },
    budget = 5000,
    currency = "INR",
    schedule = [],
    supportChecks = [],
    gallery = [],
    tickets = [],
    savedEvents = [],
    expenses = [],
  } = activeBooking || {};

  const setVenue = (newVenue) => updateActiveBooking({ venue: newVenue });
  const setBudget = (newBudget) => updateActiveBooking({ budget: newBudget });
  const setCurrency = (newCurrency) => updateActiveBooking({ currency: newCurrency });
  const setSchedule = (newSchedule) => updateActiveBooking({ schedule: newSchedule });
  const setGallery = (newGallery) => updateActiveBooking({ gallery: newGallery });
  const setTickets = (newTickets) => updateActiveBooking({ tickets: newTickets });
  const setSavedEvents = (newSavedEvents) => updateActiveBooking({ savedEvents: newSavedEvents });
  const setExpenses = (newExpenses) => updateActiveBooking({ expenses: newExpenses });

  const addTicket = (ticket) => {
    setTickets([...tickets, ticket]);
    return true;
  };

  const removeTicket = (id) => {
    setTickets(tickets.filter((t) => t.id !== id));
  };

  const toggleSavedEvent = (item) => {
    const exists = savedEvents.some((s) => s.id === item.id);
    if (exists) {
      setSavedEvents(savedEvents.filter((s) => s.id !== item.id));
    } else {
      setSavedEvents([...savedEvents, item]);
    }
  };

  const addPlaceToDay = (dayId, placeName, lat = 0, lng = 0) => {
    const newSchedule = schedule.map((day) => {
      if (day.id === dayId) {
        return {
          ...day,
          places: [
            ...day.places,
            {
              id: `p-${Date.now()}`,
              name: placeName,
              time: "TBD",
              note: "",
              lat: lat,
              lng: lng,
            },
          ],
        };
      }
      return day;
    });
    setSchedule(newSchedule);
  };

  const removePlaceFromDay = (dayId, placeId) => {
    const newSchedule = schedule.map((day) => {
      if (day.id === dayId) {
        return {
          ...day,
          places: day.places.filter((p) => p.id !== placeId),
        };
      }
      return day;
    });
    setSchedule(newSchedule);
  };

  const addDay = () => {
    const nextDayNum = schedule.length + 1;
    setSchedule([
      ...schedule,
      {
        id: `day-${Date.now()}`,
        dayNumber: nextDayNum,
        date: `Schedule Segment ${nextDayNum}`,
        places: [],
      },
    ]);
  };

  const regenerateSchedule = () => {
    if (!venue?.name) return;
    const newSchedule = generateSchedule(venue.name, venue.lat, venue.lng);
    setSchedule(newSchedule);
  };

  const addExpense = (exp) => {
    setExpenses([...expenses, { id: `exp-${Date.now()}`, ...exp }]);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const totalExpense = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const eventThemePack = useMemo(() => {
    if (!venue?.name) return null;
    return buildEventThemePack(venue.name);
  }, [venue?.name]);

  const [activePromo, setActivePromo] = useState(
    getFromLocal("active-promo", null)
  );

  const applyPromoCode = (code) => {
    const validPromos = {
      SEATS10: {
        discount: 0.1,
        label: "BriteSeats Welcome Discount",
      },
      VIP25: {
        discount: 0.25,
        label: "VIP Box Special discount",
      },
      GOLDEN: {
        discount: 0.15,
        label: "Golden Ticket Special",
      },
    };

    const promo = validPromos[code.toUpperCase()];
    if (promo) {
      const payload = {
        code: code.toUpperCase(),
        ...promo,
      };
      setActivePromo(payload);
      saveToLocal("active-promo", payload);
      return {
        success: true,
        message: `Promo applied: ${promo.label}`,
      };
    }
    return {
      success: false,
      message: "Invalid promo code",
    };
  };

  useEffect(() => {
    saveToLocal("active-promo", activePromo);
  }, [activePromo]);

  const updatePhotoCaption = (id, caption) => {
    setGallery(
      gallery.map((photo) =>
        photo.id === id ? { ...photo, caption } : photo
      )
    );
  };

  const deletePhoto = (id) => {
    setGallery(gallery.filter((photo) => photo.id !== id));
  };

  const toggleSupportCheck = (id) => {
    const updated = supportChecks.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    updateActiveBooking({ supportChecks: updated });
  };

  const addSupportCheck = (item) => {
    const newItem = {
      id: `s-${Date.now()}`,
      label: item.label,
      category: item.category,
      checked: false,
    };
    updateActiveBooking({ supportChecks: [...supportChecks, newItem] });
  };

  const deleteSupportCheck = (id) => {
    const updated = supportChecks.filter((item) => item.id !== id);
    updateActiveBooking({ supportChecks: updated });
  };

  const value = {
    bookings,
    activeBookingId,
    setActiveBookingId,
    createBooking,
    deleteBooking,

    venue,
    setVenue,

    eventThemePack,

    budget,
    setBudget,

    schedule,
    setSchedule,
    addPlaceToDay,
    removePlaceFromDay,
    addDay,
    regenerateSchedule,

    gallery,
    setGallery,
    updatePhotoCaption,
    deletePhoto,

    tickets,
    setTickets,
    addTicket,
    removeTicket,

    savedEvents,
    setSavedEvents,
    toggleSavedEvent,

    expenses,
    totalExpense,
    addExpense,
    deleteExpense,

    currency,
    setCurrency,

    supportChecks,
    toggleSupportCheck,
    addSupportCheck,
    deleteSupportCheck,

    activePromo,
    applyPromoCode,
    clearPromo: () => setActivePromo(null),
  };

  return (
    <TicketContext.Provider value={value}>
      {children}
    </TicketContext.Provider>
  );
};
