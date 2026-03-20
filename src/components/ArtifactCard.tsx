// components/ArtifactCard.tsx
// Card component shown in the artifacts grid

import Link from 'next/link'
import { Artifact } from '@/types'

export default function ArtifactCard({ artifact }: { artifact: Artifact }) {
  return (
    <Link
      href={`/artifacts/${artifact._id}`}
      className="group flex flex-col gap-3 rounded-sm border border-zinc-800 bg-zinc-900 p-5 transition-all hover:border-zinc-600"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-mono text-sm font-bold text-zinc-100 group-hover:text-white line-clamp-1">
          {artifact.name}
        </h3>
        {/* Danger rating 1–10 */}
        <span className={`font-mono text-xs font-bold ${
          artifact.dangerRating >= 8 ? 'text-red-400'
          : artifact.dangerRating >= 5 ? 'text-orange-400'
          : 'text-green-400'
        }`}>
          {artifact.dangerRating}/10
        </span>
      </div>

      {/* Origin */}
      <p className="text-xs text-zinc-500">
        Origin: <span className="text-zinc-400">{artifact.origin}</span>
      </p>

      {/* Location */}
      <p className="text-xs text-zinc-500">
        Location: <span className="font-mono text-zinc-400">{artifact.currentLocation}</span>
      </p>

      {/* Quarantine badge */}
      {artifact.isQuarantined && (
        <span className="w-fit rounded-sm border border-red-800 bg-red-950 px-2 py-0.5 font-mono text-xs text-red-400">
          Quarantined
        </span>
      )}
    </Link>
  )
}
