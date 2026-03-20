// app/dashboard/error.tsx
// Error boundary for the dashboard — shown when page.tsx throws

'use client'

import { useEffect } from 'react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-2">
        <p className="font-mono text-xs tracking-widest text-red-500 uppercase">
          System Error
        </p>
        <h2 className="font-mono text-2xl font-bold text-zinc-100">
          Connection Failed
        </h2>
        <p className="max-w-sm text-sm text-zinc-500">
          {error.message || 'Unable to retrieve classified data. Check your connection and try again.'}
        </p>
      </div>

      <button
        onClick={reset}
        className="rounded-sm border border-zinc-700 bg-zinc-900 px-6 py-2 font-mono text-sm text-zinc-100 transition-all hover:border-red-500 hover:text-red-400"
      >
        Retry
      </button>
    </div>
  )
}
