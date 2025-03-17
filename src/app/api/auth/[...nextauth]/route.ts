import NextAuth, { type NextAuthOptions } from "next-auth";
import { PrismaClient, $Enums, User } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email: string;
      role: $Enums.Role;
    };
  }
}
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
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Error in authorize callback:", error);
          throw new Error("An unexpected error occurred.");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    updateAge: 60 * 60 * 24, // 24 hours
    maxAge: 60 * 60 * 24 * 3, // 3 days
    // async encode() {},
    // async decode() {},
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          name: (user as User).first_name + " " + (user as User).last_name,
          email: (user as User).email,
          role: (user as User).role,
        };
      }

      return token;
    },
    async session({ session, token }) {
      return session;
    },
  },
  pages: {
    signIn: "/",
    signOut: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
