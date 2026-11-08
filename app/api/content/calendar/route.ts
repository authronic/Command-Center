import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getScheduledPosts, createScheduledPost, updateScheduledPostStatus } from '@/lib/db/store'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const posts = getScheduledPosts()
  return NextResponse.json({ posts })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, format, channel, scheduledTime, dayOfWeek } = body

    if (!title || !format || !channel || !scheduledTime || !dayOfWeek) {
      return NextResponse.json({ error: 'Missing required post fields' }, { status: 400 })
    }

    const newPost = createScheduledPost({
      title,
      format,
      channel,
      scheduledTime,
      dayOfWeek,
      status: 'scheduled_internal',
    })

    return NextResponse.json({ success: true, post: newPost })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })
    }

    const updated = updateScheduledPostStatus(id, status)
    return NextResponse.json({ success: !!updated, post: updated })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
