// lib/validations.ts
// Zod schemas for form validation (used on both client and server)

import { z } from 'zod'

// ── Anomaly ───────────────────────────────────────────────────────────────────
export const anomalySchema = z.object({
  codename: z
    .string()
    .min(2, 'Codename must be at least 2 characters')
    .max(30, 'Codename must be 30 characters or less')
    .toUpperCase(),

  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be 500 characters or less'),

  dangerLevel: z.enum(['Low', 'High', 'Extreme', 'World-Ending'], {
    errorMap: () => ({ message: 'Select a valid danger level' }),
  }),

  containmentStatus: z.enum(['Contained', 'Breached', 'Unknown', 'Neutralized'], {
    errorMap: () => ({ message: 'Select a valid containment status' }),
  }),

  containmentSector: z
    .string()
    .max(5, 'Sector must be 5 characters or less')
    .optional()
    .default(''),

  discoveryDate: z
    .string()
    .min(1, 'Discovery date is required'),
})

export type AnomalyFormData = z.infer<typeof anomalySchema>

// ── Artifact ──────────────────────────────────────────────────────────────────
export const artifactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be 100 characters or less'),

  origin: z.enum(
    ['Extraterrestrial', 'Ancient', 'Interdimensional', 'Man-Made', 'Unknown'],
    { errorMap: () => ({ message: 'Select a valid origin' }) }
  ),

  materialComposition: z
    .string()
    .max(200, 'Material composition must be 200 characters or less')
    .optional()
    .default(''),

  currentLocation: z
    .string()
    .min(1, 'Location is required')
    .max(50, 'Location must be 50 characters or less'),

  dangerRating: z
    .number()
    .min(1, 'Danger rating must be at least 1')
    .max(10, 'Danger rating must be 10 or less'),

  isQuarantined: z.boolean().default(false),

  linkedAnomalyId: z.string().optional(),

  acquisitionDate: z.string().min(1, 'Acquisition date is required'),
})

export type ArtifactFormData = z.infer<typeof artifactSchema>
