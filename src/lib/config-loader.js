const dotenv = require('dotenv');

/**
 * Overrides a config object with the values from environment variables, if found.
 *
 * @param  {Object} cfg Config object
 * @param  {String} prefix Key prefix
 */
function overrideWithEnvVars(cfg, prefix) {
  const env = process.env;

  prefix = prefix || '';

  for (const key in cfg) {
    const fullKey = prefix + key.toUpperCase();

    if (typeof cfg[key] === 'object' && cfg[key] !== null && !Array.isArray(cfg[key])) {
      overrideWithEnvVars(cfg[key], `${fullKey}_`);
    } else {
      if (!(fullKey in env)) continue;

      let value = env[fullKey];

      if (typeof cfg[key] === 'boolean') {
        value = value === 'true';
      } else if (typeof cfg[key] === 'number') {
        value = parseInt(value, 10);
      } else if (Array.isArray(cfg[key])) {
        value = JSON.parse(value);
      }

      cfg[key] = value;
    }
  }
}

module.exports = (config, dotenvConfig) => {
  dotenv.config(dotenvConfig);
  overrideWithEnvVars(config);
};
