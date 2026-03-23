import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { toNodeHandler } from 'better-auth/node';
import { createAuth, getMongoClient } from './config/auth.js';
import settingsRoutes from './routes/settingsRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import userRoutes from './routes/userRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import forexRoutes from './routes/forexRoutes.js';
import goldRoutes from './routes/goldRoutes.js';
import cryptoRoutes from './routes/cryptoRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import connectDB from './config/db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// trust proxy is required for secure cookies on Vercel
app.set('trust proxy', 1);

// Initialize Better Auth
const auth = createAuth();

// Initialize admin user on startup
async function initializeAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL?.replace(/"/g, '');
  const adminPassword = process.env.ADMIN_PASSWORD?.replace(/"/g, '');
  
  if (!adminEmail || !adminPassword) {
    console.log('Skipping admin initialization - credentials not set');
    return;
  }
  
  try {
    const client = await getMongoClient();
    const db = client.db();
    const usersCollection = db.collection('user');
    
    const existingUser = await usersCollection.findOne({ email: adminEmail });
    
    if (!existingUser) {
      console.log('Creating admin user...');
      await auth.api.signUpEmail({
        body: {
          email: adminEmail,
          password: adminPassword,
          name: 'Admin'
        }
      });
      // Explicitly set role for newly created admin via API
      await usersCollection.updateOne({ email: adminEmail }, { $set: { role: 'admin' } });
      console.log('✓ Admin user created:', adminEmail);
    } else if (existingUser.role !== 'admin') {
      console.log('Updating existing user to admin status...');
      await usersCollection.updateOne({ email: adminEmail }, { $set: { role: 'admin' } });
      console.log('✓ Admin role assigned to:', adminEmail);
    } else {
      console.log('✓ Admin user already exists with correct role');
    }
  } catch (error) {
    console.error('Error initializing admin:', error.message);
  }
}

// CORS configuration with dynamic origin checking
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost:5173',
  'https://updownlive.vercel.app',
  'https://updownlive-4778.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or same-origin)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Check if origin matches Vercel pattern
    if (/\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    
    console.log('❌ CORS blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Better Auth routes (must be before express.json())
app.all("/api/auth/*", toNodeHandler(auth));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/settings', settingsRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/forex', forexRoutes);
app.use('/api/gold', goldRoutes);
app.use('/api/crypto', cryptoRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/comments', commentRoutes);

app.get('/', (_req, res) => {
  res.json({ 
    message: 'UpDownLive API is running',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Health check endpoint
app.get('/health', async (_req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusText = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  }[dbStatus] || 'unknown';

  let betterAuthDbStatus = 'unknown';
  try {
    const client = await getMongoClient();
    // Use ping to verify actual connectivity for MongoClient
    await client.db().command({ ping: 1 });
    betterAuthDbStatus = 'connected';
  } catch (err) {
    betterAuthDbStatus = 'error: ' + err.message;
  }

  const isHealthy = dbStatus === 1 && betterAuthDbStatus === 'connected';

  res.json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    mongoose: dbStatusText,
    betterAuth: betterAuthDbStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

if (process.env.NODE_ENV !== 'test' && process.env.VERCEL !== '1') {
  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await connectDB();
    await initializeAdmin();
  });
}

// Export for Vercel functions
export default app;
