const User = require('../models/User');

// @route  GET /api/users/profile
// @access Private
const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      message: 'Profile fetched successfully',
      user: req.user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/users
// @access Private
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    res.status(200).json({
      message: 'Users fetched successfully',
      count: users.length,
      users
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  PUT /api/users/:id
// @access Private
const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const { id } = req.params;

    // 1. Check fields exist
    if (!name || !email) {
      return res.status(400).json({
        message: 'Please provide name and email'
      });
    }

    // 2. Check user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // 3. Check if email already taken
    const emailTaken = await User.findByEmail(email);
    if (emailTaken && emailTaken.id != id) {
      return res.status(400).json({
        message: 'Email already in use'
      });
    }

    // 4. Update user
    const updatedUser = await User.update(id, name, email);

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  DELETE /api/users/:id
// @access Private
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Check user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // 2. Delete user
    await User.delete(id);

    res.status(200).json({
      message: 'User deleted successfully'
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProfile,
  getAllUsers,
  updateUser,
  deleteUser
};