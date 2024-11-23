import '@/app/globals.css'

export const metadata = {
  title: 'UNIE BTP',
  description: 'Union Solidaire des Entrepreneurs du BTP',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
