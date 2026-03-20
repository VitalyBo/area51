'use client'

// app/anomalies/[id]/edit/page.tsx
// Edit form — pre-filled with existing anomaly data

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { anomalySchema, AnomalyFormData } from '@/lib/validations'
import { Anomaly } from '@/types'

export default function EditAnomalyPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const [loading,     setLoading]     = useState(true)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AnomalyFormData>({ resolver: zodResolver(anomalySchema) })

  // Load existing data into the form
  useEffect(() => {
    fetch(`/api/anomalies/${id}`)
      .then((r) => r.json())
      .then((data: Anomaly) => {
        reset({
          codename:          data.codename,
          description:       data.description,
          dangerLevel:       data.dangerLevel,
          containmentStatus: data.containmentStatus,
          containmentSector: data.containmentSector,
          discoveryDate:     data.discoveryDate?.slice(0, 10) ?? '',
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id, reset])

  const onSubmit = async (data: AnomalyFormData) => {
    setServerError('')
    const res = await fetch(`/api/anomalies/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    })

    if (!res.ok) {
      const json = await res.json()
      setServerError(json.error || 'Update failed.')
      return
    }

    router.push(`/anomalies/${id}`)
    router.refresh()
  }

  const fieldClass =
    'w-full rounded-sm border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-zinc-600'
  const errorClass = 'mt-1 font-mono text-xs text-red-400'
  const labelClass = 'mb-1 block font-mono text-xs text-zinc-500 uppercase tracking-wider'

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded-sm bg-zinc-800" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="font-mono text-xs tracking-widest text-red-500 uppercase mb-2">Edit Record</p>
        <h1 className="font-mono text-2xl font-bold text-zinc-100">Update Anomaly</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className={labelClass}>Codename *</label>
          <input {...register('codename')} className={fieldClass} />
          {errors.codename && <p className={errorClass}>{errors.codename.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Description *</label>
          <textarea {...register('description')} rows={3} className={fieldClass} />
          {errors.description && <p className={errorClass}>{errors.description.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Danger Level *</label>
            <select {...register('dangerLevel')} className={fieldClass}>
              <option value="Low">Low</option>
              <option value="High">High</option>
              <option value="Extreme">Extreme</option>
              <option value="World-Ending">World-Ending</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Containment Status *</label>
            <select {...register('containmentStatus')} className={fieldClass}>
              <option value="Unknown">Unknown</option>
              <option value="Contained">Contained</option>
              <option value="Breached">Breached</option>
              <option value="Neutralized">Neutralized</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Containment Sector</label>
            <input {...register('containmentSector')} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Discovery Date *</label>
            <input type="date" {...register('discoveryDate')} className={fieldClass} />
            {errors.discoveryDate && <p className={errorClass}>{errors.discoveryDate.message}</p>}
          </div>
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
            {isSubmitting ? 'Saving…' : 'Save Changes'}
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
