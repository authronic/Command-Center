'use client'

import { useState } from 'react'
import {
  CheckSquare,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Filter,
  Trash2,
  AlertTriangle,
} from 'lucide-react'

interface Task {
  id: string
  title: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'overdue'
  dueDate: string
  category: 'Content' | 'Sales' | 'Infrastructure'
}

const initialTasks: Task[] = [
  {
    id: 't-1',
    title: 'Verify Qatar brokerages regulatory licensing requirements (Doha market)',
    priority: 'high',
    status: 'overdue',
    dueDate: 'Yesterday',
    category: 'Sales',
  },
  {
    id: 't-2',
    title: 'Deploy HeyGen API render webhook & test callback signatures',
    priority: 'medium',
    status: 'blocked',
    dueDate: 'Pending API Key',
    category: 'Infrastructure',
  },
  {
    id: 't-3',
    title: 'Review static post drafts for Dubai Real Estate lead conversion',
    priority: 'high',
    status: 'in_progress',
    dueDate: 'Today · 5:00 PM',
    category: 'Content',
  },
  {
    id: 't-4',
    title: 'Scaffold Authronic Command Center shell, brand tokens & NextAuth session',
    priority: 'high',
    status: 'completed',
    dueDate: 'Today',
    category: 'Infrastructure',
  },
]

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [filter, setFilter] = useState<'all' | 'active' | 'overdue' | 'completed'>('all')
  const [isAdding, setIsAdding] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskCategory, setNewTaskCategory] = useState<'Content' | 'Sales' | 'Infrastructure'>('Content')

  function toggleTask(id: string) {
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, status: t.status === 'completed' ? 'in_progress' : 'completed' }
          : t
      )
    )
  }

  function deleteTask(id: string) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  function handleAddTask(e: React.FormEvent) {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    const newTask: Task = {
      id: `t-${Date.now()}`,
      title: newTaskTitle.trim(),
      priority: 'medium',
      status: 'pending',
      dueDate: 'Today',
      category: newTaskCategory,
    }
    setTasks([newTask, ...tasks])
    setNewTaskTitle('')
    setIsAdding(false)
  }

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return t.status !== 'completed'
    if (filter === 'overdue') return t.status === 'overdue'
    if (filter === 'completed') return t.status === 'completed'
    return true
  })

  return (
    <div className="max-w-[1480px] mx-auto space-y-6">
      {/* Eyebrow and Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p
            className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-1.5"
            style={{ color: 'var(--text-muted)' }}
          >
            AUTHRONIC / OVERVIEW
          </p>
          <h1
            className="text-2xl sm:text-3xl font-semibold mb-2"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
          >
            My Tasks
          </h1>
          <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
            Personal task queue, priorities, and workflow reminders.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90 self-start sm:self-auto cursor-pointer"
          style={{
            background: 'var(--brand-orange)',
            color: '#101110',
          }}
        >
          <Plus size={16} />
          <span>{isAdding ? 'Cancel' : 'New Task'}</span>
        </button>
      </div>

      {/* Add Task Form (collapsible) */}
      {isAdding && (
        <form
          onSubmit={handleAddTask}
          className="p-4 sm:p-5 rounded-xl space-y-3 shadow-md animate-fadeIn"
          style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--brand-orange)',
          }}
        >
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Create Personal Task
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              placeholder="What needs to be done? (e.g., Follow up with Dubai prospect)"
              required
              autoFocus
              className="flex-1 h-10 px-3.5 rounded-lg text-sm outline-none"
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border-soft)',
                color: 'var(--text-primary)',
              }}
            />
            <select
              value={newTaskCategory}
              onChange={e => setNewTaskCategory(e.target.value as any)}
              className="h-10 px-3 rounded-lg text-xs outline-none"
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border-soft)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="Content">Content Engine</option>
              <option value="Sales">Sales Engine</option>
              <option value="Infrastructure">Infrastructure</option>
            </select>
            <button
              type="submit"
              className="h-10 px-4 rounded-lg text-xs font-semibold"
              style={{ background: 'var(--brand-orange)', color: '#101110' }}
            >
              Add Task
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'all', label: `All (${tasks.length})` },
          { key: 'active', label: `Active (${tasks.filter(t => t.status !== 'completed').length})` },
          { key: 'overdue', label: `Overdue (${tasks.filter(t => t.status === 'overdue').length})` },
          { key: 'completed', label: `Completed (${tasks.filter(t => t.status === 'completed').length})` },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex-shrink-0"
            style={{
              background: filter === tab.key ? 'rgba(247, 143, 30, 0.12)' : 'var(--surface-1)',
              color: filter === tab.key ? 'var(--brand-orange)' : 'var(--text-secondary)',
              border: filter === tab.key ? '1px solid var(--brand-orange)' : '1px solid var(--border-soft)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tasks Table / List */}
      <div
        className="rounded-xl overflow-hidden divide-y shadow-sm"
        style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border-soft)',
          borderColor: 'var(--border-soft)',
        }}
      >
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            No tasks found in this view.
          </div>
        ) : (
          filteredTasks.map(task => {
            const isCompleted = task.status === 'completed'
            return (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 sm:p-5 gap-3 hover:bg-white/[0.015] transition-colors group"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="p-1 rounded mt-0.5 transition-transform active:scale-90"
                    aria-label={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={18} className="text-emerald-400" />
                    ) : (
                      <div
                        className="w-4 h-4 rounded border-2 transition-colors hover:border-[var(--brand-orange)]"
                        style={{ borderColor: 'var(--border-strong)' }}
                      />
                    )}
                  </button>

                  <div className="min-w-0">
                    <p
                      className="text-sm font-medium transition-all"
                      style={{
                        color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                        textDecoration: isCompleted ? 'line-through' : 'none',
                      }}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2.5 mt-1 text-xs">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-mono"
                        style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)' }}
                      >
                        {task.category}
                      </span>
                      <span
                        className="flex items-center gap-1 text-[11px]"
                        style={{
                          color:
                            task.status === 'overdue'
                              ? '#F87171'
                              : task.status === 'blocked'
                              ? '#FBBF24'
                              : 'var(--text-muted)',
                        }}
                      >
                        {task.status === 'overdue' ? (
                          <AlertTriangle size={12} />
                        ) : (
                          <Clock size={12} />
                        )}
                        {task.dueDate}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-red-500/10 hover:text-red-400 transition-all flex-shrink-0"
                  style={{ color: 'var(--text-muted)' }}
                  aria-label="Delete task"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
