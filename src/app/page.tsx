// app/page.tsx
// Landing page — shown to unauthenticated users

import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  // If already logged in — go straight to dashboard
  const session = await getServerSession(authOptions)
  if (session) redirect('/dashboard')

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">

      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 text-center">

        {/* Classification banner */}
        <p className="font-mono text-xs tracking-[0.3em] text-red-500 uppercase">
          ⬛ Top Secret — Classified
        </p>

        {/* Title */}
        <div className="flex flex-col gap-2">
          <h1 className="font-mono text-5xl font-bold tracking-tight text-zinc-100 sm:text-7xl">
            AREA<span className="text-red-500">51</span>
          </h1>
          <p className="font-mono text-lg text-zinc-400 tracking-widest uppercase">
            Asset Tracker
          </p>
        </div>

        {/* Description */}
        <p className="max-w-md text-zinc-500 leading-relaxed">
          Classified system for tracking anomalous entities and artifacts.
          Authorized personnel only.
        </p>

        {/* CTA */}
        <Link
          href="/login"
          className="mt-2 inline-flex items-center gap-2 rounded-sm border border-zinc-700 bg-zinc-900 px-8 py-3 font-mono text-sm text-zinc-100 transition-all hover:border-red-500 hover:text-red-400"
        >
          Request Access →
        </Link>

        {/* Stats */}
        <div className="mt-8 flex gap-12 text-center">
          {[
            { label: 'Anomalies', value: '247' },
            { label: 'Artifacts', value: '1,084' },
            { label: 'Active Breaches', value: '3' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-mono text-2xl font-bold text-zinc-100">{stat.value}</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
