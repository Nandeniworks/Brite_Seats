/**
 * BriteSeats Professional Logger
 * Automatically handles development vs production logging.
 */

const IS_PROD = import.meta.env.PROD;

const logger = {
  log: (...args) => {
    if (!IS_PROD) {
      console.log(' [BRITESEATS LOG]', ...args);
    }
  },
  
  error: (message, error) => {
    // In a real startup, you'd send this to Sentry or LogRocket
    console.error(' [BRITESEATS ERROR]', message, error);
    
    if (IS_PROD) {
      // Logic for production error reporting could go here
    }
  },
  
  info: (...args) => {
    if (!IS_PROD) {
      console.info(' [BRITESEATS INFO]', ...args);
    }
  },

  warn: (...args) => {
    console.warn(' [BRITESEATS WARN]', ...args);
  }
};

export default logger;
