// app/providers.tsx
// Client-side providers wrapper (NextAuth SessionProvider)
// Needs "use client" because SessionProvider uses React context

'use client'

import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
