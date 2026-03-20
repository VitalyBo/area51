// app/api/auth/[...nextauth]/route.ts
// NextAuth handler — handles all /api/auth/* routes automatically

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
