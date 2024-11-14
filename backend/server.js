const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const classRoutes = require('./routes/classRoutes');
const pledgeRoutes = require('./routes/pledgeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { createServer } = require('@vercel/node');
const app = express();

// Load environment variables
require('dotenv').config();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://sep-fund-tracker.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
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

// Export the Express app as a Vercel serverless function
module.exports = createServer(app);
