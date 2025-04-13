import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ScrollToTop } from "@/components/scroll-to-top"
import { AnimatedBackground } from "@/components/animated-background"
import { Analytics } from "@vercel/analytics/react"

import "./globals.css";

import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#03094A' },
    { media: '(prefers-color-scheme: dark)', color: '#1E1E1E' },
  ],
};
export const metadata: Metadata = {
  metadataBase: new URL('https://moodmovie.ca'),
  // SEO de base
  title: "MoodMovie - Films based on your mood",
 description: "Discover movies that match your current state of mind. Find films for any emotion: joy, sadness, fear, anger, or surprise.",
  
  // Contrôle des robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Langue par défaut et alternatives
  alternates: {
    canonical: 'https://moodmovie.ca',
    languages: {
      'en': 'https://moodmovie.ca/en',
    },
  },
  
  // Métadonnées Open Graph pour les partages sociaux
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://moodmovie.ca',
    title: 'MoodMovie - Films based on your mood',
    description: 'Discover movies that match your current state of mind',
    siteName: 'MoodMovie',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MoodMovie - Films based on your mood',
      },
    ],
  },
  
  // Métadonnées pour Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'MoodMovie - Films based on your mood',
    description: 'Discover movies that match your current state of mind',
    images: ['/og-image.jpg'],
    creator: 'aladinakkari.ca',
  },
  
  // Mots-clés (encore utilisés par certains moteurs)
  keywords: ['movies', 'film recommendations', 'mood-based movies', 'film discovery', 'emotional movies', 'cinema', 'entertainment'],
  
  // Icônes (favicons)
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png', 
        sizes: '16x16',
        url: '/favicon-16x16.png',
      },
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#03094A',
      },
    ],
  },
  
  // Manifeste pour les PWA
  manifest: '/site.webmanifest',
  
  // Créateurs et auteurs
  authors: [
    { name: 'Aladin Akkari', url: 'https://aladinakkari.ca' },
  ],
  
  // Catégorie du site
  category: 'entertainment',
  
  // Metadonnées pour Apple
  appleWebApp: {
    title: 'MoodMovie',
    statusBarStyle: 'black-translucent',
    capable: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} radial-bg antialiased min-h-screen flex flex-col`}
      >
        <AnimatedBackground />
        <main className="flex-1">
          {children}
        </main>
        <ScrollToTop />
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}