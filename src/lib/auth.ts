// lib/auth.ts
// NextAuth configuration — Google OAuth only
// Exported separately so it can be imported by both
// app/api/auth/[...nextauth]/route.ts and server components

import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // Custom pages — redirect to our branded login page
  pages: {
    signIn: '/login',
  },

  callbacks: {
    // Add the user's email to the session so we can track who created records
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },

    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
  },
}
