import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

let mongoClient = null;

export async function getMongoClient() {
  if (!mongoClient) {
    mongoClient = new MongoClient(process.env.DATABASE_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    await mongoClient.connect();
  }
  return mongoClient;
}

export function createAuth() {
  if (!process.env.DATABASE_URI) {
    throw new Error('DATABASE_URI is not defined in environment variables');
  }

  const client = new MongoClient(process.env.DATABASE_URI, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });
  const db = client.db();

  const isProduction = process.env.NODE_ENV === 'production';
  const isVercel = process.env.VERCEL === '1';
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  return betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000/api/auth",
    database: mongodbAdapter(db, {
      client
    }),
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // Only update session once per day (reduces DB writes)
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // Cache for 5 minutes
      },
    },
    // Advanced configuration for production cookie handling
    // Using the recommended 'advanced' pattern from Better Auth docs
    advanced: {
      // Force secure cookies in production OR Vercel environment
      useSecureCookies: isProduction || isVercel,
      cookiePrefix: "better-auth",
      // Default attributes for all cookies
      defaultCookieAttributes: {
        httpOnly: true,
        // Vital for Vercel/Render deployments behind load balancers
        secure: isProduction || isVercel,
        // For cross-domain (frontend on domain A, backend on domain B),
        // sameSite MUST be "none" in production with secure: true
        sameSite: isProduction || isVercel ? "none" : "lax",
        path: "/",
      },
    },
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        // Better Auth handles the redirect URI automatically based on baseURL
        prompt: "select_account",
        accessType: "offline",
      },
    },
    user: {
      additionalFields: {
        role: {
          type: "string",
          defaultValue: "user",
        },
        verifiedStatus: {
          type: "string",
          defaultValue: "pending",
        },
      },
    },
    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            const adminEmail = process.env.ADMIN_EMAIL?.replace(/"/g, '');
            if (user.email === adminEmail) {
              const client = await getMongoClient();
              await client.db().collection('user').updateOne(
                { id: user.id },
                { $set: { role: 'admin' } }
              );
            }
          }
        }
      }
    },
    trustedOrigins: [
      frontendUrl,
      "http://localhost:3000",
      "http://localhost:5000",
      "https://updownlive.vercel.app",
      "https://updownlive-4778.vercel.app",
      /\.vercel\.app$/
    ].filter(Boolean),
  });
}
