const express = require('express');
const router = express.Router();
const protect = require('../middleware/protect');
const {
  getProfile,
  getAllUsers,
  updateUser,
  deleteUser
} = require('../controllers/userController');

router.get('/profile', protect, getProfile);
router.get('/', protect, getAllUsers);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);

module.exports = router;