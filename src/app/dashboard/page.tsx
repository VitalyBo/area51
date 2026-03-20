// app/dashboard/page.tsx
// Main dashboard — lists anomalies and artifacts with search, filter, pagination

import Link from 'next/link'
import { getAnomaliesCollection, getArtifactsCollection } from '@/lib/mongodb'
import AnomalyCard from '@/components/AnomalyCard'
import ArtifactCard from '@/components/ArtifactCard'
import SearchBar from '@/components/SearchBar'
import FilterBar from '@/components/FilterBar'
import Pagination from '@/components/Pagination'
import { Anomaly, Artifact } from '@/types'

const PAGE_SIZE = 9

interface PageProps {
  searchParams: {
    tab?: string
    q?: string
    danger?: string
    status?: string
    page?: string
  }
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const tab    = searchParams.tab    || 'anomalies'
  const query  = searchParams.q      || ''
  const danger = searchParams.danger || ''
  const status = searchParams.status || ''
  const page   = parseInt(searchParams.page || '1', 10)
  const skip   = (page - 1) * PAGE_SIZE

  let items:  Anomaly[] | Artifact[] = []
  let total = 0

  if (tab === 'anomalies') {
    const col   = await getAnomaliesCollection()

    // Build filter query
    const filter: Record<string, unknown> = {}
    if (query)  filter.codename    = { $regex: query, $options: 'i' }
    if (danger) filter.dangerLevel = danger
    if (status) filter.containmentStatus = status

    total = await col.countDocuments(filter)
    const docs = await col
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(PAGE_SIZE)
      .toArray()

    items = docs.map((d) => ({ ...d, _id: d._id.toString() })) as Anomaly[]

  } else {
    const col   = await getArtifactsCollection()

    const filter: Record<string, unknown> = {}
    if (query) filter.name   = { $regex: query, $options: 'i' }

    total = await col.countDocuments(filter)
    const docs = await col
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(PAGE_SIZE)
      .toArray()

    items = docs.map((d) => ({ ...d, _id: d._id.toString() })) as Artifact[]
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold text-zinc-100">
            Asset Registry
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {total} record{total !== 1 ? 's' : ''} found
          </p>
        </div>

        <Link
          href={tab === 'anomalies' ? '/anomalies/add' : '/artifacts/add'}
          className="inline-flex items-center gap-2 rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 font-mono text-sm text-zinc-100 transition-all hover:border-red-500 hover:text-red-400"
        >
          + Add {tab === 'anomalies' ? 'Anomaly' : 'Artifact'}
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-zinc-800">
        {[
          { key: 'anomalies', label: 'Anomalies' },
          { key: 'artifacts', label: 'Artifacts' },
        ].map(({ key, label }) => (
          <Link
            key={key}
            href={`/dashboard?tab=${key}`}
            className={`px-4 py-2 font-mono text-sm transition-colors ${
              tab === key
                ? 'border-b-2 border-red-500 text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBar tab={tab} currentQuery={query} />
        {tab === 'anomalies' && (
          <FilterBar
            currentDanger={danger}
            currentStatus={status}
            tab={tab}
            query={query}
          />
        )}
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
          <p className="font-mono text-zinc-500">No records match your search.</p>
          <Link
            href={`/dashboard?tab=${tab}`}
            className="font-mono text-sm text-red-500 hover:underline"
          >
            Clear filters
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tab === 'anomalies'
            ? (items as Anomaly[]).map((item) => (
                <AnomalyCard key={item._id} anomaly={item} />
              ))
            : (items as Artifact[]).map((item) => (
                <ArtifactCard key={item._id} artifact={item} />
              ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          tab={tab}
          query={query}
          danger={danger}
          status={status}
        />
      )}
    </div>
  )
}
