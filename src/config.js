/**
 * BriteSeats Global Configuration
 * Centralized place for all app-wide constants and environment-specific settings.
 */

export const APP_CONFIG = {
  NAME: 'BriteSeats',
  SLOGAN: 'Premium Stadium Seat Booking Platform',
  VERSION: '1.0.0-release',
  CONTACT_EMAIL: 'hello@briteseats.com',
  SOCIAL: {
    TWITTER: 'https://twitter.com/briteseats',
    INSTAGRAM: 'https://instagram.com/briteseats',
  },
  DEFAULT_THEME: 'neon', // Default theme if none matched
  API_ENDPOINTS: {
    // Future expansion
    // WEATHER: import.meta.env.VITE_WEATHER_API_URL,
  }
};

export const UI_CONFIG = {
  ANIMATION_SPEED: 0.3,
  GLASS_OPACITY: 0.8,
  MODAL_TRANSITION: {
    type: "spring",
    stiffness: 300,
    damping: 30
  }
};
