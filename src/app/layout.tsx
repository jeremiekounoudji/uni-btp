import '@/app/globals.css'
import CinetPayScript from '@/components/CinetPayScript';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { AuthProvider } from '@/components/AuthProvider';
import { NextUIProvider } from '@nextui-org/react';

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
      <body className="overflow-x-hidden min-h-screen relative">
        <AuthProvider>
          <NextUIProvider>
            {children}
          </NextUIProvider>
        </AuthProvider>
        <WhatsAppFloat />
        <CinetPayScript />
      </body>
    </html>
  )
}
