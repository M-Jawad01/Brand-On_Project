import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BrandON - Digital Advertising & Custom Design Services',
  description: 'Professional digital advertising agency offering custom banners, LED signboards, showroom branding, and more',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-brand-base text-white min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a2e',
              color: '#fff',
              border: '1px solid rgba(74, 222, 128, 0.2)',
              borderRadius: '0.5rem',
            },
            success: {
              iconTheme: {
                primary: '#4ade80',
                secondary: '#1a1a2e',
              },
              style: {
                background: '#1a1a2e',
                border: '1px solid rgba(74, 222, 128, 0.3)',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#1a1a2e',
              },
              style: {
                background: '#1a1a2e',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              },
            },
            loading: {
              style: {
                background: '#1a1a2e',
                border: '1px solid rgba(74, 222, 128, 0.2)',
              },
            },
          }}
        />
      </body>
    </html>
  )
}