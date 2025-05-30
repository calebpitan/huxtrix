import type { Metadata } from 'next'
import { DM_Sans, Geist_Mono } from 'next/font/google'

import { RootLayout } from '@/compositions/layout'
import { cn } from '@/lib/utils'

import './globals.css'

const dmSans = DM_Sans({ variable: '--font-dm-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Huxtrix - Hoax & Tricks',
  description: 'A place for sharing useful hacks, tips, and tricks',
}

type RootLayoutProps = Readonly<{ children: React.ReactNode }>

export default function Root({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen w-full max-w-full',
          'bg-background font-sans antialiased',
          dmSans.variable,
          geistMono.variable,
        )}
      >
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  )
}
