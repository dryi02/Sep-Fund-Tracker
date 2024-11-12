const express = require('express');
const cors = require('cors');  // Import the cors package
const connectDB = require('./config/db');  // Import the DB connection
const classRoutes = require('./routes/classRoutes');  // Import the class routes
const pledgeRoutes = require('./routes/pledgeRoutes');  // Import the pledge routes
const adminRoutes = require('./routes/adminRoutes');  // Import the admin routes
const app = express();

// Load environment variables
require('dotenv').config();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://sep-fund-tracker.vercel.app/'],  // Replace this with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization']  // Specify allowed headers
}));

app.use(express.json());

// Routes
app.use('/api/classes', classRoutes);  // Use class routes
app.use('/api/pledges', pledgeRoutes);  // Use pledge routes
app.use('/api/admin', adminRoutes);  // Use admin routes

app.get('/', (req, res) => {
  res.status(200).send('SEP Tracker Backend');
});

// Set the server to listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
