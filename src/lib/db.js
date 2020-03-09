const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool({
  user: config.db.user,
  host: config.db.host,
  database: config.db.database,
  password: config.db.password,
  port: config.db.port,
});

pool.on('error', console.error);
pool.on('connect', () => {
  console.log('Succesfully connected to database.');
});

pool.connect();

module.exports = pool;
