// File: routes/apiRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../config/cloudinary');
const { protect } = require('../middleware/auth');
const { validateRegister, validatePayment, checkValidation } = require('../middleware/validators');
const { register, login, uploadImage, processPayment } = require('../controllers/apiController');

// Auth Routes
router.post('/register', validateRegister, checkValidation, register);
router.post('/login', login);

// Upload Route (Protected)
router.post('/upload', protect, upload.single('image'), uploadImage);

// Payment Route (Protected & Validated)
router.post('/payment', protect, validatePayment, checkValidation, processPayment);

module.exports = router;