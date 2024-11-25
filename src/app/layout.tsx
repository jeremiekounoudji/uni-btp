import '@/app/globals.css'
import CinetPayScript from '@/components/CinetPayScript';
import WhatsAppFloat from '@/components/WhatsAppFloat';

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
      <body>
        {children}
        <WhatsAppFloat />
        <CinetPayScript />
      </body>
    </html>
  )
}
