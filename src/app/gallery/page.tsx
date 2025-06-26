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
    id: '1',
    type: 'image',
    url: '/gallery/cozy-blanket.jpg',
    title: 'Cozy Winter Blanket',
    description: 'A warm and comfortable blanket perfect for cold nights',
    categories: ['Home Decor', 'Blankets'],
    tags: ['winter', 'cozy', 'blanket', 'home'],
    date: '2024-03-15'
  },
  {
    id: '2',
    type: 'video',
    url: '/gallery/beanie-making.mp4',
    title: 'Beanie Making Process',
    description: 'Watch how we create our signature beanies',
    categories: ['Accessories', 'Hats'],
    tags: ['beanie', 'hat', 'process', 'tutorial'],
    date: '2024-03-14',
    thumbnail: '/gallery/beanie-thumbnail.jpg'
  },
  {
    id: '3',
    type: 'video',
    url: '/greenCoatVideo.mp4',
    title: 'Solid Green Crochet Coat',
    description: 'A beautiful solid green crochet coat, perfect as a top, sweatshirt, or light coat. Versatile and stylish design.',
    categories: ['Clothing', 'Coats', 'Tops'],
    tags: ['green', 'solid', 'coat', 'sweatshirt', 'top', 'versatile', 'spring', 'fall'],
    date: '2024-03-16'
  },
  {
    id: '4',
    type: 'video',
    url: '/blueWhiteCoatVideo.mp4',
    title: 'Blue & White Patterned Coat',
    description: 'Stunning blue and sky blue patterned crochet coat with white accents. Perfect as a statement piece or everyday wear.',
    categories: ['Clothing', 'Coats', 'Patterns'],
    tags: ['blue', 'skyblue', 'white', 'pattern', 'coat', 'sweatshirt', 'design', 'colorful'],
    date: '2024-03-16'
  },
  {
    id: 'recycled-yarn',
    type: 'image-group',
    url: '/recycledYarn/IMG_5871.jpeg', // Use the first image as the cover
    images: [
      '/recycledYarn/IMG_5871.jpeg',
      '/recycledYarn/IMG_5872.jpeg',
      '/recycledYarn/IMG_5873.jpeg',
      '/recycledYarn/IMG_5874.jpeg',
      '/recycledYarn/IMG_5875.jpeg',
    ],
    title: 'Recycled Yarn Collection',
    description: 'photos, recycled yarn using clothes like shirts, sweatpants, hoodie',
    categories: ['Yarn', 'Recycled', 'Sustainable'],
    tags: ['recycled', 'yarn', 'upcycled', 'shirts', 'sweatpants', 'hoodie', 'eco-friendly'],
    date: '2024-03-17',
  },
]

function GalleryContent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>(mediaItems)
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Get unique categories from media items
  const categories = ['All', ...new Set(mediaItems.flatMap(item => item.categories))]

  // Filter media items based on search term and category
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      let results = mediaItems

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
    <div className="space-y-8">
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