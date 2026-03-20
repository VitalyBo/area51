'use client'

// components/SearchBar.tsx
// Search input — updates URL query params on submit

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  tab: string
  currentQuery: string
}

export default function SearchBar({ tab, currentQuery }: Props) {
  const router = useRouter()
  const [value, setValue] = useState(currentQuery)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams({ tab, q: value })
    router.push(`/dashboard?${params.toString()}`)
  }

  const handleClear = () => {
    setValue('')
    router.push(`/dashboard?tab=${tab}`)
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex flex-1 items-center">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={tab === 'anomalies' ? 'Search by codename…' : 'Search by name…'}
        className="w-full rounded-sm border border-zinc-800 bg-zinc-900 px-4 py-2 font-mono text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-zinc-600"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-10 text-zinc-600 hover:text-zinc-400"
        >
          ✕
        </button>
      )}
      <button
        type="submit"
        className="absolute right-3 font-mono text-xs text-zinc-500 hover:text-zinc-300"
      >
        ↵
      </button>
    </form>
  )
}
