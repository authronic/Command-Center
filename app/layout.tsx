import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Authronic Command Center',
  description: 'Private operations dashboard for Authronic',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
