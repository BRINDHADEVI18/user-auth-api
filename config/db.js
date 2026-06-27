const { Pool } = require('pg');
//pg postgresql package for nodejs
// pool can have database connection to //reuse them
require('dotenv').config();
// to configure env variables

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.connect()
  .then(() => console.log('PostgreSQL Connected!'))
  .catch(err => console.log('DB Error:', err.message));

module.exports = pool;