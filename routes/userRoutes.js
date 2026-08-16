const express = require('express');
const router = express.Router();
const protect = require('../middleware/protect');
const authorizeRoles = require('../middleware/roleMiddleware');
const {
  getProfile,
  getAllUsers,
  getMe,
  updateUser,
  deleteUser
} = require('../controllers/userController');

router.get('/profile', protect, getProfile);
router.get('/all', protect,authorizeRoles('admin'),  getAllUsers);
router.get('/me',protect,getMe);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect,authorizeRoles('admin'), deleteUser);

module.exports = router;