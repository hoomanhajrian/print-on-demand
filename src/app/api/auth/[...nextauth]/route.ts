import NextAuth, { type NextAuthOptions, type Session } from "next-auth";
import { PrismaClient, User } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import { GoogleProfile } from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string; // Add user ID to the JWT token
  }
}

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("No credentials provided");
        }
        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user) {
            throw new Error("User not found.");
          }

          if (!user.password_hash) {
            throw new Error("No password found.");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password_hash
          );

          if (!isPasswordValid) {
            throw new Error("Invalid user or password.");
          }

          return {
            id: user.id, // Include the user ID
            name: user.first_name + " " + user.last_name,
            email: user.email,
            role: user.role,
            image: user.image,
          };
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
    }),
    GoogleProvider({
      clientId: clientId ?? "",
      clientSecret: clientSecret ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "online",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    updateAge: 60 * 60 * 24, // 24 hours
    maxAge: 60 * 60 * 24 * 3, // 3 days
  },
  jwt: {
    maxAge: 60 * 60 * 24, // 1 day
  },
  secret: secret,
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // Add user ID and role to the token
        return {
          ...token,
          name: user.name,
          email: user.email,
          role: (user as User).role,
        };
      }
      if (trigger === "update") {
        token.email = session.email;
      }

      return token;
    },
    async session({ session, token }) {
      // Add the user ID and role to the session object
      if (session.user) {
        session.user.id = token.id as string; // Include the user ID in the session
        session.user.role = token.role as string; // Include the user role in the session
      }
      return session;
    },
    async signIn({ user, account, profile, email }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: {
              email: profile?.email,
            },
          });

          if (!existingUser) {
            // Create a new user with a default role
            const newUser = await prisma.user.create({
              data: {
                first_name: (profile as GoogleProfile)?.given_name || "",
                last_name: (profile as GoogleProfile)?.family_name || "",
                email: profile?.email,
                image: profile?.image,
                role: "USER", // Assign a default role for Google users
              },
            });
            // Merge the newly created user's ID and role into the user object
            user.id = newUser.id;
            (user as User).role = newUser.role;
          } else {
            // If the user exists, ensure the ID and role are on the user object
            user.id = existingUser.id;
            (user as User).role = existingUser.role;
          }
        } catch (error) {
          console.error("Error during Google sign-in:", error);
          return false; // Prevent sign-in on error
        }
      } else if (account?.provider === "credentials") {
        // For credentials, the user object already has the role in the authorize callback
        const credentialUser = await prisma.user.findUnique({
          where: { email: user.email ?? "" },
        });
        if (credentialUser) {
          user.id = credentialUser.id;
          (user as User).role = credentialUser.role;
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/",
    signOut: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
