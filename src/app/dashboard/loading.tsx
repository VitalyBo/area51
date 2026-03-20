// app/dashboard/loading.tsx
// Shown automatically by Next.js while dashboard/page.tsx is loading

export default function DashboardLoading() {
  return (
    <div className="space-y-6">

      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 animate-pulse rounded-sm bg-zinc-800" />
        <div className="h-9 w-32 animate-pulse rounded-sm bg-zinc-800" />
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-2">
        <div className="h-9 w-28 animate-pulse rounded-sm bg-zinc-800" />
        <div className="h-9 w-28 animate-pulse rounded-sm bg-zinc-800" />
      </div>

      {/* Search bar skeleton */}
      <div className="h-10 w-full animate-pulse rounded-sm bg-zinc-800" />

      {/* Cards grid skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-sm border border-zinc-800 bg-zinc-900 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-5 w-24 animate-pulse rounded-sm bg-zinc-800" />
              <div className="h-5 w-16 animate-pulse rounded-sm bg-zinc-800" />
            </div>
            <div className="h-4 w-full animate-pulse rounded-sm bg-zinc-800" />
            <div className="h-4 w-3/4 animate-pulse rounded-sm bg-zinc-800" />
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-20 animate-pulse rounded-sm bg-zinc-800" />
              <div className="h-6 w-20 animate-pulse rounded-sm bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
