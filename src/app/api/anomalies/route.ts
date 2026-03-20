import { NextResponse } from 'next/server'
import { getAnomaliesCollection } from '@/lib/mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth' // Переконайся, що шлях до authOptions правильний

export async function POST(request: Request) {
  try {
    // Перевіряємо, чи юзер залогінений
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { codename, dangerLevel, containmentStatus, description } = body

    if (!codename || !dangerLevel) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const collection = await getAnomaliesCollection()
    
    const result = await collection.insertOne({
      codename,
      dangerLevel,
      containmentStatus: containmentStatus || 'Uncontained',
      description,
      createdAt: new Date(),
      userId: session.user?.email // Прив'язуємо аномалію до юзера
    })

    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json({ error: 'Failed to create anomaly' }, { status: 500 })
  }
}

// Також додамо GET, щоб дашборд міг отримувати список (якщо треба)
export async function GET() {
  try {
    const collection = await getAnomaliesCollection()
    const anomalies = await collection.find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json(anomalies)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}