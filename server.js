// File: server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');

const app = express();


// 1. Connect to Database
connectDB();

// 2. Middleware
app.use(helmet({ contentSecurityPolicy: false })); // Disabled for UI testing
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serves our UI

// 3. Routes
app.use('/api', apiRoutes);

// 4. Global Error Handler
app.use((err, req, res, next) => {
  res.status(500).json({ success: false, message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));