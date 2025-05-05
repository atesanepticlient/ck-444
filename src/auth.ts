/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import { db } from "./lib/db";

import authConfig from "./auth.config";

export const { signIn, signOut, auth, handlers } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ token, session }: { token : any; session : any}) {
      if (token.sub && session.user) {
        const user = await db.user.findUnique({
          where: { id: token.sub },
        });

        if (user?.password) {
          user.password = "";
        }

        if (user) {
          session.user = { ...user, emailVerified: new Date(), email: "" };
        }
      }
      return session;
    },
  },
});
