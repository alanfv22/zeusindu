import type { Metadata, Viewport } from 'next'
import { Bebas_Neue, DM_Sans } from 'next/font/google'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-neue',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Zeus Indu | Sublimados, Estampados y Bordados en San Justo',
  description: 'Tu taller de indumentaria personalizada en el oeste del GBA. Sublimados, estampados y bordados de calidad. Hacemos tu idea realidad, desde una unidad.',
  keywords: ['sublimado', 'estampado', 'bordado', 'remeras personalizadas', 'San Justo', 'Buenos Aires', 'indumentaria personalizada'],
  authors: [{ name: 'Zeus Indu' }],
  openGraph: {
    title: 'Zeus Indu | Sublimados, Estampados y Bordados',
    description: 'Tu taller de indumentaria personalizada en el oeste del GBA.',
    type: 'website',
    locale: 'es_AR',
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${bebasNeue.variable} ${dmSans.variable} bg-black`}>
      <body className="font-sans antialiased bg-black text-white">
        {children}
      </body>
    </html>
  )
}
