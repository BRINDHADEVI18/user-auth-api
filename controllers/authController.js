const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route  POST /api/auth/register
// @access Public
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check all fields exist
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Please fill all fields' 
      });
    }

    // 2. Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Email already registered' 
      });
    }

    // 3. Hash the password
     // Salt random string added to password         
     // hashing rounds irreversible hashes
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create user in database
    const user = await User.create(name, email, hashedPassword);

    // 5. Create JWT token
    const token = jwt.sign(
      { id: user.id },{role: user.role},
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // 6. Send response
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  POST /api/auth/login
// @access Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check all fields exist
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please fill all fields' 
      });
    }

    // 2. Check if user exists
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        message: 'Invalid credentials' 
      });
    }

    // 4. Create JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // 5. Send response
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login };