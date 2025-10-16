import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Caydi\'s Creations - Get in Touch for Custom Orders',
  description: 'Contact Caydi\'s Creations for custom crochet orders, questions about our products, or to discuss your unique handmade accessory needs. We\'d love to hear from you!',
  keywords: [
    'contact caydi creations',
    'custom crochet orders',
    'handmade accessories contact',
    'crochet consultation',
    'custom orders',
    'artisan contact',
    'handmade business contact',
    'crochet questions'
  ],
  openGraph: {
    title: 'Contact Caydi\'s Creations - Get in Touch for Custom Orders',
    description: 'Contact Caydi\'s Creations for custom crochet orders, questions about our products, or to discuss your unique handmade accessory needs.',
    images: [
      {
        url: '/logoCaydisCreation.PNG',
        width: 1200,
        height: 630,
        alt: 'Contact Caydi\'s Creations - Custom Crochet Orders',
      },
    ],
  },
  alternates: {
    canonical: '/contact',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
