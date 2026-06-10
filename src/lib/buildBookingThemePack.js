import { EVENT_CATEGORIES, getCategoryFromEvent, CUSTOM_EVENT_BACKGROUNDS } from "../data/eventCategories";

/**
 * Builds a comprehensive theme pack for a specific venue or event.
 * Includes visual tokens, intro copy variants, and CSS variables for the entire UI.
 */
export const buildEventThemePack = (eventName = "") => {
  const categoryKey = getCategoryFromEvent(eventName);
  const visuals = EVENT_CATEGORIES[categoryKey];
  const eventKey = eventName.toLowerCase();
  let specificBackgrounds = null;
  
  // Look for direct match or partial match in custom backgrounds
  for (const key in CUSTOM_EVENT_BACKGROUNDS) {
    if (eventKey.includes(key)) {
      specificBackgrounds = CUSTOM_EVENT_BACKGROUNDS[key];
      break;
    }
  }

  const backgrounds = specificBackgrounds || visuals.backgrounds;

  return {
    themeId: categoryKey,
    visuals: visuals,
    heroImageCandidates: backgrounds,
    intro: {
      headline: eventName ? `${eventName.toUpperCase()}` : "FEATURED LIVE EVENTS",
      subtext: eventName 
        ? `Experience the electric ${visuals.vibe.toLowerCase()} atmosphere of this premium live event. Secured bookings by BriteSeats.` 
        : "Golden stadiums, arena lights, and tickets built for fans."
    },
    // CSS Variables to be injected into the Booking shell
    bookingCssVars: {
      "--booking-accent": visuals.accent,
      "--booking-accent-soft": visuals.accentSoft,
      "--booking-gradient-from": visuals.gradientFrom,
      "--booking-gradient-via": visuals.gradientVia,
      "--booking-gradient-to": visuals.gradientTo,
      "--booking-cta": visuals.ctaHue,
      ...visuals.bookingCssVars
    }
  };
};
