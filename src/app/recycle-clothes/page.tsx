'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaRecycle, FaTshirt, FaYarn, FaHeart, FaArrowRight } from 'react-icons/fa'
import Link from 'next/link'

const duffleBagImages = [
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/5956c54e-731a-4c33-8490-130c94bb2ed2.jpeg',
  '/duffleBag/IMG_6990.jpg',
  '/duffleBag/IMG_6989.jpg',
  '/duffleBag/IMG_6988.jpg',
  '/duffleBag/IMG_6987.jpg',
  '/duffleBag/IMG_6986.jpg',
  '/duffleBag/IMG_6985.jpg',
];

export default function RecycleClothesPage() {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const prevImage = () => setCarouselIndex(i => (i === 0 ? duffleBagImages.length - 1 : i - 1));
  const nextImage = () => setCarouselIndex(i => (i === duffleBagImages.length - 1 ? 0 : i + 1));

  return (
    <div className="min-h-screen bg-[#FFF5E6] py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div 
            className="bg-[#4A3419] p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <FaRecycle className="text-[#FFF5E6] text-3xl" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#4A3419] mb-4">
            Recycle Clothes To Crochet Items
          </h1>
          <p className="text-xl text-[#4A3419] max-w-2xl mx-auto">
            Transform your beloved clothes into beautiful, sustainable crochet pieces. 
            Give new life to your old garments while creating something truly special.
          </p>
        </motion.section>

        {/* Google Form Button at Top */}
        <div className="flex justify-center mb-8">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdfpc5gVq_5kexzuQATl-mTg4b8eRRPUjTi2A9K89NrhMmH9A/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#E8C39E] text-[#4A3419] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#d6b28e] transition-colors duration-300"
          >
            Start Your Recycle Project <FaArrowRight className="inline ml-2" />
          </a>
        </div>

        {/* How It Works Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-[#4A3419] text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md text-center"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-[#E8C39E] p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FaTshirt className="text-[#4A3419] text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-[#4A3419] mb-3">1. Send Your Clothes</h3>
              <p className="text-[#4A3419]">
                Send in your shirts, sweaters, and other clothing items that hold special meaning to you.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md text-center"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-[#E8C39E] p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FaYarn className="text-[#4A3419] text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-[#4A3419] mb-3">2. We Transform to Yarn</h3>
              <p className="text-[#4A3419]">
                We carefully process your clothes into high-quality yarn, preserving the memories and stories they hold.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md text-center"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="bg-[#E8C39E] p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FaHeart className="text-[#4A3419] text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-[#4A3419] mb-3">3. Create Your Item</h3>
              <p className="text-[#4A3419]">
                We craft your chosen crochet item with love, turning your memories into a beautiful, functional piece.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Types of Items We Can Make Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-[#4A3419] text-center mb-8">
            Types of Items We Can Make
          </h2>
          <div className="bg-white p-8 rounded-lg shadow-md text-[#4A3419] text-lg space-y-2">
            <ul className="list-disc ml-6">
              <li>Bags (see duffle bag example below)</li>
              <li>Small baskets</li>
              <li>Coasters</li>
              <li>Thin blankets</li>
            </ul>
          </div>
        </motion.section>

        {/* Duffle Bag Example Section with Carousel */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-[#4A3419] text-center mb-8">
            Duffle Bag Example
          </h2>
          <div className="bg-white p-8 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-full max-w-xs flex-shrink-0">
              <img src={duffleBagImages[carouselIndex]} alt={`Duffle Bag Example ${carouselIndex + 1}`} className="w-full rounded-lg shadow-md object-contain" />
              {duffleBagImages.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 text-[#4A3419] hover:bg-opacity-100">&#8592;</button>
                  <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 text-[#4A3419] hover:bg-opacity-100">&#8594;</button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {duffleBagImages.map((_, i) => (
                      <span key={i} className={`inline-block w-2 h-2 rounded-full ${i === carouselIndex ? 'bg-[#4A3419]' : 'bg-[#E8C39E]'}`}></span>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="text-[#4A3419] text-lg">
              <p className="mb-2"><b>This duffle bag was made out of t-shirts (mainly cotton, some polyester).</b></p>
              <p className="mb-2">It was made out of about 13 shirts/balls of yarn.</p>
              <p className="mb-2">Plain shirts and shirts without side seams work best for this type of project.</p>
            </div>
          </div>
        </motion.section>

        {/* What We Accept Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-[#4A3419] text-center mb-8">
            What We Accept
          </h2>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-[#4A3419] mb-4">✅ Perfect for Recycling:</h3>
                <ul className="space-y-2 text-[#4A3419]">
                  <li>• Wool shirts</li>
                  <li>• Cotton t-shirts and shirts</li>
                  <li>• Polyester, acrylic, velvet</li>
                  <li>• Cotton dresses and skirts</li>
                  <li>• Natural fiber clothing</li>
                  <li>• Thin blankets</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#4A3419] mb-4">❌ Not Suitable:</h3>
                <ul className="space-y-2 text-[#4A3419]">
                  <li>• Fur</li>
                  <li>• Denim</li>
                  <li>• Leather</li>
                  <li>• Lace</li>
                  <li>• Suede</li>
                  <li>• Items with strong odors or metal components</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 text-[#4A3419]">
              <p className="mb-2"><b>Tips for Best Results:</b></p>
              <ul className="list-disc ml-6">
                <li>Try not to send shirts with seams on the sides (see duffle bag example above).</li>
                <li>Try to send plain shirts with no or little design (see duffle bag example above).</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Process Details */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-[#4A3419] text-center mb-8">
            The Process
          </h2>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-[#4A3419] text-[#FFF5E6] rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#4A3419] mb-2">Fill Out the Form</h3>
                  <p className="text-[#4A3419]">
                    Let us know how many clothing items you are sending and if you want something made out of the clothes.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-[#4A3419] text-[#FFF5E6] rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#4A3419] mb-2">Receive Email with Address & Details</h3>
                  <p className="text-[#4A3419]">
                    We will email you the address and details for your order.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-[#4A3419] text-[#FFF5E6] rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#4A3419] mb-2">Send Your Clothes</h3>
                  <p className="text-[#4A3419]">
                    Send your clothes to the provided address. Once received, we will email you an invoice for the order.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-[#4A3419] text-[#FFF5E6] rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#4A3419] mb-2">Invoice & Yarn Creation</h3>
                  <p className="text-[#4A3419]">
                    Once the invoice is paid, we will begin making the yarn from your clothes.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-[#4A3419] text-[#FFF5E6] rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">
                  5
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#4A3419] mb-2">Optional: Item Creation</h3>
                  <p className="text-[#4A3419]">
                    If you want your yarn made into something (like a duffle bag, basket, or coaster), let us know in the form. Additional costs apply (see below).
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-[#4A3419] text-[#FFF5E6] rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">
                  6
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#4A3419] mb-2">Delivery</h3>
                  <p className="text-[#4A3419]">
                    Your finished yarn (and/or item) will be shipped back to you, ready to be enjoyed and cherished.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 p-6 bg-[#FFF5E6] border border-[#E8C39E] rounded-lg text-[#4A3419]">
              <h4 className="text-xl font-bold mb-2">Pricing & Example</h4>
              <ul className="list-disc ml-6 mb-2">
                <li>Every item being turned into yarn: <b>$5 per item</b></li>
                <li>If you want an item made and we need to provide more balls of yarn: <b>$10 per extra ball</b></li>
                <li><b>Example (Duffle Bag):</b> 13 shirts/balls of yarn used → 13 x $5 = $65. Made into a duffle bag: +$15. <b>Total: $80</b></li>
              </ul>
              <div className="mt-2">
                <b>Additional Item Costs:</b>
                <ul className="list-disc ml-6">
                  <li>Coaster: +$5</li>
                  <li>Duffle Bag: +$15</li>
                  <li>Small Basket: +$10</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-[#4A3419] text-[#FFF5E6] p-8 rounded-lg shadow-lg text-center"
        >
          <h2 className="text-2xl font-bold mb-4">
            Ready to Transform Your Clothes?
          </h2>
          <p className="mb-6 text-lg">
            Let's create something beautiful together from your cherished garments.
          </p>
          <motion.a 
            href="https://docs.google.com/forms/d/e/1FAIpQLSdfpc5gVq_5kexzuQATl-mTg4b8eRRPUjTi2A9K89NrhMmH9A/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#E8C39E] text-[#4A3419] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#d6b28e] transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Recycle Project
            <FaArrowRight className="inline ml-2" />
          </motion.a>
        </motion.section>

        {/* Back to Home */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Link 
            href="/"
            className="text-[#4A3419] hover:text-[#E8C39E] font-medium transition-colors duration-300"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
} 