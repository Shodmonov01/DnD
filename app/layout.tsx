import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Amir',
  description: 'Full-Stack',
  generator: 'Amir',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
