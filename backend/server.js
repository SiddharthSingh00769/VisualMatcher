// File: backend/server.js
// Description: This is the main server file. It sets up Express,
// connects to the database, and uses the API routes.

// -----------------------------------------------------------------------------
// Module Imports
// -----------------------------------------------------------------------------
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; // Import the cookie-parser middleware
import connectDB from './db/connect.js';
import apiRoutes from './routes/apiRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Load environment variables from a .env file located in the project root
dotenv.config({ path: '../.env' });

// -----------------------------------------------------------------------------
// Server Setup and Configuration
// -----------------------------------------------------------------------------
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware setup
// Add the cookie-parser middleware first
app.use(cookieParser());
// Then use the express.json() middleware
app.use(express.json());
// Configure CORS to allow credentials from the frontend origin
app.use(cors({
    origin: 'http://localhost:5173', // The exact origin of your frontend
    credentials: true, // This is crucial for sending/receiving cookies
}));

// -----------------------------------------------------------------------------
// Database Connection
// -----------------------------------------------------------------------------
connectDB(MONGO_URI);

// -----------------------------------------------------------------------------
// API Routes
// -----------------------------------------------------------------------------
// Direct incoming requests to the appropriate route files
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Root route to check if the server is running
app.get('/', (req, res) => {
    res.send('Visual Product Matcher Backend is running!');
});

// -----------------------------------------------------------------------------
// Server Start
// -----------------------------------------------------------------------------
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
