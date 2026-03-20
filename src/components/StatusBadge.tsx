// components/StatusBadge.tsx
// Color-coded badge for containment status

import { ContainmentStatus } from '@/types'

const styles: Record<ContainmentStatus, string> = {
  'Contained':   'border-green-800  bg-green-950  text-green-400',
  'Breached':    'border-red-800    bg-red-950    text-red-400',
  'Unknown':     'border-zinc-700   bg-zinc-900   text-zinc-400',
  'Neutralized': 'border-blue-800   bg-blue-950   text-blue-400',
}

export default function StatusBadge({ status }: { status: ContainmentStatus }) {
  return (
    <span className={`inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-xs ${styles[status]}`}>
      {status}
    </span>
  )
}
