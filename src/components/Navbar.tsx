'use client'

// components/Navbar.tsx
// Top navigation bar — shows links and user session

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/dashboard',  label: 'Dashboard' },
  { href: '/anomalies',  label: 'Anomalies' },
  { href: '/artifacts',  label: 'Artifacts' },
]

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  // Hide navbar on login / landing pages
  if (!session) return null

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/dashboard" className="font-mono text-sm font-bold text-zinc-100 tracking-widest">
          AREA<span className="text-red-500">51</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden gap-6 sm:flex">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`font-mono text-xs tracking-wider uppercase transition-colors ${
                pathname.startsWith(href)
                  ? 'text-red-400'
                  : 'text-zinc-500 hover:text-zinc-200'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* User + Sign out */}
        <div className="flex items-center gap-4">
          <span className="hidden font-mono text-xs text-zinc-500 sm:block">
            {session.user?.email}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="font-mono text-xs text-zinc-500 transition-colors hover:text-red-400"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
