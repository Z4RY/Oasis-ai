import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from '@/components/theme-provider'
import { Syne as V0_Font_Syne, Libre_Baskerville as V0_Font_Libre_Baskerville } from 'next/font/google'

import './globals.css'

const _syne = V0_Font_Syne({ subsets: ['latin'], weight: ["400","500","600","700","800"] })
const _libreBaskerville = V0_Font_Libre_Baskerville({ subsets: ['latin'], weight: ["400","700"] })

export const metadata: Metadata = {
  title: 'Oasis Platform',
  description: 'AI-powered essay evaluation platform',
  generator: 'Abysmal',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${_syne.style.fontFamily};
  --font-syne: ${_syne.variable};
  --font-libre: ${_libreBaskerville.variable};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className={`font-syne ${_syne.variable} ${_libreBaskerville.variable} ${GeistMono.variable}`}>
        {children}
      </body>
    </html>
  )
}
