const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const config = require('../lib/config');
const redis = require('../lib/redis-client');

const redisClient = redis.create();

module.exports = session({
  store: new RedisStore({ client: redisClient }),
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    domain: config.api.hostname,
  },
});
