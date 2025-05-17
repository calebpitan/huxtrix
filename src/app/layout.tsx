import type { Metadata } from 'next'
import { DM_Sans, Geist, Geist_Mono } from 'next/font/google'

import { BottomBar } from '@/compositions/navbar/BottomBar'
import { ThemeProvider } from '@/compositions/providers'
import { cn } from '@/lib/utils'

import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })
const dmSans = DM_Sans({ variable: '--font-dm-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Huxtrix - Hoax & Tricks',
  description: 'A platform for sharing useful hacks, tips, and tricks',
}

type RootLayoutProps = Readonly<{ children: React.ReactNode }>

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          dmSans.variable,
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            {/* <header className="sticky top-0 md:relative z-50 w-full border-b-0 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-muted/60">
              <div className="flex h-15 items-center justify-center">
                <span className="font-bold text-xl tracking-tight">Huxtrix</span>
              </div>
            </header> */}

            <main className="flex-1">{children}</main>

            <footer className="border-t-0 py-6 md:py-3 md:order-1">
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <p className="w-full text-center text-sm leading-loose text-muted-foreground">
                  <code>(c)</code> 2025 Huxtrix
                </p>
              </div>
            </footer>

            <BottomBar className="md:order-0" />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
