import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { listDriveAssets } from '@/lib/google/drive'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // @ts-ignore
  const accessToken = session.accessToken as string | undefined
  const driveData = await listDriveAssets(accessToken)

  return NextResponse.json(driveData)
}
