import "better-auth/types";

declare module "better-auth/types" {
  interface User {
    role?: string;
    verifiedStatus?: string;
  }
}

// Additional type safety for the auth client response
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role?: string;
  verifiedStatus?: string;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
  image?: string | null;
}
