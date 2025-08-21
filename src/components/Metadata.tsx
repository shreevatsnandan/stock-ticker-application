'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';

interface MetadataProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  publishedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export default function Metadata({
  title = "TradeBrains - Stock Market Analysis & Trading Platform",
  description = "Real-time stock market data, technical analysis, and trading insights. Track NSE, BSE stocks with advanced charts and indicators.",
  keywords = "stocks, trading, NSE, BSE, stock market, share market, technical analysis, investing, portfolio",
  image = "/og-image.png",
  url,
  type = "website",
  publishedTime,
  author,
  section,
  tags = [],
}: MetadataProps) {
  const pathname = usePathname();
  const fullTitle = title.includes("TradeBrains") ? title : `${title} | TradeBrains`;
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                 (typeof window !== 'undefined' ? window.location.origin : '');
  
  const fullUrl = url || `${baseUrl}${pathname}`;
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author || "TradeBrains"} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content="TradeBrains" />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />

      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {author && <meta property="article:author" content={author} />}
      {section && <meta property="article:section" content={section} />}
      {tags.length > 0 && (
        tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))
      )}

      <link rel="canonical" href={fullUrl} />

      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialService",
            "name": "TradeBrains",
            "description": description,
            "url": baseUrl,
            "logo": `${baseUrl}/logo.png`,
          })
        }}
      />
    </Head>
  );
}