'use client'

// components/Pagination.tsx
// Page navigation — updates URL page param

import { useRouter } from 'next/navigation'

interface Props {
  currentPage: number
  totalPages: number
  tab: string
  query: string
  danger: string
  status: string
}

export default function Pagination({ currentPage, totalPages, tab, query, danger, status }: Props) {
  const router = useRouter()

  const goTo = (page: number) => {
    const params = new URLSearchParams({ tab, page: String(page) })
    if (query)  params.set('q',      query)
    if (danger) params.set('danger', danger)
    if (status) params.set('status', status)
    router.push(`/dashboard?${params.toString()}`)
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-center gap-1 pt-4">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-sm border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-xs text-zinc-400 transition hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ←
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => goTo(p)}
          className={`rounded-sm border px-3 py-1.5 font-mono text-xs transition ${
            p === currentPage
              ? 'border-red-800 bg-red-950 text-red-400'
              : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-sm border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-xs text-zinc-400 transition hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        →
      </button>
    </div>
  )
}
