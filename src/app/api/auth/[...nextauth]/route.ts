import NextAuth, { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user?.password_hash) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );

        if (!isPasswordValid) {
          return null;
        }

        // Any object returned will be saved in `user` property of the JWT
        return {
          id: user.id,
          name: user.first_name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, user }) {
      const dbUser = await prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });

      if (!dbUser) {
        throw new Error("User not found in database");
      }

      session.user = {
        id: dbUser.id,
        name: dbUser.first_name,
        email: dbUser.email,
        role: dbUser.role,
      };

      return session;
    },
  },
  pages: {
    signIn: "/", // Specify custom sign-in page
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };