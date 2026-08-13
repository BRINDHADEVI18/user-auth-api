const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const validateRequest = require('../middleware/validate');

const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 attempts per IP in that window
  message: { message: 'Too many login attempts, please try again later' }
});


//router.post('/register', register);

router.post('/register', [body('email').isEmail(), body('password').isLength({ min: 6 })], validateRequest, register);
// router.post('/login', loginLimiter, login);

router.post(
  '/login',
  loginLimiter, [ body('email').isEmail().withMessage('Valid email required'), body('password').notEmpty().withMessage('Password is required'),], validateRequest, login);

module.exports = router;