const redis = require('redis');
const config = require('./config');

module.exports.create = () => {
  const redisClient = redis.createClient({
    host: config.session.host,
    port: config.session.port,
    password: config.session.password || undefined,
    db: 1,
  });
  redisClient.unref();
  redisClient.on('error', console.error);

  return redisClient;
};
