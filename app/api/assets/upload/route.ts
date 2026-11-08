import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { uploadToDrive } from '@/lib/google/drive'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // @ts-ignore
  const accessToken = session.accessToken as string | undefined
  if (!accessToken) {
    return NextResponse.json(
      { error: 'Google session access token not found. Please log in with Google to upload to Google Drive.' },
      { status: 403 }
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const uploadRes = await uploadToDrive(
      file.name,
      buffer,
      file.type || 'application/octet-stream',
      accessToken
    )

    if (!uploadRes.success) {
      return NextResponse.json({ error: uploadRes.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      fileId: uploadRes.fileId,
      name: file.name,
      webViewLink: uploadRes.webViewLink,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
