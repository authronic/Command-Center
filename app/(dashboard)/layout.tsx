import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import DashboardShell from '@/components/layout/DashboardShell'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <DashboardShell user={session.user}>
      {children}
    </DashboardShell>
  )
}
