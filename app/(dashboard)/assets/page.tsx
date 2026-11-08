'use client'

import { useState, useEffect } from 'react'
import {
  FolderOpen,
  FileImage,
  Upload,
  RefreshCw,
  ExternalLink,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'

interface DriveFileItem {
  id: string
  name: string
  mimeType: string
  size?: string
  webViewLink?: string
  thumbnailLink?: string
  createdTime?: string
}

export default function AssetsPage() {
  const [files, setFiles] = useState<DriveFileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const folderId = '1ROKW4326ax6A-24U8SrbHmsNSWoXXFkc'
  const folderUrl = `https://drive.google.com/drive/folders/${folderId}`

  async function loadAssets() {
    setLoading(true)
    try {
      const res = await fetch('/api/assets')
      if (res.ok) {
        const data = await res.json()
        setFiles(data.files || [])
      }
    } catch (err) {
      console.error('Failed to load assets:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAssets()
  }, [])

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setStatusMessage(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/assets/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setStatusMessage(`Uploaded "${file.name}" to Google Drive successfully!`)
        loadAssets()
      } else {
        setStatusMessage(data.error || 'Upload failed. Ensure you are signed in with Google.')
      }
    } catch (err: any) {
      setStatusMessage(err.message || 'Error uploading file')
    } finally {
      setUploading(false)
      // Reset input
      e.target.value = ''
    }
  }

  return (
    <div className="max-w-[1480px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p
            className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-1.5"
            style={{ color: 'var(--text-muted)' }}
          >
            AUTHRONIC / MANAGEMENT
          </p>
          <h1
            className="text-2xl sm:text-3xl font-semibold mb-2"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
          >
            Files & Assets
          </h1>
          <p className="text-sm sm:text-base max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Google Drive asset repository for generated slide exports, video scene scripts, research PDFs, and brand media.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          <button
            onClick={loadAssets}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold hover:bg-white/5 transition-colors cursor-pointer"
            style={{ border: '1px solid var(--border-soft)', color: 'var(--text-secondary)' }}
            title="Refresh Drive files"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Sync Drive</span>
          </button>

          <a
            href={folderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold hover:bg-white/5 transition-colors cursor-pointer"
            style={{ border: '1px solid var(--border-soft)', color: 'var(--text-secondary)' }}
          >
            <HardDrive size={14} style={{ color: 'var(--brand-orange)' }} />
            <span>Open in Drive</span>
            <ExternalLink size={12} />
          </a>

          <label
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90 cursor-pointer"
            style={{ background: 'var(--brand-orange)', color: '#101110' }}
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            <span>{uploading ? 'Uploading...' : 'Upload Asset'}</span>
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Drive Folder Connection Banner */}
      <div
        className="p-4 rounded-xl flex items-center justify-between flex-wrap gap-3"
        style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(247, 143, 30, 0.1)', color: 'var(--brand-orange)' }}
          >
            <FolderOpen size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                Target Google Drive Folder
              </span>
              <span
                className="px-2 py-0.5 rounded text-[10px] font-mono font-medium"
                style={{ background: 'rgba(74, 222, 128, 0.12)', color: '#4ade80' }}
              >
                Connected
              </span>
            </div>
            <p className="text-[11px] font-mono mt-0.5 truncate max-w-sm sm:max-w-md" style={{ color: 'var(--text-muted)' }}>
              Folder ID: {folderId}
            </p>
          </div>
        </div>

        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          {files.length} {files.length === 1 ? 'file' : 'files'} indexed
        </span>
      </div>

      {/* Status Alert if any */}
      {statusMessage && (
        <div
          className="p-3.5 rounded-lg text-xs flex items-center gap-2.5"
          style={{
            background: statusMessage.includes('successfully')
              ? 'rgba(74, 222, 128, 0.1)'
              : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${
              statusMessage.includes('successfully') ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)'
            }`,
            color: statusMessage.includes('successfully') ? '#4ade80' : '#f87171',
          }}
        >
          {statusMessage.includes('successfully') ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Asset Table */}
      <div
        className="rounded-xl overflow-hidden shadow-sm"
        style={{ background: 'var(--surface-1)', border: '1px solid var(--border-soft)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border-soft)' }}>
                <th className="p-3.5 sm:p-4 font-semibold" style={{ color: 'var(--text-muted)' }}>File Name</th>
                <th className="p-3.5 sm:p-4 font-semibold" style={{ color: 'var(--text-muted)' }}>MIME Type</th>
                <th className="p-3.5 sm:p-4 font-semibold hidden sm:table-cell" style={{ color: 'var(--text-muted)' }}>Size</th>
                <th className="p-3.5 sm:p-4 font-semibold hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>Created</th>
                <th className="p-3.5 sm:p-4 font-semibold text-right" style={{ color: 'var(--text-muted)' }}>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border-soft)' }}>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 size={15} className="animate-spin text-[var(--brand-orange)]" />
                      <span>Reading files from Google Drive...</span>
                    </div>
                  </td>
                </tr>
              ) : files.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                    No files found in folder. Upload a file or generate content to index assets.
                  </td>
                </tr>
              ) : (
                files.map(file => (
                  <tr key={file.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3.5 sm:p-4 flex items-center gap-2.5 font-medium" style={{ color: 'var(--text-primary)' }}>
                      <FileImage size={16} style={{ color: 'var(--brand-orange)' }} className="flex-shrink-0" />
                      <span className="truncate max-w-xs sm:max-w-md">{file.name}</span>
                    </td>
                    <td className="p-3.5 sm:p-4 font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      {file.mimeType.split('/').pop()}
                    </td>
                    <td className="p-3.5 sm:p-4 text-[11px] font-mono hidden sm:table-cell" style={{ color: 'var(--text-secondary)' }}>
                      {file.size || '—'}
                    </td>
                    <td className="p-3.5 sm:p-4 text-[11px] font-mono hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>
                      {file.createdTime ? new Date(file.createdTime).toLocaleDateString() : 'Today'}
                    </td>
                    <td className="p-3.5 sm:p-4 text-right">
                      {file.webViewLink && (
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium hover:bg-white/5 transition-colors cursor-pointer"
                          style={{ color: 'var(--brand-orange)', border: '1px solid var(--border-soft)' }}
                        >
                          <span>View</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
