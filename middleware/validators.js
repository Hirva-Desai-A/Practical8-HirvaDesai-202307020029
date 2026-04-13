// File: middleware/validators.js
const { body, validationResult } = require('express-validator');

exports.validateRegister = [
  body('name', 'Name is required').notEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password must be 6 or more characters').isLength({ min: 6 })
];

exports.validatePayment = [
  body('amount', 'Amount is required and must be a number').isNumeric(),
  body('cardNumber', 'Card must be 16 digits').isLength({ min: 16, max: 16 })
];

exports.checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};