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

  return betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000/api/auth",
    database: mongodbAdapter(db, {
      client
    }),
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
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
          defaultValue: "pending", // pending, approved, rejected
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
      process.env.FRONTEND_URL || "http://localhost:3000",
      "https://updownlive-4778.vercel.app"
    ],
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5, // 5 minutes
      },
    },
    advanced: {
      cookieOptions: {
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        path: "/",
      }
    }
  });
}
