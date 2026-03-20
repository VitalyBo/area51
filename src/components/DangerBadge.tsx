// components/DangerBadge.tsx
// Color-coded badge for anomaly danger levels

import { DangerLevel } from '@/types'

const styles: Record<DangerLevel, string> = {
  'Low':          'border-green-800  bg-green-950  text-green-400',
  'High':         'border-yellow-800 bg-yellow-950 text-yellow-400',
  'Extreme':      'border-orange-800 bg-orange-950 text-orange-400',
  'World-Ending': 'border-red-800    bg-red-950    text-red-400',
}

export default function DangerBadge({ level }: { level: DangerLevel }) {
  return (
    <span className={`inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-xs ${styles[level]}`}>
      {level}
    </span>
  )
}
