import { TaskRecord, ApprovalRecord } from '../db/types'

export interface SheetSyncResult {
  success: boolean
  sheetId: string
  tasksCount: number
  approvalsCount: number
  syncedAt: string
  message: string
}

export function formatTasksForSheet(tasks: TaskRecord[]): (string | number)[][] {
  const header = ['Task ID', 'Title', 'Category', 'Priority', 'Status', 'Due Date', 'Created At']
  const rows = tasks.map(t => [
    t.id,
    t.title,
    t.category,
    t.priority,
    t.status,
    t.dueAt,
    t.createdAt,
  ])
  return [header, ...rows]
}

export function formatApprovalsForSheet(approvals: ApprovalRecord[]): (string | number)[][] {
  const header = ['Approval ID', 'Title', 'Format', 'Market', 'Version', 'Status', 'Reviewer', 'Submitted At']
  const rows = approvals.map(a => [
    a.id,
    a.title,
    a.format,
    a.market,
    a.version,
    a.status,
    a.reviewer || 'Pending',
    a.submittedAt,
  ])
  return [header, ...rows]
}

/**
 * Syncs tasks and approvals to Google Sheet
 */
export async function syncToGoogleSheet(
  tasks: TaskRecord[],
  approvals: ApprovalRecord[],
  accessToken?: string
): Promise<SheetSyncResult> {
  const sheetId =
    process.env.GOOGLE_SHEET_ID || '146tzKMldWAayotPPACLJFXM4LDJhVsrF2ccmdMbDwv4'

  if (!accessToken) {
    // Return structured preview if access token not yet granted by user login
    return {
      success: true,
      sheetId,
      tasksCount: tasks.length,
      approvalsCount: approvals.length,
      syncedAt: new Date().toISOString(),
      message: `Structured ${tasks.length} tasks and ${approvals.length} approvals ready for Google Sheet ${sheetId}. Sign in with Google to push live rows.`,
    }
  }

  try {
    // Direct Google Sheets API append/update
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Tasks!A1?valueInputOption=USER_ENTERED`
    const values = formatTasksForSheet(tasks)

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Google Sheets API responded with ${res.status}: ${errText}`)
    }

    return {
      success: true,
      sheetId,
      tasksCount: tasks.length,
      approvalsCount: approvals.length,
      syncedAt: new Date().toISOString(),
      message: `Successfully synchronized ${tasks.length} tasks to Google Sheet tab 'Tasks'.`,
    }
  } catch (error: any) {
    console.error('Google Sheet sync error:', error)
    return {
      success: false,
      sheetId,
      tasksCount: tasks.length,
      approvalsCount: approvals.length,
      syncedAt: new Date().toISOString(),
      message: error.message || 'Failed to sync with Google Sheets API',
    }
  }
}

/**
 * Reads tasks and approvals from Google Sheet
 */
export async function readFromGoogleSheet(
  accessToken?: string,
  sheetId: string = process.env.GOOGLE_SHEET_ID || '146tzKMldWAayotPPACLJFXM4LDJhVsrF2ccmdMbDwv4'
): Promise<{ success: boolean; rows: any[]; message: string }> {
  if (!accessToken) {
    return {
      success: false,
      rows: [],
      message: 'Sign in with Google to read live rows directly from Google Sheets.',
    }
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Tasks!A1:Z100`
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!res.ok) {
      throw new Error(`Sheets API error (${res.status}): ${await res.text()}`)
    }

    const data = await res.json()
    return {
      success: true,
      rows: data.values || [],
      message: `Successfully read ${(data.values || []).length} rows from Google Sheets.`,
    }
  } catch (err: any) {
    return {
      success: false,
      rows: [],
      message: err.message,
    }
  }
}

