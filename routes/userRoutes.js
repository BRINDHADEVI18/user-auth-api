const express = require('express');
const router = express.Router();
const protect = require('../middleware/protect');
const {
  getProfile,
  getAllUsers,
  getMe,
  updateUser,
  deleteUser
} = require('../controllers/userController');

router.get('/profile', protect, getProfile);
router.get('/', protect, getAllUsers);
router.get('/me',protect,getMe);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);

module.exports = router;