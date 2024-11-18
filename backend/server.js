const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const classRoutes = require('./routes/classRoutes');
const pledgeRoutes = require('./routes/pledgeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const app = express();

// Load environment variables
require('dotenv').config();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://sep-fund-tracker.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/classes', classRoutes);
app.use('/api/pledges', pledgeRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.status(200).send('SEP Tracker Backend');
});

// Only export the app for serverless environments
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  module.exports = app; // If using Vercel's serverless environment
}).catch(err => {
  console.error('Failed to connect to database:', err);
});