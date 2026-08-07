const { Pool } = require('pg');
//pg postgresql package for nodejs
// pool can have database connection to //reuse them
require('dotenv').config();
// to configure env variables

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
  rejectUnauthorized: false
}
});

pool.connect()
  .then(() => console.log('PostgreSQL Connected!'))
  .catch(err => console.log('DB Error:', err.message));

module.exports = pool;