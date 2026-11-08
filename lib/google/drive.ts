export interface DriveFileItem {
  id: string
  name: string
  mimeType: string
  size?: string
  webViewLink?: string
  thumbnailLink?: string
  createdTime?: string
  modifiedTime?: string
}

export interface DriveFolderStatus {
  folderId: string
  folderName: string
  totalFiles: number
  files: DriveFileItem[]
  folderUrl: string
  syncedAt: string
}

const DEFAULT_FOLDER_ID =
  process.env.GOOGLE_DRIVE_FOLDER_ID || '1ROKW4326ax6A-24U8SrbHmsNSWoXXFkc'

/**
 * Lists files inside the Authronic Drive Folder
 */
export async function listDriveAssets(
  accessToken?: string,
  folderId: string = DEFAULT_FOLDER_ID
): Promise<DriveFolderStatus> {
  const folderUrl = `https://drive.google.com/drive/folders/${folderId}`

  if (!accessToken) {
    return {
      folderId,
      folderName: 'Authronic Command Center Assets',
      totalFiles: 3,
      files: [
        {
          id: 'drive-as-01',
          name: 'qatar-lead-response-infographic-1080x1350.png',
          mimeType: 'image/png',
          size: '1.4 MB',
          webViewLink: folderUrl,
          createdTime: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'drive-as-02',
          name: 'dubai-offplan-carousel-slides-v1.pdf',
          mimeType: 'application/pdf',
          size: '4.2 MB',
          webViewLink: folderUrl,
          createdTime: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: 'drive-as-03',
          name: 'authronic-brand-wordmark-vector.webp',
          mimeType: 'image/webp',
          size: '7.4 KB',
          webViewLink: folderUrl,
          createdTime: new Date(Date.now() - 86400000).toISOString(),
        },
      ],
      folderUrl,
      syncedAt: new Date().toISOString(),
    }
  }

  try {
    const q = `'${folderId}' in parents and trashed = false`
    const fields = 'files(id, name, mimeType, size, webViewLink, thumbnailLink, createdTime, modifiedTime)'
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=${encodeURIComponent(fields)}&pageSize=50`

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!res.ok) {
      throw new Error(`Google Drive API error: ${res.statusText}`)
    }

    const data = await res.json()
    const files: DriveFileItem[] = (data.files || []).map((f: any) => ({
      id: f.id,
      name: f.name,
      mimeType: f.mimeType,
      size: f.size ? `${(Number(f.size) / (1024 * 1024)).toFixed(1)} MB` : undefined,
      webViewLink: f.webViewLink || folderUrl,
      thumbnailLink: f.thumbnailLink,
      createdTime: f.createdTime,
      modifiedTime: f.modifiedTime,
    }))

    return {
      folderId,
      folderName: 'Authronic Command Center Assets',
      totalFiles: files.length,
      files,
      folderUrl,
      syncedAt: new Date().toISOString(),
    }
  } catch (error: any) {
    console.error('Google Drive list error:', error)
    return {
      folderId,
      folderName: 'Authronic Command Center Assets',
      totalFiles: 0,
      files: [],
      folderUrl,
      syncedAt: new Date().toISOString(),
    }
  }
}

/**
 * Uploads a file buffer or text directly to the Authronic Drive Folder
 */
export async function uploadToDrive(
  name: string,
  content: Buffer | string,
  mimeType: string,
  accessToken: string,
  folderId: string = DEFAULT_FOLDER_ID
): Promise<{ success: boolean; fileId?: string; webViewLink?: string; error?: string }> {
  try {
    const metadata = {
      name,
      parents: [folderId],
    }

    const boundary = '-------314159265358979323846'
    const delimiter = `\r\n--${boundary}\r\n`
    const closeDelimiter = `\r\n--${boundary}--`

    const bodyBuffer = Buffer.concat([
      Buffer.from(
        delimiter +
          'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
          JSON.stringify(metadata) +
          delimiter +
          `Content-Type: ${mimeType}\r\n\r\n`
      ),
      typeof content === 'string' ? Buffer.from(content) : content,
      Buffer.from(closeDelimiter),
    ])

    const res = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body: bodyBuffer,
      }
    )

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Upload failed (${res.status}): ${err}`)
    }

    const data = await res.json()
    return {
      success: true,
      fileId: data.id,
      webViewLink: data.webViewLink,
    }
  } catch (err: any) {
    return {
      success: false,
      error: err.message,
    }
  }
}
