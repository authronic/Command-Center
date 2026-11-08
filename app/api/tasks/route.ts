import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getTasks, createTask } from '@/lib/db/store'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tasks = getTasks()
  return NextResponse.json({ tasks })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const newTask = createTask({
      title: body.title.trim(),
      description: body.description || '',
      priority: body.priority || 'medium',
      status: body.status || 'pending',
      category: body.category || 'Content',
      dueAt: body.dueAt || 'Today',
      ownerId: session.user?.email || 'admin@authronic.com',
    })

    return NextResponse.json({ task: newTask }, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}
