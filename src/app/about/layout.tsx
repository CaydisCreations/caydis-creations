import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Caydi\'s Creations - Handmade Crochet Art & Story',
  description: 'Learn about Caydi\'s Creations, our passion for handmade crochet art, and our commitment to sustainable, eco-friendly crafting. Discover our story and mission.',
  keywords: [
    'about caydi creations',
    'handmade crochet story',
    'artisan craft story',
    'sustainable crafting',
    'eco-friendly crochet',
    'crochet artist',
    'handmade business',
    'craft passion',
    'recycled materials story'
  ],
  openGraph: {
    title: 'About Caydi\'s Creations - Handmade Crochet Art & Story',
    description: 'Learn about Caydi\'s Creations, our passion for handmade crochet art, and our commitment to sustainable, eco-friendly crafting.',
    images: [
      {
        url: '/logoCaydisCreation.PNG',
        width: 1200,
        height: 630,
        alt: 'About Caydi\'s Creations - Handmade Crochet Art',
      },
    ],
  },
  alternates: {
    canonical: '/about',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
