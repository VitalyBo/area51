'use client'

// app/artifacts/add/page.tsx
// Form for creating a new artifact

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { artifactSchema, ArtifactFormData } from '@/lib/validations'

export default function AddArtifactPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ArtifactFormData>({
    resolver: zodResolver(artifactSchema),
    defaultValues: { origin: 'Unknown', isQuarantined: false, dangerRating: 1 },
  })

  const onSubmit = async (data: ArtifactFormData) => {
    setServerError('')
    const res = await fetch('/api/artifacts', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    })

    if (!res.ok) {
      const json = await res.json()
      setServerError(json.error || 'Something went wrong.')
      return
    }

    router.push('/artifacts')
    router.refresh()
  }

  const fieldClass =
    'w-full rounded-sm border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-zinc-600'
  const errorClass = 'mt-1 font-mono text-xs text-red-400'
  const labelClass = 'mb-1 block font-mono text-xs text-zinc-500 uppercase tracking-wider'

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">

      <div className="mb-8">
        <p className="font-mono text-xs tracking-widest text-red-500 uppercase mb-2">New Record</p>
        <h1 className="font-mono text-2xl font-bold text-zinc-100">Register Artifact</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Name */}
        <div>
          <label className={labelClass}>Artifact Name *</label>
          <input {...register('name')} placeholder="e.g. Mirror Fragment Omega" className={fieldClass} />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>

        {/* Origin + Danger Rating */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Origin *</label>
            <select {...register('origin')} className={fieldClass}>
              <option value="Unknown">Unknown</option>
              <option value="Extraterrestrial">Extraterrestrial</option>
              <option value="Ancient">Ancient</option>
              <option value="Interdimensional">Interdimensional</option>
              <option value="Man-Made">Man-Made</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Danger Rating (1–10) *</label>
            <input
              type="number"
              min={1}
              max={10}
              {...register('dangerRating', { valueAsNumber: true })}
              className={fieldClass}
            />
            {errors.dangerRating && <p className={errorClass}>{errors.dangerRating.message}</p>}
          </div>
        </div>

        {/* Material */}
        <div>
          <label className={labelClass}>Material Composition</label>
          <input {...register('materialComposition')} placeholder="e.g. Unknown crystalline alloy" className={fieldClass} />
        </div>

        {/* Location + Acquisition Date */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Current Location *</label>
            <input {...register('currentLocation')} placeholder="e.g. Sector B" className={fieldClass} />
            {errors.currentLocation && <p className={errorClass}>{errors.currentLocation.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Acquisition Date *</label>
            <input type="date" {...register('acquisitionDate')} className={fieldClass} />
            {errors.acquisitionDate && <p className={errorClass}>{errors.acquisitionDate.message}</p>}
          </div>
        </div>

        {/* Quarantined */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="quarantine"
            {...register('isQuarantined')}
            className="h-4 w-4 rounded-sm border-zinc-700 bg-zinc-900 accent-red-500"
          />
          <label htmlFor="quarantine" className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
            Mark as Quarantined
          </label>
        </div>

        {serverError && (
          <p className="rounded-sm border border-red-800 bg-red-950 px-3 py-2 font-mono text-xs text-red-400">
            {serverError}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-sm border border-red-800 bg-red-950 px-6 py-2 font-mono text-sm text-red-300 transition hover:bg-red-900 disabled:opacity-50"
          >
            {isSubmitting ? 'Registering…' : 'Register Artifact'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-sm border border-zinc-700 bg-zinc-900 px-6 py-2 font-mono text-sm text-zinc-400 transition hover:border-zinc-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
