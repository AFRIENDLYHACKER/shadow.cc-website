import { NextResponse } from 'next/server'
import { getAllStock } from '@/lib/keys'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const stock = getAllStock()
    return NextResponse.json({ stock }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    })
  } catch (error) {
    console.error('Error getting stock:', error)
    return NextResponse.json({ error: 'Failed to get stock' }, { status: 500 })
  }
}
