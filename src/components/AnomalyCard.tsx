// components/AnomalyCard.tsx
// Card component shown in the anomalies grid

import Link from 'next/link'
import { Anomaly } from '@/types'
import DangerBadge from './DangerBadge'
import StatusBadge from './StatusBadge'

export default function AnomalyCard({ anomaly }: { anomaly: Anomaly }) {
  return (
    <Link
      href={`/anomalies/${anomaly._id}`}
      className="group flex flex-col gap-3 rounded-sm border border-zinc-800 bg-zinc-900 p-5 transition-all hover:border-zinc-600"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-mono text-sm font-bold text-zinc-100 group-hover:text-white">
          {anomaly.codename}
        </h3>
        <DangerBadge level={anomaly.dangerLevel} />
      </div>

      {/* Description */}
      <p className="line-clamp-2 text-xs text-zinc-500 leading-relaxed">
        {anomaly.description}
      </p>

      {/* Footer */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <StatusBadge status={anomaly.containmentStatus} />
        {anomaly.containmentSector && (
          <span className="font-mono text-xs text-zinc-600">
            Sector {anomaly.containmentSector}
          </span>
        )}
      </div>
    </Link>
  )
}
