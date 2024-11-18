import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import classRoutes from './routes/classRoutes.js';
import pledgeRoutes from './routes/pledgeRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
// app.use(cors({
//   origin: ['http://localhost:5173', 'https://sep-fund-tracker.vercel.app'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
// }));

const corsOptions = {
  origin: ['http://localhost:5173', 'https://sep-fund-tracker.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

// Routes
app.use('/api/classes', classRoutes);
app.use('/api/pledges', pledgeRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.status(200).send('SEP Tracker Backend');
});

// Mongoose connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
.then(() => {
  console.log('Connected to MongoDB');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});

export default app;


// {
//   "version": 2,
//   "builds": [
//     {
//       "src": "backend/server.js",
//       "use": "@vercel/node"
//     }
//   ],
//   "routes": [
//     {
//       "src": "/(.*)",
//       "dest": "backend/server.js"
//     }
//   ]
// }
