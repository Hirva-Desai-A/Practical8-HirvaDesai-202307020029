// File: server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path'); // <-- Included correctly at the top
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

// --- 🛠️ THE VERCEL 404 FIX 🛠️ ---
// Explicitly tell Vercel to load index.html when someone visits the main URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// ----------------------------------

// 3. Routes
app.use('/api', apiRoutes);

// 4. Global Error Handler
app.use((err, req, res, next) => {
  res.status(500).json({ success: false, message: err.message });
});

// 5. Server Setup (Modified for Vercel)
const PORT = process.env.PORT || 5000;

// Only listen locally. Vercel will handle the port automatically in production!
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// Export the app for Vercel to read
module.exports = app;