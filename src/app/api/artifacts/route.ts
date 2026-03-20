// app/api/artifacts/route.ts
// GET all artifacts, POST create new artifact

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getArtifactsCollection } from '@/lib/mongodb'
import { artifactSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const q     = searchParams.get('q')    || ''
    const page  = parseInt(searchParams.get('page')  || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '9', 10)

    const filter: Record<string, unknown> = {}
    if (q) filter.name = { $regex: q, $options: 'i' }

    const col   = await getArtifactsCollection()
    const total = await col.countDocuments(filter)
    const docs  = await col
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    const data = docs.map((d) => ({ ...d, _id: d._id.toString() }))

    return NextResponse.json({ data, total, page, pageSize: limit, totalPages: Math.ceil(total / limit) })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch artifacts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body   = await request.json()
    const parsed = artifactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const col = await getArtifactsCollection()
    const now = new Date().toISOString()

    const result = await col.insertOne({
      ...parsed.data,
      createdBy: session.user?.email || 'unknown',
      createdAt: now,
      updatedAt: now,
    })

    return NextResponse.json(
      { _id: result.insertedId.toString(), ...parsed.data },
      { status: 201 }
    )
  } catch {
    return NextResponse.json({ error: 'Failed to create artifact' }, { status: 500 })
  }
}
