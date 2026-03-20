// types/index.ts
// TypeScript interfaces for Area 51 Asset Tracker

export type DangerLevel = 'Low' | 'High' | 'Extreme' | 'World-Ending'
export type ContainmentStatus = 'Contained' | 'Breached' | 'Unknown' | 'Neutralized'
export type ArtifactOrigin = 'Extraterrestrial' | 'Ancient' | 'Interdimensional' | 'Man-Made' | 'Unknown'

export interface Anomaly {
  _id: string
  codename: string
  description: string
  dangerLevel: DangerLevel
  containmentStatus: ContainmentStatus
  containmentSector: string
  discoveryDate: string
  lastReviewed: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface Artifact {
  _id: string
  name: string
  origin: ArtifactOrigin
  materialComposition: string
  currentLocation: string
  dangerRating: number        // 1–10
  isQuarantined: boolean
  linkedAnomalyId?: string    // optional link to an Anomaly
  acquisitionDate: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

// Used for paginated API responses
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
