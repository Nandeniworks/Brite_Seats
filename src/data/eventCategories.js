export const EVENT_CATEGORIES = {
  neon: {
    accent: "#D4AF37", // Gold
    accentSoft: "rgba(212, 175, 55, 0.1)",
    gradientFrom: "#581c87", // Purple Concert vibe
    gradientVia: "#8b5cf6",
    gradientTo: "#d946ef",
    ctaHue: "#D4AF37",
    backgrounds: [
      "/assets/events/concert-coldplay.jpg",
      "/assets/events/concert-weeknd.jpg",
      "/assets/events/concert-diljit.jpg"
    ],
    vibe: "Concert Arena Live",
    bookingCssVars: {
      "--booking-accent": "#D4AF37",
      "--booking-border": "rgba(212, 175, 55, 0.18)",
      "--booking-card-shadow": "0 8px 32px rgba(212, 175, 55, 0.08)",
      "--booking-btn-gradient": "linear-gradient(135deg, #581c87, #8b5cf6)"
    }
  },
  luxury: {
    accent: "#D4AF37", // Gold
    accentSoft: "rgba(212, 175, 55, 0.1)",
    gradientFrom: "#1e3a8a", // Navy Cricket vibe
    gradientVia: "#3b82f6",
    gradientTo: "#60a5fa",
    ctaHue: "#D4AF37",
    backgrounds: [
      "/assets/events/cricket-ipl.jpg",
      "/assets/events/cricket-indpak.jpg",
      "/assets/events/cricket-wtc.jpg"
    ],
    vibe: "Cricket Grandstand",
    bookingCssVars: {
      "--booking-accent": "#D4AF37",
      "--booking-border": "rgba(212, 175, 55, 0.18)",
      "--booking-card-shadow": "0 8px 32px rgba(212, 175, 55, 0.08)",
      "--booking-btn-gradient": "linear-gradient(135deg, #1e3a8a, #3b82f6)"
    }
  },
  urban: {
    accent: "#D4AF37", // Gold
    accentSoft: "rgba(212, 175, 55, 0.1)",
    gradientFrom: "#064e3b", // Pitch Green Football vibe
    gradientVia: "#059669",
    gradientTo: "#34d399",
    ctaHue: "#D4AF37",
    backgrounds: [
      "/assets/events/football-fifa.jpg",
      "/assets/events/football-ucl.jpg",
      "/assets/events/football-elclasico.jpg"
    ],
    vibe: "Stadium Grand Pitch",
    bookingCssVars: {
      "--booking-accent": "#064e3b",
      "--booking-border": "rgba(212, 175, 55, 0.18)",
      "--booking-card-shadow": "0 8px 32px rgba(212, 175, 55, 0.08)",
      "--booking-btn-gradient": "linear-gradient(135deg, #064e3b, #059669)"
    }
  },
  f1: {
    accent: "#D4AF37", // Gold
    accentSoft: "rgba(212, 175, 55, 0.1)",
    gradientFrom: "#ef4444", // Red F1 vibe
    gradientVia: "#b91c1c",
    gradientTo: "#7f1d1d",
    ctaHue: "#ef4444",
    backgrounds: [
      "/assets/events/f1-silverstone.jpg",
      "/assets/events/f1-spa.jpg",
      "/assets/events/f1-monza.jpg",
      "/assets/events/f1-singapore.jpg",
      "/assets/events/f1-yasmarina.jpg"
    ],
    vibe: "F1 Grand Prix",
    bookingCssVars: {
      "--booking-accent": "#ef4444",
      "--booking-border": "rgba(239, 68, 68, 0.18)",
      "--booking-card-shadow": "0 8px 32px rgba(239, 68, 68, 0.08)",
      "--booking-btn-gradient": "linear-gradient(135deg, #ef4444, #b91c1c)"
    }
  }
};

export const CUSTOM_EVENT_BACKGROUNDS = {
  coldplay: ["/assets/events/concert-coldplay.jpg"],
  weeknd: ["/assets/events/concert-weeknd.jpg"],
  diljit: ["/assets/events/concert-diljit.jpg"],
  arijit: ["/assets/events/concert-arijit.jpg"],
  dualipa: ["/assets/events/concert-dualipa.jpg"],
  sheeran: ["/assets/events/concert-edsheeran.jpg"],
  dragons: ["/assets/events/concert-imaginedragons.jpg"],
  bts: ["/assets/events/concert-bts.jpg"],
  fifa: ["/assets/events/football-fifa.jpg"],
  ucl: ["/assets/events/football-ucl.jpg"],
  "el clasico": ["/assets/events/football-elclasico.jpg"],
  "manchester united": ["/assets/events/football-manutd.png"],
  arsenal: ["/assets/events/football-arsenal.png"],
  bayern: ["/assets/events/football-bayern.png"],
  dortmund: ["/assets/events/football-bayern.png"],
  "india vs pakistan": ["/assets/events/cricket-indpak.jpg"],
  ipl: ["/assets/events/cricket-ipl.jpg"],
  wtc: ["/assets/events/cricket-wtc.png"],
  micsk: ["/assets/events/cricket-micsk.png"],
  "mumbai indians": ["/assets/events/cricket-micsk.png"],
  metlife: ["/assets/venues/metlife.jpg"],
  wembley: ["/assets/venues/wembley.jpg"],
  campnou: ["/assets/venues/campnou.jpg"],
  bernabeu: ["/assets/venues/bernabeu.jpg"],
  modi: ["/assets/venues/modi.jpg"],
  dypatil: ["/assets/venues/dypatil.jpg"],
  emirates: ["/assets/venues/emirates.png"],
  oldtrafford: ["/assets/venues/oldtrafford.png"],
  allianz: ["/assets/venues/allianz.png"],
  wankhede: ["/assets/venues/wankhede.png"],
  lords: ["/assets/venues/lords.png"],
  silverstone: ["/assets/events/f1-silverstone.jpg"],
  spa: ["/assets/events/f1-spa.jpg"],
  "belgian grand prix": ["/assets/events/f1-spa.jpg"],
  monza: ["/assets/events/f1-monza.jpg"],
  "italian grand prix": ["/assets/events/f1-monza.jpg"],
  singapore: ["/assets/events/f1-singapore.jpg"],
  "singapore grand prix": ["/assets/events/f1-singapore.jpg"],
  "abu dhabi": ["/assets/events/f1-yasmarina.jpg"],
  "yas marina": ["/assets/events/f1-yasmarina.jpg"]
};

export const HOME_DEFAULT_BACKGROUND = "/assets/venues/wembley.jpg";

export const getCategoryFromEvent = (eventName = "") => {
  const name = eventName.toLowerCase();
  if (name.includes("grand prix") || name.includes("silverstone") || name.includes("spa-francorchamps") || name.includes("monza") || name.includes("marina bay") || name.includes("yas marina") || name.includes("f1") || name.includes("belgian") || name.includes("british") || name.includes("italian") || name.includes("singapore") || name.includes("abu dhabi")) {
    return "f1";
  }
  if (name.includes("concert") || name.includes("coldplay") || name.includes("arijit") || name.includes("diljit") || name.includes("weeknd") || name.includes("lipa") || name.includes("sheeran") || name.includes("dragons") || name.includes("bts")) {
    return "neon";
  }
  if (name.includes("cricket") || name.includes("pakistan") || name.includes("ipl") || name.includes("wtc") || name.includes("modi") || name.includes("patil") || name.includes("micsk") || name.includes("mumbai") || name.includes("csk") || name.includes("indians") || name.includes("kings") || name.includes("lords") || name.includes("wankhede")) {
    return "luxury";
  }
  if (name.includes("football") || name.includes("fifa") || name.includes("ucl") || name.includes("madrid") || name.includes("liverpool") || name.includes("chelsea") || name.includes("stadium") || name.includes("bayern") || name.includes("dortmund") || name.includes("emirates") || name.includes("trafford") || name.includes("allianz")) {
    return "urban";
  }
  return "neon";
};
