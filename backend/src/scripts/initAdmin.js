import dotenv from 'dotenv';
dotenv.config();

import { MongoClient } from 'mongodb';

async function initAdmin() {
  const client = new MongoClient(process.env.DATABASE_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('user');
    const accountsCollection = db.collection('account');
    
    const adminEmail = process.env.ADMIN_EMAIL?.replace(/"/g, '');
    const adminPassword = process.env.ADMIN_PASSWORD?.replace(/"/g, '');
    
    if (!adminEmail || !adminPassword) {
      console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env file');
      process.exit(1);
    }
    
    // Check if admin already exists
    const existingUser = await usersCollection.findOne({ email: adminEmail });
    
    if (existingUser) {
      console.log('Admin user already exists:', adminEmail);
      return;
    }
    
    // Create admin user using Better Auth
    const { createAuth } = await import('../config/auth.js');
    const auth = createAuth();
    
    const result = await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: 'Admin'
      }
    });
    
    console.log('Admin user created successfully:', adminEmail);
    
  } catch (error) {
    console.error('Error initializing admin:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

initAdmin();
