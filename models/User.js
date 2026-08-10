const pool = require('../config/db');

// User table is already created in the db
// we are creating new user 
const User = {

  // Create new user
  create: async (name, email, password) => {
    const result = await pool.query(
      `INSERT INTO users 
       (name, email, password,role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [name, email, password, 'user']
    );
    return result.rows[0];
  },

  // Find user by email
  findByEmail: async (email) => {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },

  // Find user by id
  findById: async (id) => {
    const result = await pool.query(
      `SELECT id, name, email, created_at 
       FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Get all users
  findAll: async () => {
    const result = await pool.query(
      `SELECT id, name, email, created_at 
       FROM users`
    );
    return result.rows;
  },

  // Update user
  update: async (id, name, email) => {
    const result = await pool.query(
      `UPDATE users 
       SET name = $1, email = $2 
       WHERE id = $3 
       RETURNING *`,
      [name, email, id]
    );
    return result.rows[0];
  },

  // Delete user
  delete: async (id) => {
    await pool.query(
      'DELETE FROM users WHERE id = $1',
      [id]
    );
    return { message: 'User deleted successfully' };
  }

};

module.exports = User;