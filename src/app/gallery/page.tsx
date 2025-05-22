'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa'

// Example artwork data
const artworks = [
  {
    id: 1,
    title: 'Rainbow Blanket',
    images: ['/gallery/rainbow-blanket-1.jpg', '/gallery/rainbow-blanket-2.jpg', '/gallery/rainbow-blanket-3.jpg']
  },
  {
    id: 2,
    title: 'Crochet Tote Bag',
    images: ['/gallery/tote-bag-1.jpg', '/gallery/tote-bag-2.jpg']
  },
  {
    id: 3,
    title: 'Amigurumi Cat',
    images: ['/gallery/amigurumi-cat-1.jpg', '/gallery/amigurumi-cat-2.jpg']
  },
  {
    id: 4,
    title: 'Pastel Pillow',
    images: ['/gallery/pastel-pillow-1.jpg']
  },
  {
    id: 5,
    title: 'Floral Coasters',
    images: ['/gallery/floral-coaster-1.jpg', '/gallery/floral-coaster-2.jpg']
  },
  {
    id: 6,
    title: 'Striped Scarf',
    images: ['/gallery/striped-scarf-1.jpg', '/gallery/striped-scarf-2.jpg']
  }
]

export default function Gallery() {
  const [modalOpen, setModalOpen] = useState(false)
  const [activeArtwork, setActiveArtwork] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const openModal = (artwork) => {
    setActiveArtwork(artwork)
    setActiveIndex(0)
    setModalOpen(true)
  }
  const closeModal = () => setModalOpen(false)
  const nextImage = () => setActiveIndex((i) => (i + 1) % activeArtwork.images.length)
  const prevImage = () => setActiveIndex((i) => (i - 1 + activeArtwork.images.length) % activeArtwork.images.length)

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-4xl font-bold text-[#4A3419] mb-8 text-center">Gallery</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {artworks.map((art) => (
          <motion.div
            key={art.id}
            className="relative aspect-square rounded-lg overflow-hidden shadow-lg cursor-pointer group"
            whileHover={{ scale: 1.04 }}
            onClick={() => openModal(art)}
          >
            <Image
              src={art.images[0]}
              alt={art.title}
              fill
              className="object-cover group-hover:brightness-90 transition duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition duration-300 flex items-center justify-center">
              <span className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition">View</span>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {modalOpen && activeArtwork && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden relative"
              initial={{ scale: 0.95, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 40 }}
            >
              <div className="relative w-full h-96 bg-[#E8C39E]">
                <Image
                  src={activeArtwork.images[activeIndex]}
                  alt={activeArtwork.title}
                  fill
                  className="object-contain"
                />
                {activeArtwork.images.length > 1 && (
                  <>
                    <button
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow hover:bg-[#E8C39E]"
                      onClick={prevImage}
                    >
                      <FaChevronLeft className="text-[#4A3419] text-xl" />
                    </button>
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow hover:bg-[#E8C39E]"
                      onClick={nextImage}
                    >
                      <FaChevronRight className="text-[#4A3419] text-xl" />
                    </button>
                  </>
                )}
                <button
                  className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-2 shadow hover:bg-[#E8C39E]"
                  onClick={closeModal}
                >
                  <FaTimes className="text-[#4A3419] text-lg" />
                </button>
              </div>
              <div className="p-4 text-center">
                <h2 className="text-xl font-bold text-[#4A3419]">{activeArtwork.title}</h2>
                <p className="text-[#4A3419] text-sm mt-1">{activeIndex + 1} / {activeArtwork.images.length}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 