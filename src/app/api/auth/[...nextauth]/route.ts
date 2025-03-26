import NextAuth, { type NextAuthOptions } from "next-auth";
import { PrismaClient, User } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

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
  ],

  session: {
    strategy: "jwt",
    updateAge: 60 * 60 * 24, // 24 hours
    maxAge: 60 * 60 * 24 * 3, // 3 days
    // async encode() {},
    // async decode() {},
  },
  secret: secret,
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        return {
          ...token,
          id: user.id,
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
    async session({ session }) {
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
