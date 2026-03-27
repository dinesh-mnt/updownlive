import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import connectDB from '../config/db.js';

async function initAdmin() {
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL?.replace(/"/g, '');
  const adminPassword = process.env.ADMIN_PASSWORD?.replace(/"/g, '');

  if (!adminEmail || !adminPassword) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  try {
    const existing = await User.findOne({ email: adminEmail });

    if (existing) {
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save();
        console.log('Updated existing user to admin:', adminEmail);
      } else {
        console.log('Admin already exists:', adminEmail);
      }
    } else {
      await User.create({ name: 'Admin', email: adminEmail, password: adminPassword, role: 'admin' });
      console.log('Admin user created:', adminEmail);
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

initAdmin();
