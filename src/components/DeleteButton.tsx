'use client'

// components/DeleteButton.tsx
// Reusable delete button used on both anomaly and artifact detail pages

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  id: string
  type: 'anomalies' | 'artifacts'
  redirectTo: string
}

export default function DeleteButton({ id, type, redirectTo }: Props) {
  const router = useRouter()
  const [confirm, setConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleDelete = async () => {
    setLoading(true)
    setError('')

    const res = await fetch(`/api/${type}/${id}`, { method: 'DELETE' })

    if (!res.ok) {
      const json = await res.json()
      setError(json.error || 'Delete failed.')
      setLoading(false)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-zinc-500">Sure?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="rounded-sm border border-red-800 bg-red-950 px-3 py-2 font-mono text-xs text-red-400 transition hover:bg-red-900 disabled:opacity-50"
        >
          {loading ? '…' : 'Yes, delete'}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="rounded-sm border border-zinc-700 px-3 py-2 font-mono text-xs text-zinc-400 transition hover:border-zinc-500"
        >
          Cancel
        </button>
        {error && <p className="font-mono text-xs text-red-400">{error}</p>}
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 font-mono text-xs text-zinc-500 transition hover:border-red-800 hover:text-red-400"
    >
      Delete
    </button>
  )
}
