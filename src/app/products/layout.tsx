import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Handmade Crochet Products - Handbags, Scarves, Beanies & More',
  description: 'Shop our collection of handmade crochet products including handbags, scarves, beanies, scrunchies, and custom accessories. Each piece is crafted with love using recycled materials.',
  keywords: [
    'crochet handbags',
    'crochet scarves',
    'crochet beanies',
    'crochet scrunchies',
    'handmade accessories',
    'custom crochet',
    'recycled materials',
    'eco-friendly fashion',
    'artisan crafts',
    'unique handbags',
    'crochet art',
    'sustainable fashion'
  ],
  openGraph: {
    title: 'Handmade Crochet Products - Handbags, Scarves, Beanies & More',
    description: 'Shop our collection of handmade crochet products including handbags, scarves, beanies, scrunchies, and custom accessories.',
    images: [
      {
        url: '/logoCaydisCreation.PNG',
        width: 1200,
        height: 630,
        alt: 'Caydi\'s Creations - Handmade Crochet Products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Handmade Crochet Products - Handbags, Scarves, Beanies & More',
    description: 'Shop our collection of handmade crochet products including handbags, scarves, beanies, scrunchies, and custom accessories.',
    images: ['/logoCaydisCreation.PNG'],
  },
  alternates: {
    canonical: '/products',
  },
}

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
