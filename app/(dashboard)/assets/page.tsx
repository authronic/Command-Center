'use client'

import { useState } from 'react'
import {
  FolderOpen,
  FileImage,
  Video,
  FileText,
  Download,
  ExternalLink,
  Tag,
  Search,
} from 'lucide-react'

interface AssetFile {
  id: string
  name: string
  type: 'image' | 'video' | 'pdf' | 'json'
  size: string
  relatedBatch: string
  updatedAt: string
}

const initialAssets: AssetFile[] = [
  {
    id: 'as-1',
    name: 'qatar-lead-response-infographic-1080x1350.png',
    type: 'image',
    size: '1.4 MB',
    relatedBatch: 'batch-20261108-01',
    updatedAt: 'Today · 1:15 PM',
  },
  {
    id: 'as-2',
    name: 'dubai-offplan-carousel-slides-v1.pdf',
    type: 'pdf',
    size: '4.2 MB',
    relatedBatch: 'batch-20261108-01',
    updatedAt: 'Today · 12:40 PM',
  },
  {
    id: 'as-3',
    name: 'authronic-brand-wordmark-vector.webp',
    type: 'image',
    size: '7.4 KB',
    relatedBatch: 'brand-system',
    updatedAt: 'Official Brand Asset',
  },
]

export default function AssetsPage() {
  const [assets] = useState<AssetFile[]>(initialAssets)

  return (
    <div className="max-w-[1480px] mx-auto space-y-6">
      {/* Header */}
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
          Central repository for generated slide exports, video scene scripts, research PDFs, and verified brand media.
        </p>
      </div>

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
                <th className="p-3.5 sm:p-4 font-semibold" style={{ color: 'var(--text-muted)' }}>Type</th>
                <th className="p-3.5 sm:p-4 font-semibold hidden sm:table-cell" style={{ color: 'var(--text-muted)' }}>Size</th>
                <th className="p-3.5 sm:p-4 font-semibold hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>Related Batch</th>
                <th className="p-3.5 sm:p-4 font-semibold text-right" style={{ color: 'var(--text-muted)' }}>Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border-soft)' }}>
              {assets.map(asset => (
                <tr key={asset.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3.5 sm:p-4 flex items-center gap-2.5 font-medium" style={{ color: 'var(--text-primary)' }}>
                    <FileImage size={16} style={{ color: 'var(--brand-orange)' }} className="flex-shrink-0" />
                    <span className="truncate max-w-xs sm:max-w-md">{asset.name}</span>
                  </td>
                  <td className="p-3.5 sm:p-4 uppercase font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    {asset.type}
                  </td>
                  <td className="p-3.5 sm:p-4 text-[11px] font-mono hidden sm:table-cell" style={{ color: 'var(--text-secondary)' }}>
                    {asset.size}
                  </td>
                  <td className="p-3.5 sm:p-4 font-mono text-[11px] hidden md:table-cell" style={{ color: 'var(--brand-orange)' }}>
                    {asset.relatedBatch}
                  </td>
                  <td className="p-3.5 sm:p-4 text-right text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    {asset.updatedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
