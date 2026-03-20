// app/anomalies/page.tsx
// Standalone /anomalies page with search, filter, pagination

import Link from 'next/link'
import { getAnomaliesCollection } from '@/lib/mongodb'
import { Anomaly } from '@/types'
import AnomalyCard from '@/components/AnomalyCard'
import SearchBar from '@/components/SearchBar'
import FilterBar from '@/components/FilterBar'
import Pagination from '@/components/Pagination'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

const PAGE_SIZE = 9

interface PageProps {
  searchParams: { q?: string; danger?: string; status?: string; page?: string }
}

export default async function AnomaliesPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const query  = searchParams.q      || ''
  const danger = searchParams.danger || ''
  const status = searchParams.status || ''
  const page   = parseInt(searchParams.page || '1', 10)

  const filter: Record<string, unknown> = {}
  if (query)  filter.codename          = { $regex: query, $options: 'i' }
  if (danger) filter.dangerLevel       = danger
  if (status) filter.containmentStatus = status

  const col   = await getAnomaliesCollection()
  const total = await col.countDocuments(filter)
  const docs  = await col
    .find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .toArray()

  const anomalies = docs.map((d) => ({ ...d, _id: d._id.toString() })) as Anomaly[]
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold text-zinc-100">Anomalies</h1>
          <p className="mt-1 text-sm text-zinc-500">{total} record{total !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/anomalies/add"
          className="rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 font-mono text-sm text-zinc-100 transition hover:border-red-500 hover:text-red-400"
        >
          + Add Anomaly
        </Link>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBar tab="anomalies" currentQuery={query} />
        <FilterBar tab="anomalies" query={query} currentDanger={danger} currentStatus={status} />
      </div>

      {/* Grid */}
      {anomalies.length === 0 ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="font-mono text-zinc-500">No anomalies match your search.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {anomalies.map((a) => <AnomalyCard key={a._id} anomaly={a} />)}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          tab="anomalies"
          query={query}
          danger={danger}
          status={status}
        />
      )}
    </div>
  )
}
