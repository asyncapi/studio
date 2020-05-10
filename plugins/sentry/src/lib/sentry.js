const Sentry = require('@sentry/node');
const sentry = module.exports;

let isInitialized = false;

function isDevelopment() {
  return !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
}

sentry.init = (config) => {
  if (isDevelopment() || isInitialized) return;
  Sentry.init({
    dsn: config.plugins.sentry.dsn,
    environment: process.env.NODE_ENV || 'development',
  });
  isInitialized = true;
};

sentry.captureException = (error) => {
  if (isDevelopment() || !isInitialized) return;
  Sentry.captureException(error);
};

sentry.captureMessage = (reason, severity) => {
  if (isDevelopment() || !isInitialized) return;
  Sentry.captureMessage(reason, severity);
};

sentry.setUser = (user) => {
  if (!user) return Sentry.setUser(null);
  Sentry.setUser({ id: user.id, email: user.email });
};


