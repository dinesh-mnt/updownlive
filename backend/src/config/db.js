import mongoose from 'mongoose';

import User from '../models/User.js';

const connectDB = async () => {
  try {
    const dbUri = process.env.DATABASE_URI || process.env.MONGODB_URI;
    
    if (!dbUri) {
      console.error('❌ Database connection error: DATABASE_URI is not defined in the environment variables.');
      process.exit(1);
    }

    console.log('🔄 Attempting to connect to MongoDB...');
    
    const conn = await mongoose.connect(dbUri);
    
    console.log(`✅ MongoDB Successfully Connected!`);
    console.log(`🔗 Host: ${conn.connection.host}`);
    console.log(`📂 Database: ${conn.connection.name}`);
    console.log(`📊 State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Error'}`);
    
    // Seed Admin User
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
      if (!adminExists) {
        await User.create({
          name: 'Super Admin',
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
          role: 'admin'
        });
        console.log(`✅ Admin user seeded: ${process.env.ADMIN_EMAIL}`);
      }
    }
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
