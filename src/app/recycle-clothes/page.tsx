'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FaRecycle, FaTshirt, FaYarn, FaHeart, FaArrowRight } from 'react-icons/fa'
import Link from 'next/link'

export default function RecycleClothesPage() {
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

        {/* How It Works Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
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

        {/* What We Accept Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
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
                  <li>• Cotton t-shirts and shirts</li>
                  <li>• Wool sweaters and cardigans</li>
                  <li>• Cotton dresses and skirts</li>
                  <li>• Natural fiber clothing</li>
                  <li>• Baby clothes and blankets</li>
                  <li>• Scarves and accessories</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#4A3419] mb-4">❌ Not Suitable:</h3>
                <ul className="space-y-2 text-[#4A3419]">
                  <li>• Synthetic fabrics (polyester, nylon)</li>
                  <li>• Heavily stained or damaged items</li>
                  <li>• Items with strong odors</li>
                  <li>• Leather or suede</li>
                  <li>• Items with metal components</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Process Details */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
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
                  <h3 className="text-lg font-bold text-[#4A3419] mb-2">Consultation & Planning</h3>
                  <p className="text-[#4A3419]">
                    We'll discuss what you'd like to create and help you choose the perfect item for your recycled yarn.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-[#4A3419] text-[#FFF5E6] rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#4A3419] mb-2">Send Your Clothes</h3>
                  <p className="text-[#4A3419]">
                    Package and send your clothes to us. We'll provide shipping instructions and track your items.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-[#4A3419] text-[#FFF5E6] rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#4A3419] mb-2">Yarn Creation</h3>
                  <p className="text-[#4A3419]">
                    We carefully process your clothes into yarn, ensuring quality and preserving the character of your garments.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-[#4A3419] text-[#FFF5E6] rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#4A3419] mb-2">Handcrafting</h3>
                  <p className="text-[#4A3419]">
                    Your chosen item is lovingly crafted by hand, creating a unique piece that carries your story.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-[#4A3419] text-[#FFF5E6] rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">
                  5
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#4A3419] mb-2">Delivery</h3>
                  <p className="text-[#4A3419]">
                    Your finished piece is carefully packaged and shipped back to you, ready to be enjoyed and cherished.
                  </p>
                </div>
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
            href="https://forms.google.com/temp-recycle-form"
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