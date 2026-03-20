// app/artifacts/[id]/page.tsx
// Detail page for a single artifact

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getArtifactsCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { Artifact } from '@/types'
import DeleteButton from '@/components/DeleteButton'

interface Props { params: { id: string } }

export default async function ArtifactDetailPage({ params }: Props) {
  let artifact: Artifact

  try {
    const col = await getArtifactsCollection()
    const doc = await col.findOne({ _id: new ObjectId(params.id) })
    if (!doc) notFound()
    artifact = { ...doc, _id: doc._id.toString() } as Artifact
  } catch {
    notFound()
  }

  const row = (label: string, value: React.ReactNode) => (
    <div className="flex flex-col gap-1 border-b border-zinc-800 py-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider">{label}</span>
      <span className="font-mono text-sm text-zinc-200">{value}</span>
    </div>
  )

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">

      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 font-mono text-xs text-zinc-600">
        <Link href="/artifacts" className="hover:text-zinc-400">Artifacts</Link>
        <span>/</span>
        <span className="text-zinc-400">{artifact.name}</span>
      </div>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-widest text-red-500 uppercase mb-1">Artifact Record</p>
          <h1 className="font-mono text-2xl font-bold text-zinc-100">{artifact.name}</h1>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/artifacts/${artifact._id}/edit`}
            className="rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 font-mono text-xs text-zinc-300 transition hover:border-zinc-500"
          >
            Edit
          </Link>
          <DeleteButton id={artifact._id} type="artifacts" redirectTo="/artifacts" />
        </div>
      </div>

      {/* Details */}
      <div className="rounded-sm border border-zinc-800 bg-zinc-900 px-5">
        {row('Origin',         artifact.origin)}
        {row('Material',       artifact.materialComposition || '—')}
        {row('Location',       artifact.currentLocation)}
        {row('Danger Rating',
          <span className={`font-bold ${
            artifact.dangerRating >= 8 ? 'text-red-400'
            : artifact.dangerRating >= 5 ? 'text-orange-400'
            : 'text-green-400'
          }`}>
            {artifact.dangerRating}/10
          </span>
        )}
        {row('Quarantined',
          artifact.isQuarantined
            ? <span className="text-red-400">Yes</span>
            : <span className="text-green-400">No</span>
        )}
        {row('Acquired',       new Date(artifact.acquisitionDate).toLocaleDateString())}
        {row('Logged By',      artifact.createdBy)}
      </div>
    </div>
  )
}
