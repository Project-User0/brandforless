import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Merriweather } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/provider/Toaster'

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-serif',
})

const baseUrl = 'https://brandforless.vercel.app'; 

export const metadata: Metadata = {
  title: {
    default: 'Brand for Less | Premium & Budget-Friendly Fashion in Tilottama',
    template: '%s | Brand for Less',
  },
  description:
    'Discover high-quality, budget-friendly men\'s and women\'s clothing, shoes, bags, and accessories at Brand for Less. Rated 4.8/5 by satisfied shoppers in Tilottama.',
  keywords: [
    'Brand for Less',
    'Clothing store Tilottama',
    'Men\'s clothing Tilottama',
    'Budget friendly clothing Nepal',
    'Shoes and bags store',
    'Quality fashion store',
    'Tilottama fashion shop',
  ],
  authors: [{ name: 'Brand for Less' }],
  creator: 'Brand for Less',
  publisher: 'Brand for Less',
  generator: 'Next.js',
  
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: '/',
  },

  openGraph: {
    title: 'Brand for Less - Premium & Budget-Friendly Fashion',
    description:
      'Shop high-quality men\'s clothing, footwear, bags, and accessories at unbeatable prices. Rated 4.8 stars in Tilottama.',
    url: baseUrl,
    siteName: 'Brand for Less',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/logo-ls.png',
        width: 1200,
        height: 630,
        alt: 'Brand for Less Store - Premium & Affordable Fashion',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Brand for Less - Premium Fashion for Less',
    description:
      'Curated collections of clothing, shoes, and bags in Tilottama. Quality fashion, budget-friendly prices.',
    images: ['/logo-ls.png'],
  },

  icons: {
    icon: [
      {
        url: '/logo-ls.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/logo-ls.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/logo-ls.png',
        type: 'image/png',
      },
    ],
    apple: '/logo-ls.png',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  other: {
    'geo.region': 'NP-P5',
    'geo.placename': 'Tilottama',
    'geo.position': '27.6409;83.4721',
    'icbm': '27.6409, 83.4721',
    'telephone': '+9779869613964',
  },
};

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f0f' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={merriweather.variable}>
      <body className="font-sans antialiased">
        {children}
          <Toaster />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
