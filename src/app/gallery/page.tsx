'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSearch, FaTimes, FaPlay, FaImage, FaVideo } from 'react-icons/fa'
import Image from 'next/image'

// Define types for our media items
interface MediaItem {
  id: string
  type: 'image' | 'video' | 'image-group'
  url: string
  title: string
  description: string
  categories: string[]
  tags: string[]
  date: string
  thumbnail?: string // For videos
  images?: string[] // For image groups
}

// Default video thumbnail component
function DefaultVideoThumbnail({ title }: { title: string }) {
  return (
    <div className="w-full h-full bg-[#4A3419] flex flex-col items-center justify-center p-4">
      <FaVideo className="text-[#E8C39E] text-4xl mb-4" />
      <p className="text-[#FFF5E6] text-center font-medium">{title}</p>
    </div>
  )
}

// Sample media data - you would typically load this from an API or database
const mediaItems: MediaItem[] = [
  {
    id: 'all-hats',
    type: 'image-group',
    url: 'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/BrownHats/IMG_5912.jpeg',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/beanie_dark_colorful/IMG_5924.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/beanie_dark_colorful/IMG_5925.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/beanie_dark_colorful/IMG_5926.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/beanie_dark_colorful/IMG_5927.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/beanie_dark_colorful/IMG_5928.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/blue1/IMG_6109.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/blue1/modeled/IMG_6182.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/blue1/modeled/IMG_6186.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/green_blue_white_brown/IMG_6104.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/green_blue_white_brown/modeled/FullSizeRender%202.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/green_blue_white_brown/modeled/FullSizeRender%203.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/green_blue_white_brown/modeled/FullSizeRender.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/green_blue_white_brown/modeled/IMG_6201.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/red_blue_yellow/IMG_6107.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/red_blue_yellow/modeled/IMG_6207.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/red_blue_yellow/modeled/IMG_6210.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/red_blue_yellow/modeled/IMG_6212.jpeg',
    ],
    title: 'All Beanies',
    description: 'take a look at the beanies I\'ve made!',
    categories: ['Beanies'],
    tags: ['beanies', 'collection'],
    date: '2024-06-10',
  },
  {
    id: 'scarves-collection',
    type: 'image-group',
    url: 'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_white/Modeled/IMG_6236.jpeg',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_white/Modeled/IMG_6236.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_white/Modeled/IMG_6240.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_white/Modeled/IMG_6248.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_white/Modeled/IMG_6251.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_green/Modeled/IMG_6293.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_green/Modeled/IMG_6295.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_green/Modeled/IMG_6299.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_green/Modeled/IMG_6302.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_green/Modeled/IMG_6317.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/green_white/Modeled/IMG_6260.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/green_white/Modeled/IMG_6280.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/green_white/Modeled/IMG_6281.jpeg',
    ],
    title: 'Scarves Collection',
    description: 'A beautiful collection of handmade scarves in various colors and patterns. Perfect for adding warmth and style to any outfit.',
    categories: ['Scarves', 'Accessories'],
    tags: ['scarves', 'winter', 'accessories', 'handmade', 'warmth', 'style'],
    date: '2024-07-28',
  },
  {
    id: '3',
    type: 'video',
    url: '/greenCoatVideo.mp4',
    title: 'Solid Green Crochet Cardigan',
    description: 'A beautiful solid green crochet cardigan. This cardigan was the first one I ever made. It is perfect as a top or light cardigan. Versatile and stylish design.',
    categories: ['Clothing', 'Cardigans', 'Tops'],
    tags: ['green', 'solid', 'cardigan', 'sweatshirt', 'top', 'versatile', 'spring', 'fall'],
    date: '2024-03-16',
    thumbnail: 'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Cardigan/green/green_cardigan_thumbnail.jpg'
  },
  {
    id: '4',
    type: 'video',
    url: '/blueWhiteCoatVideo.mp4',
    title: 'Blue & White Patterned Cardigan',
    description: 'Stunning blue and sky blue patterned crochet cardigan with white accents made from wool yarn. Perfect as a statement piece or everyday wear.',
    categories: ['Clothing', 'Cardigans', 'Patterns'],
    tags: ['blue', 'skyblue', 'white', 'pattern', 'cardigan', 'sweatshirt', 'design', 'colorful'],
    date: '2024-03-16',
    thumbnail: 'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Cardigan/blue_white/blue_white_cardigan_thumbnail.jpg'
  },
  {
    id: 'scrunchie-collection',
    type: 'image-group',
    url: 'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/124e56aa-a007-450c-95ce-7b6050caa8ec.jpeg',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/124e56aa-a007-450c-95ce-7b6050caa8ec.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/3a3374b8-0cd6-420c-b55a-153b576bb7f9.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/60aecdee-8a22-4b8a-92c2-6a53df9f8ac9.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/c4696fba-0026-4f00-ba40-8eb9bc1d24a0.jpeg',
    ],
    title: 'Scrunchie Collection',
    description: 'A collection of handmade scrunchies in a variety of colors and types of yarn. Scroll through!',
    categories: ['Scrunchies', 'Accessories'],
    tags: ['scrunchies', 'hair', 'accessories', 'handmade', 'collection'],
    date: '2024-07-04',
  },
  {
    id: 'brown-beanies',
    type: 'image-group',
    url: 'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/BrownHats/IMG_5912.jpeg',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/BrownHats/IMG_5912.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/BrownHats/IMG_5913.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/BrownHats/IMG_5914.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/BrownHats/IMG_5915.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/BrownHats/IMG_5916.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/BrownHats/IMG_5917.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/BrownHats/IMG_5918.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/BrownHats/IMG_5919.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/BrownHats/IMG_5920.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/BrownHats/IMG_5921.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/BrownHats/IMG_5922.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/BrownHats/IMG_5923.jpeg'
    ],
    title: 'Brown Beanies Collection',
    description: 'A collection of brown beanies with logo patches. Each beanie is hand crocheted from acrylic yarn and features a sewed on logo patch.',
    categories: ['Beanies', 'Accessories'],
    tags: ['brown', 'beanies', 'logo', 'handmade', 'accessories'],
    date: '2024-07-31',
  },
  {
    id: 'blanket-collection',
    type: 'image-group',
    url: 'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Blankets/HeavyMultiColored/FullSizeRender+2.jpeg',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Blankets/HeavyMultiColored/FullSizeRender+2.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Blankets/blanket_squares_pink_purple_white/IMG_5372.JPG',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Blankets/HeavyMultiColored/FullSizeRender+3.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Blankets/blanket_squares_pink_purple_white/IMG_9401.JPG',
    ],
    title: 'Blanket Collection',
    description: 'Handmade blankets',
    categories: ['Blankets'],
    tags: ['blanket', 'pink', 'purple', 'white', 'squares', 'collection'],
    date: '2024-06-10',
  },
  {
    id: 'duffle-bag',
    type: 'image-group',
    url: 'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/duffleBag/IMG_6990.jpg',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/duffleBag/IMG_6990.jpg',      
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/duffleBag/IMG_6988.jpg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/duffleBag/IMG_6989.jpg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/duffleBag/IMG_6986.jpg',
    ],
    title: 'Duffle Bag',
    description: 'A duffle bag made from recycled t-shirts. See the Recycled Products page for more details.',
    categories: ['Bags', 'Recycled'],
    tags: ['duffle bag', 'recycled', 'upcycled', 'bag'],
    date: '2024-07-02',
  },
  {
    id: 'bags-collection',
    type: 'image-group',
    url: 'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6169.jpeg',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6168.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6169.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6171.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/white_blue_green_yellow_red/IMG_6124.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/white_blue_green_yellow_red/IMG_6125.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/white_blue_green_yellow_red/modeled/IMG_6151.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/white_blue_green_yellow_red/modeled/IMG_6152.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/white_blue_green_yellow_red/modeled/IMG_6156.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/IMG_6119.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6157.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6159.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6163.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6164.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6167.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/cream_colored/IMG_6130.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/cream_colored/modeled/IMG_6146.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/cream_colored/modeled/IMG_6149.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/gray/modeled/IMG_6141.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/gray/modeled/IMG_6143.jpeg'
    ],
    title: 'Bags Collection',
    description: 'A collection of handmade bags including handbags, shoulder bags, and duffle bags. Each piece is crafted with care and unique design.',
    categories: ['Bags', 'Accessories'],
    tags: ['bags', 'handbags', 'shoulder bags', 'duffle bags', 'accessories', 'handmade'],
    date: '2024-07-28',
  },
  {
    id: 'recycled-yarn',
    type: 'image-group',
    url: 'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/5956c54e-731a-4c33-8490-130c94bb2ed2.jpeg', // Use the first image as the cover
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/5956c54e-731a-4c33-8490-130c94bb2ed2.jpeg',
    ],
    title: 'Recycled Yarn Collection',
    description: 'handmade yarn from clothes. Perfect when you need strong and thick yarn.',
    categories: ['Yarn', 'Recycled', 'Sustainable'],
    tags: ['recycled', 'yarn', 'upcycled', 'shirts', 'sweatpants', 'hoodie', 'eco-friendly'],
    date: '2024-03-17',
  },
  {
    id: 'recycled-coasters',
    type: 'image-group',
    url: 'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Coasters/IMG_6332.jpeg',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Coasters/IMG_6332.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Coasters/IMG_6333.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Coasters/IMG_6334.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Coasters/IMG_6335.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Coasters/IMG_6336.jpeg',
    ],
    title: 'Recycled Coasters',
    description: 'Handmade coasters crafted from recycled yarn made from cotton and polyester shirts. The blue coaster is made from a cotton shirt and the white coasters from a polyester shirt. Each coaster takes 1 shirt/ball of yarn with extra yarn remaining.',
    categories: ['Coasters', 'Recycled', 'Accessories', 'Home Decor'],
    tags: ['recycled', 'coasters', 'upcycled', 'cotton', 'polyester', 'home decor', 'eco-friendly'],
    date: '2024-08-03',
  },
  {
    id: 'recycled-small-basket',
    type: 'image-group',
    url: 'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/SmallBasket/IMG_6337.jpeg',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/SmallBasket/IMG_6337.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/SmallBasket/IMG_6338.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/SmallBasket/IMG_6339.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/SmallBasket/IMG_6341.jpeg',
    ],
    title: 'Recycled Small Basket',
    description: 'A small basket handmade from recycled yarn made from cotton shirts. It takes 4 shirts to make this functional and beautiful basket. Perfect for storage or as a decorative piece.',
    categories: ['Baskets', 'Recycled', 'Home Decor', 'Storage'],
    tags: ['recycled', 'basket', 'upcycled', 'cotton', 'storage', 'home decor', 'eco-friendly'],
    date: '2024-08-03',
  },
]

// Add 'Accessories' to beanie media items
const updatedMediaItems = mediaItems.map(item => {
  if (item.categories.includes('Beanies') && !item.categories.includes('Accessories')) {
    return { ...item, categories: [...item.categories, 'Accessories'] };
  }
  return item;
});

function GalleryContent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>(updatedMediaItems)
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Get unique categories from media items
  const categories = ['All', ...Array.from(new Set(mediaItems.flatMap(item => item.categories)))
    .filter(cat => !['Tops', 'Clothing', 'Patterns'].includes(cat))];

  // Filter media items based on search term and category
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      let results = updatedMediaItems

      // Filter by category
      if (selectedCategory !== 'All') {
        results = results.filter(item => 
          item.categories.includes(selectedCategory)
        )
      }

      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        results = results.filter(item => 
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
          item.categories.some(cat => cat.toLowerCase().includes(searchLower))
        )
      }

      setFilteredItems(results)
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, selectedCategory])

  const handleMediaClick = (item: MediaItem) => {
    setSelectedMedia(item)
  }

  const closeModal = () => {
    setSelectedMedia(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-8 pt-8">
      <motion.header 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-[#4A3419]">Gallery</h1>
        <p className="mt-2 text-[#4A3419]">Browse our collection of photos and videos</p>
      </motion.header>

      {/* Search and Filter Section */}
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search gallery..."
              className="w-full pl-10 pr-4 py-2 border border-[#E8C39E] rounded-full focus:outline-none focus:ring-2 focus:ring-[#4A3419]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4A3419]" />
            {searchTerm && (
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4A3419] hover:text-red-500"
                onClick={() => setSearchTerm('')}
              >
                <FaTimes />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <motion.button
                key={category}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === category 
                    ? 'bg-[#4A3419] text-[#FFF5E6]' 
                    : 'bg-[#FFF5E6] text-[#4A3419] border border-[#4A3419]'
                } hover:bg-[#6B4B26] hover:text-[#FFF5E6] transition-colors duration-300`}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Gallery Grid */}
      <div className="relative min-h-[400px]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#FFF5E6] bg-opacity-60 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A3419]"></div>
          </div>
        )}
        
        {filteredItems.length === 0 && !isLoading ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xl text-[#4A3419]">No items found. Try a different search or category.</p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredItems.map((item) => (
                <motion.div 
                  key={item.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer group"
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleMediaClick(item)}
                >
                  <div className="relative aspect-square">
                    {item.type === 'video' ? (
                      <>
                        {item.thumbnail ? (
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <DefaultVideoThumbnail title={item.title} />
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                          <FaPlay className="text-white text-4xl" />
                        </div>
                      </>
                    ) : (
                      <Image
                        src={item.url}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[#4A3419] group-hover:text-[#6B4B26] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.categories.map((category) => (
                        <span 
                          key={category}
                          className="text-xs px-2 py-1 bg-[#E8C39E] text-[#4A3419] rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Media Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg max-w-4xl w-full overflow-hidden"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ type: "spring", bounce: 0.3 }}
            >
              <div className="relative">
                {selectedMedia.type === 'video' ? (
                  <div className="relative aspect-video bg-black">
                    <video
                      src={selectedMedia.url}
                      loop
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-contain"
                      poster={selectedMedia.thumbnail}
                    />
                  </div>
                ) : selectedMedia.type === 'image-group' && selectedMedia.images ? (
                  <ImageGroupCarousel images={selectedMedia.images} title={selectedMedia.title} />
                ) : (
                  <div className="relative aspect-video">
                    <Image
                      src={selectedMedia.url}
                      alt={selectedMedia.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <button
                  className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-[#E8C39E] transition-colors duration-300"
                  onClick={closeModal}
                >
                  <FaTimes className="text-[#4A3419]" />
                </button>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-[#4A3419]">{selectedMedia.title}</h2>
                <p className="text-gray-700 mt-2">{selectedMedia.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedMedia.categories.map((category) => (
                    <span 
                      key={category}
                      className="px-3 py-1 bg-[#E8C39E] text-[#4A3419] rounded-full text-sm"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedMedia.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ImageGroupCarousel({ images, title }: { images: string[], title: string }) {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex(i => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex(i => (i === images.length - 1 ? 0 : i + 1));
  return (
    <div className="relative aspect-video flex items-center justify-center bg-black">
      <Image
        src={images[index]}
        alt={title}
        fill
        className="object-contain"
      />
      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 text-[#4A3419] hover:bg-opacity-100">&#8592;</button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 text-[#4A3419] hover:bg-opacity-100">&#8594;</button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <span key={i} className={`inline-block w-2 h-2 rounded-full ${i === index ? 'bg-[#4A3419]' : 'bg-[#E8C39E]'}`}></span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function GalleryPage() {
  return <GalleryContent />
} 