import { MetadataRoute } from 'next'

const BASE_URL = 'https://moodmovie-by-aladin-akkari.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
