// app/artifacts/page.tsx
// Standalone /artifacts page

import Link from 'next/link'
import { getArtifactsCollection } from '@/lib/mongodb'
import { Artifact } from '@/types'
import ArtifactCard from '@/components/ArtifactCard'
import SearchBar from '@/components/SearchBar'
import Pagination from '@/components/Pagination'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

const PAGE_SIZE = 9

interface PageProps {
  searchParams: { q?: string; page?: string }
}

export default async function ArtifactsPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const query = searchParams.q    || ''
  const page  = parseInt(searchParams.page || '1', 10)

  const filter: Record<string, unknown> = {}
  if (query) filter.name = { $regex: query, $options: 'i' }

  const col   = await getArtifactsCollection()
  const total = await col.countDocuments(filter)
  const docs  = await col
    .find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .toArray()

  const artifacts  = docs.map((d) => ({ ...d, _id: d._id.toString() })) as Artifact[]
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold text-zinc-100">Artifacts</h1>
          <p className="mt-1 text-sm text-zinc-500">{total} record{total !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/artifacts/add"
          className="rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 font-mono text-sm text-zinc-100 transition hover:border-red-500 hover:text-red-400"
        >
          + Add Artifact
        </Link>
      </div>

      <SearchBar tab="artifacts" currentQuery={query} />

      {artifacts.length === 0 ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="font-mono text-zinc-500">No artifacts match your search.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {artifacts.map((a) => <ArtifactCard key={a._id} artifact={a} />)}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          tab="artifacts"
          query={query}
          danger=""
          status=""
        />
      )}
    </div>
  )
}
