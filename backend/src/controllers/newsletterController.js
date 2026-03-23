import Newsletter from '../models/Newsletter.js';
import pkg from 'nodemailer';
const { createTransport } = pkg;

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (existing.isActive) {
        return res.status(400).json({ message: 'Email is already subscribed' });
      } else {
        existing.isActive = true;
        existing.subscribedAt = new Date();
        await existing.save();
        return res.status(200).json({ message: 'Subscription reactivated successfully' });
      }
    }

    const subscriber = new Newsletter({ email });
    await subscriber.save();
    res.status(201).json({ message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ message: 'Failed to subscribe', error: error.message });
  }
};

export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
    res.status(200).json({ subscribers });
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({ message: 'Failed to fetch subscribers', error: error.message });
  }
};

export const unsubscribe = async (req, res) => {
  try {
    const { id } = req.params;
    const subscriber = await Newsletter.findById(id);
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    
    // Check if already unsubscribed
    if (!subscriber.isActive) {
      return res.status(200).json({ 
        message: 'Already unsubscribed',
        alreadyUnsubscribed: true 
      });
    }
    
    subscriber.isActive = false;
    await subscriber.save();
    res.status(200).json({ 
      message: 'Unsubscribed successfully',
      alreadyUnsubscribed: false 
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ message: 'Failed to unsubscribe', error: error.message });
  }
};

export const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    await Newsletter.findByIdAndDelete(id);
    res.status(200).json({ message: 'Subscriber deleted successfully' });
  } catch (error) {
    console.error('Delete subscriber error:', error);
    res.status(500).json({ message: 'Failed to delete subscriber', error: error.message });
  }
};

export const sendBulkEmail = async (req, res) => {
  try {
    const { subject, title, message } = req.body;
    
    console.log('📧 Send bulk email request received:', { subject, title, messageLength: message?.length });
    
    if (!subject || !title || !message) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ message: 'Subject, title, and message are required' });
    }

    const subscribers = await Newsletter.find({ isActive: true });
    console.log(`📊 Found ${subscribers.length} active subscribers`);
    
    if (subscribers.length === 0) {
      console.log('❌ No active subscribers found');
      return res.status(400).json({ message: 'No active subscribers found' });
    }

    console.log('🔧 Creating email transporter...');
    const transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    console.log('✅ Transporter created, sending emails...');
    const emailPromises = subscribers.map(subscriber => {
      const mailOptions = {
        from: `"UpDownLive" <${process.env.SMTP_USER}>`,
        to: subscriber.email,
        subject: subject,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
              .unsubscribe { color: #3b82f6; text-decoration: none; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 28px;">${title}</h1>
              </div>
              <div class="content">
                <p style="white-space: pre-wrap;">${message}</p>
              </div>
              <div class="footer">
                <p>You're receiving this email because you subscribed to UpDownLive newsletter.</p>
                <p><a href="${process.env.FRONTEND_URL}/unsubscribe/${subscriber._id}" class="unsubscribe">Unsubscribe</a></p>
              </div>
            </div>
          </body>
          </html>
        `
      };
      return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);
    console.log(`✅ Successfully sent ${subscribers.length} emails`);
    
    res.status(200).json({ message: `Email sent successfully to ${subscribers.length} subscribers` });
  } catch (error) {
    console.error('❌ Send bulk email error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      command: error.command
    });
    res.status(500).json({ message: 'Failed to send emails', error: error.message });
  }
};

export const syncUsersToNewsletter = async (req, res) => {
  try {
    console.log('🔄 Starting user sync to newsletter...');
    
    // Import getMongoClient to access Better Auth user collection
    const { getMongoClient } = await import('../config/auth.js');
    const client = await getMongoClient();
    const db = client.db();
    
    // Get all users from Better Auth user collection
    const users = await db.collection('user').find({}).toArray();
    console.log(`📊 Found ${users.length} users in database`);
    
    let syncedCount = 0;
    let skippedCount = 0;
    
    for (const user of users) {
      if (!user.email) {
        console.log(`⚠️ Skipping user without email: ${user.id || user._id}`);
        skippedCount++;
        continue;
      }
      
      // Check if email already exists in newsletter
      const existing = await Newsletter.findOne({ email: user.email });
      
      if (existing) {
        console.log(`⏭️ Email already exists: ${user.email}`);
        skippedCount++;
        continue;
      }
      
      // Add user to newsletter as active subscriber
      const subscriber = new Newsletter({
        email: user.email,
        isActive: true,
        subscribedAt: user.createdAt || new Date()
      });
      
      await subscriber.save();
      console.log(`✅ Synced user: ${user.email}`);
      syncedCount++;
    }
    
    console.log(`🎉 Sync complete: ${syncedCount} added, ${skippedCount} skipped`);
    
    res.status(200).json({
      message: 'User sync completed successfully',
      synced: syncedCount,
      skipped: skippedCount,
      total: users.length
    });
  } catch (error) {
    console.error('❌ Sync users error:', error);
    res.status(500).json({ message: 'Failed to sync users', error: error.message });
  }
};

export default {
  subscribe,
  getSubscribers,
  syncUsersToNewsletter,
  unsubscribe,
  deleteSubscriber,
  sendBulkEmail
};
