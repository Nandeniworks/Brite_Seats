export const EVENT_CATEGORIES = {
  neon: {
    accent: "#D4AF37", // Gold
    accentSoft: "rgba(212, 175, 55, 0.1)",
    gradientFrom: "#581c87", // Purple Concert vibe
    gradientVia: "#8b5cf6",
    gradientTo: "#d946ef",
    ctaHue: "#D4AF37",
    backgrounds: [
      "/src/assets/events/concert-coldplay.jpg",
      "/src/assets/events/concert-weeknd.jpg",
      "/src/assets/events/concert-diljit.jpg"
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
      "/src/assets/events/cricket-ipl.jpg",
      "/src/assets/events/cricket-indpak.jpg",
      "/src/assets/events/cricket-wtc.jpg"
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
      "/src/assets/events/football-fifa.jpg",
      "/src/assets/events/football-ucl.jpg",
      "/src/assets/events/football-elclasico.jpg"
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
      "/src/assets/events/f1-silverstone.jpg",
      "/src/assets/events/f1-spa.jpg",
      "/src/assets/events/f1-monza.jpg",
      "/src/assets/events/f1-singapore.jpg",
      "/src/assets/events/f1-yasmarina.jpg"
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
  coldplay: ["/src/assets/events/concert-coldplay.jpg"],
  weeknd: ["/src/assets/events/concert-weeknd.jpg"],
  diljit: ["/src/assets/events/concert-diljit.jpg"],
  arijit: ["/src/assets/events/concert-arijit.jpg"],
  dualipa: ["/src/assets/events/concert-dualipa.jpg"],
  sheeran: ["/src/assets/events/concert-edsheeran.jpg"],
  dragons: ["/src/assets/events/concert-imaginedragons.jpg"],
  bts: ["/src/assets/events/concert-bts.jpg"],
  fifa: ["/src/assets/events/football-fifa.jpg"],
  ucl: ["/src/assets/events/football-ucl.jpg"],
  "el clasico": ["/src/assets/events/football-elclasico.jpg"],
  "manchester united": ["/src/assets/events/football-manutd.png"],
  arsenal: ["/src/assets/events/football-arsenal.png"],
  bayern: ["/src/assets/events/football-bayern.png"],
  dortmund: ["/src/assets/events/football-bayern.png"],
  "india vs pakistan": ["/src/assets/events/cricket-indpak.jpg"],
  ipl: ["/src/assets/events/cricket-ipl.jpg"],
  wtc: ["/src/assets/events/cricket-wtc.png"],
  micsk: ["/src/assets/events/cricket-micsk.png"],
  "mumbai indians": ["/src/assets/events/cricket-micsk.png"],
  metlife: ["/src/assets/venues/metlife.jpg"],
  wembley: ["/src/assets/venues/wembley.jpg"],
  campnou: ["/src/assets/venues/campnou.jpg"],
  bernabeu: ["/src/assets/venues/bernabeu.jpg"],
  modi: ["/src/assets/venues/modi.jpg"],
  dypatil: ["/src/assets/venues/dypatil.jpg"],
  emirates: ["/src/assets/venues/emirates.png"],
  oldtrafford: ["/src/assets/venues/oldtrafford.png"],
  allianz: ["/src/assets/venues/allianz.png"],
  wankhede: ["/src/assets/venues/wankhede.png"],
  lords: ["/src/assets/venues/lords.png"],
  silverstone: ["/src/assets/events/f1-silverstone.jpg"],
  spa: ["/src/assets/events/f1-spa.jpg"],
  "belgian grand prix": ["/src/assets/events/f1-spa.jpg"],
  monza: ["/src/assets/events/f1-monza.jpg"],
  "italian grand prix": ["/src/assets/events/f1-monza.jpg"],
  singapore: ["/src/assets/events/f1-singapore.jpg"],
  "singapore grand prix": ["/src/assets/events/f1-singapore.jpg"],
  "abu dhabi": ["/src/assets/events/f1-yasmarina.jpg"],
  "yas marina": ["/src/assets/events/f1-yasmarina.jpg"]
};

export const HOME_DEFAULT_BACKGROUND = "/src/assets/venues/wembley.jpg";

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
