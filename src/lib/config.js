require('dotenv').config();
const config = require('../../config/common.json');
const env = process.env;
override_with_env_vars(config);

/**
 * Overrides a config object with the values from environment variables, if found.
 *
 * @param  {Object} cfg Config object
 * @param  {String} prefix Key prefix
 */
function override_with_env_vars(cfg, prefix) {
  prefix = prefix || '';
  for (const key in cfg) {
    const full_key = prefix + key.toUpperCase();

    if (typeof cfg[key] === 'object' && cfg[key] !== null) {
      override_with_env_vars(cfg[key], `${full_key}_`);
    } else {
      if (!(full_key in env)) continue;

      let value = env[full_key];

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

module.exports = config;
