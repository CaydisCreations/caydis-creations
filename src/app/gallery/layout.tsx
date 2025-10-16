import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crochet Gallery - Handmade Art & Craft Showcase',
  description: 'Browse our gallery of beautiful handmade crochet creations. See our latest handbags, scarves, beanies, and custom pieces. Each item is a unique work of art.',
  keywords: [
    'crochet gallery',
    'handmade art showcase',
    'crochet portfolio',
    'handmade accessories gallery',
    'crochet art display',
    'artisan craft gallery',
    'handmade showcase',
    'crochet inspiration'
  ],
  openGraph: {
    title: 'Crochet Gallery - Handmade Art & Craft Showcase',
    description: 'Browse our gallery of beautiful handmade crochet creations. See our latest handbags, scarves, beanies, and custom pieces.',
    images: [
      {
        url: '/logoCaydisCreation.PNG',
        width: 1200,
        height: 630,
        alt: 'Caydi\'s Creations Gallery - Handmade Crochet Art',
      },
    ],
  },
  alternates: {
    canonical: '/gallery',
  },
}

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
