// lib/mongodb.ts
// MongoDB Atlas connection using a cached client
// This pattern prevents creating a new connection on every request in dev mode

import { MongoClient } from 'mongodb'

// ── Setup ─────────────────────────────────────────────────────────────────────
// MONGODB_URI comes from .env.local
// Format: mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
const uri = process.env.MONGODB_URI!

if (!uri) {
  throw new Error('Please define MONGODB_URI in .env.local')
}

// ── Connection cache ──────────────────────────────────────────────────────────
// In development, Next.js hot-reloads modules — without caching we'd create
// a new MongoClient on every reload and exhaust the connection pool quickly.
let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === 'development') {
  // Reuse the cached client across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production always create a fresh client
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export default clientPromise

// ── Helper: get the Area51 database ──────────────────────────────────────────
export async function getDb() {
  const client = await clientPromise
  return client.db('area51')
}

// ── Collection helpers ────────────────────────────────────────────────────────
export async function getAnomaliesCollection() {
  const db = await getDb()
  return db.collection('anomalies')
}

export async function getArtifactsCollection() {
  const db = await getDb()
  return db.collection('artifacts')
}
