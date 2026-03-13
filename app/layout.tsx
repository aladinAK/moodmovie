import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ScrollToTop } from "@/components/scroll-to-top"
import { AnimatedBackground } from "@/components/animated-background"
import { Analytics } from "@vercel/analytics/react"
import { FavoritesProvider } from '@/context/favorites-context'
import { WatchedProvider } from '@/context/watched-context'
import { MusicPlayerProvider } from '@/context/music-player-context'
import { MusicMiniPlayer } from '@/components/music-mini-player'


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
const BASE_URL = 'https://moodmovie-by-aladin-akkari.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "MoodMovie — Films, séries, livres & musique selon ton humeur",
    template: "%s | MoodMovie",
  },
  description: "Découvre des films, séries TV, livres et musique adaptés à ton humeur du moment. Joie, tristesse, peur, colère, surprise — laisse tes émotions guider tes découvertes.",
  keywords: [
    'film selon humeur', 'recommendation film', 'série TV mood', 'découverte film',
    'film comédie joie', 'film drame tristesse', 'film horreur peur', 'film action colère',
    'livre selon humeur', 'musique selon humeur', 'recommandation personnalisée',
    'mood movie', 'film recommendation', 'what to watch', 'quoi regarder',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_CA',
    url: BASE_URL,
    title: 'MoodMovie — Films, séries, livres & musique selon ton humeur',
    description: 'Découvre des films, séries TV, livres et musique adaptés à ton humeur du moment.',
    siteName: 'MoodMovie',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'MoodMovie' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MoodMovie — Films, séries & musique selon ton humeur',
    description: 'Découvre des films, séries TV, livres et musique adaptés à ton humeur du moment.',
    images: ['/og-image.jpg'],
    creator: '@aladinakkari',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [{ rel: 'icon', type: 'image/png', sizes: '96x96', url: '/favicon-96x96.png' }],
  },
  manifest: '/site.webmanifest',
  authors: [{ name: 'Aladin Akkari', url: 'https://aladinakkari.ca' }],
  category: 'entertainment',
  appleWebApp: { title: 'MoodMovie', statusBarStyle: 'black-translucent', capable: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} radial-bg antialiased min-h-screen flex flex-col`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "MoodMovie",
            "url": "https://moodmovie-by-aladin-akkari.vercel.app",
            "description": "Découvre des films, séries TV, livres et musique adaptés à ton humeur du moment.",
            "applicationCategory": "EntertainmentApplication",
            "operatingSystem": "Web",
            "inLanguage": "fr",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "CAD" },
            "author": { "@type": "Person", "name": "Aladin Akkari", "url": "https://aladinakkari.ca" },
          })}}
        />
        <MusicPlayerProvider>
        <FavoritesProvider>
        <WatchedProvider>
        <AnimatedBackground />
        <main className="flex-1">
          {children}
        </main>
        <MusicMiniPlayer />
        <ScrollToTop />
        <Footer />
        <Analytics />
        </WatchedProvider>
        </FavoritesProvider>
        </MusicPlayerProvider>
      </body>
    </html>
  );
}