import express from 'express'; 
import cors from 'cors'; 
import dotenv from 'dotenv';
import connectDB from './db/connect.js';
import cookieParser from 'cookie-parser';

import authRoutes from "./routes/authRoutes.js";

dotenv.config({ path: '../.env' });

const app = express();
const port = process.env.PORT || 5000;
const mongo = process.env.MONGO_URI;

app.use(cookieParser());
app.use(express.json());

const allowedOrigins = process.env.NODE_ENV === 'production'
    ? ['https://your-production-domain.com'] // Replace with your actual domain
    : ['http://localhost:5173'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

connectDB(mongo);

app.use('/api/auth', authRoutes); // All routes starting with /api/auth go to authRoutes
// app.use('/api', apiRoutes); // All routes starting with /api go to apiRoutes

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});