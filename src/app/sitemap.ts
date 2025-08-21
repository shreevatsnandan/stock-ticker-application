import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                 process.env.VERCEL_URL || 
                 'http://localhost:3000';
  
  const formattedBaseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;

  const popularStocks = [
    { symbol: 'RELIANCE', lastModified: new Date() },
    { symbol: 'TCS', lastModified: new Date() },
    { symbol: 'INFY', lastModified: new Date() },
    { symbol: 'HDFCBANK', lastModified: new Date() },
  ];

  return [
    {
      url: formattedBaseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${formattedBaseUrl}/stocks`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    ...popularStocks.map((stock) => ({
      url: `${formattedBaseUrl}/stock/${stock.symbol}`,
      lastModified: stock.lastModified,
      changeFrequency: 'hourly' as const,
      priority: 0.7,
    })),
  ]
}