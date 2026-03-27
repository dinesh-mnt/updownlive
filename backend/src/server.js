import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import userRoutes from './routes/userRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import forexRoutes from './routes/forexRoutes.js';
import goldRoutes from './routes/goldRoutes.js';
import cryptoRoutes from './routes/cryptoRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import economicCalendarRoutes from './routes/economicCalendarRoutes.js';
import connectDB from './config/db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost:5173',
  'https://updownlive.vercel.app',
  'https://updownlive-4778.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (/\.vercel\.app$/.test(origin)) return callback(null, true);
    console.log('CORS blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/forex', forexRoutes);
app.use('/api/gold', goldRoutes);
app.use('/api/crypto', cryptoRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/economic-calendar', economicCalendarRoutes);

app.get('/', (_req, res) => {
  res.json({
    message: 'UpDownLive API is running',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.get('/health', (_req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusText = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' }[dbStatus] || 'unknown';
  res.json({
    status: dbStatus === 1 ? 'healthy' : 'unhealthy',
    mongoose: dbStatusText,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

if (process.env.NODE_ENV !== 'test' && process.env.VERCEL !== '1') {
  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await connectDB();
  });
}

export default app;
