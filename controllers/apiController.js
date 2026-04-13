// File: controllers/apiController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });

// 1. Authentication
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (await User.findOne({ email })) return res.status(400).json({ success: false, message: 'User exists' });

        const user = await User.create({ name, email, password });
        res.status(201).json({ success: true, token: generateToken(user._id), user: { name: user.name, email: user.email } });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({ success: true, token: generateToken(user._id), user: { name: user.name, email: user.email } });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// 2. Upload
exports.uploadImage = (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'No image uploaded' });
    res.json({ success: true, message: 'Image uploaded!', imageUrl: req.file.path });
};

// 3. Payment Mockup
exports.processPayment = (req, res) => {
    const { amount, cardNumber } = req.body;
    // 80% chance of success mockup
    const isSuccess = Math.random() > 0.2;

    if (isSuccess) {
        res.json({ success: true, message: 'Payment successful', transactionId: `TXN-${Date.now()}` });
    } else {
        res.status(402).json({ success: false, message: 'Payment declined by bank' });
    }
};