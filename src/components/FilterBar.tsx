'use client'

// components/FilterBar.tsx
// Dropdowns for filtering anomalies by DangerLevel and ContainmentStatus

import { useRouter } from 'next/navigation'

interface Props {
  tab: string
  query: string
  currentDanger: string
  currentStatus: string
}

export default function FilterBar({ tab, query, currentDanger, currentStatus }: Props) {
  const router = useRouter()

  const update = (key: string, value: string) => {
    const params = new URLSearchParams({ tab, q: query })
    if (key === 'danger' && value) params.set('danger', value)
    if (key === 'status' && value) params.set('status', value)
    if (key !== 'danger' && currentDanger) params.set('danger', currentDanger)
    if (key !== 'status' && currentStatus) params.set('status', currentStatus)
    router.push(`/dashboard?${params.toString()}`)
  }

  const selectClass =
    'rounded-sm border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-xs text-zinc-400 outline-none transition focus:border-zinc-600 cursor-pointer'

  return (
    <div className="flex gap-2">
      <select
        value={currentDanger}
        onChange={(e) => update('danger', e.target.value)}
        className={selectClass}
      >
        <option value="">All Danger Levels</option>
        <option value="Low">Low</option>
        <option value="High">High</option>
        <option value="Extreme">Extreme</option>
        <option value="World-Ending">World-Ending</option>
      </select>

      <select
        value={currentStatus}
        onChange={(e) => update('status', e.target.value)}
        className={selectClass}
      >
        <option value="">All Statuses</option>
        <option value="Contained">Contained</option>
        <option value="Breached">Breached</option>
        <option value="Unknown">Unknown</option>
        <option value="Neutralized">Neutralized</option>
      </select>
    </div>
  )
}
