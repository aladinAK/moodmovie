import { MetadataRoute } from 'next'

const BASE_URL = 'https://moodmovie-by-aladin-akkari.vercel.app'

const moodSlugs = ['joie', 'tristesse', 'choc', 'peur', 'energie', 'surprise']

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...moodSlugs.map((slug) => ({
      url: `${BASE_URL}/mood/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}
