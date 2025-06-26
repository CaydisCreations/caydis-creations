'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FaGift, FaPalette, FaHeart, FaArrowRight, FaImages, FaStar } from 'react-icons/fa'
import Link from 'next/link'

export default function CustomizeOrdersPage() {
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
            <FaGift className="text-[#FFF5E6] text-3xl" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#4A3419] mb-4">
            Customize Orders
          </h1>
          <p className="text-xl text-[#4A3419] max-w-2xl mx-auto">
            Bring your vision to life with a custom crochet piece designed just for you. 
            Every stitch tells your unique story.
          </p>
        </motion.section>

        {/* Google Form Button at Top */}
        <div className="flex justify-center mb-8">
          <a
            href="https://forms.google.com/temp-custom-form"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#E8C39E] text-[#4A3419] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#d6b28e] transition-colors duration-300"
          >
            Start Your Custom Order <FaArrowRight className="inline ml-2" />
          </a>
        </div>

        {/* Gallery Preview Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="bg-[#E8C39E] p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FaImages className="text-[#4A3419] text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-[#4A3419] mb-4">
              See My Experience
            </h2>
            <p className="text-[#4A3419] mb-6 text-lg">
              Take a look at my gallery to see examples of my work and get inspired for your custom piece.
            </p>
            <motion.div className="flex justify-center space-x-4">
              <Link 
                href="/gallery"
                className="inline-flex items-center bg-[#4A3419] text-[#FFF5E6] px-6 py-3 rounded-lg font-medium hover:bg-[#3a2a15] transition-colors duration-300"
              >
                <FaImages className="mr-2" />
                View Gallery
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* What We Can Create Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-[#4A3419] text-center mb-12">
            What We Can Create Together
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <h3 className="text-xl font-bold text-[#4A3419] mb-3">Home Decor</h3>
              <p className="text-[#4A3419]">
                Blankets and decorative pieces that add warmth to your space.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md text-center"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="bg-[#E8C39E] p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FaGift className="text-[#4A3419] text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-[#4A3419] mb-3">Accessories</h3>
              <p className="text-[#4A3419]">
                Scarves, hats, bags, and other accessories that showcase your personal style.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md text-center"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <div className="bg-[#E8C39E] p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FaStar className="text-[#4A3419] text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-[#4A3419] mb-3">Baby Items</h3>
              <p className="text-[#4A3419]">
                Special blankets and hats made with love for little ones.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md text-center"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <div className="bg-[#E8C39E] p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FaHeart className="text-[#4A3419] text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-[#4A3419] mb-3">Gift Items</h3>
              <p className="text-[#4A3419]">
                Thoughtful gifts for special occasions and loved ones.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Customization Process */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-[#4A3419] text-center mb-8">
            The Customization Process
          </h2>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-[#4A3419] text-[#FFF5E6] rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#4A3419] mb-2">Share Your Vision</h3>
                  <p className="text-[#4A3419]">
                    Tell me about your idea, preferences, colors, size, and any special requirements you have in mind.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-[#4A3419] text-[#FFF5E6] rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#4A3419] mb-2">Design Consultation</h3>
                  <p className="text-[#4A3419]">
                    We'll discuss patterns, yarn options, and create a plan that brings your vision to life.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-[#4A3419] text-[#FFF5E6] rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#4A3419] mb-2">Quote & Timeline</h3>
                  <p className="text-[#4A3419]">
                    I'll provide a detailed quote and estimated timeline for your custom piece.
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
                    Your piece is lovingly crafted by hand, with regular updates on progress.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-[#4A3419] text-[#FFF5E6] rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">
                  5
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#4A3419] mb-2">Final Delivery</h3>
                  <p className="text-[#4A3419]">
                    Your custom piece is carefully packaged and delivered, ready to be cherished.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* What to Include in Your Request */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-[#4A3419] text-center mb-8">
            What to Include in Your Request
          </h2>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-[#4A3419] mb-4">Essential Details:</h3>
                <ul className="space-y-2 text-[#4A3419]">
                  <li>• Type of item you want</li>
                  <li>• Preferred colors and style</li>
                  <li>• Size requirements</li>
                  <li>• Any special features</li>
                  <li>• Timeline preferences</li>
                  <li>• Budget considerations</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#4A3419] mb-4">Helpful Extras:</h3>
                <ul className="space-y-2 text-[#4A3419]">
                  <li>• Reference images</li>
                  <li>• Personal stories or meaning</li>
                  <li>• Specific yarn preferences</li>
                  <li>• Pattern inspiration</li>
                  <li>• Special occasions</li>
                  <li>• Recipient details (if gift)</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="bg-[#4A3419] text-[#FFF5E6] p-8 rounded-lg shadow-lg text-center"
        >
          <h2 className="text-2xl font-bold mb-4">
            Ready to Create Something Special?
          </h2>
          <p className="mb-6 text-lg">
            Let's bring your vision to life with a custom crochet piece made just for you.
          </p>
          <motion.a 
            href="https://forms.google.com/temp-custom-form"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#E8C39E] text-[#4A3419] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#d6b28e] transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Custom Order
            <FaArrowRight className="inline ml-2" />
          </motion.a>
        </motion.section>

        {/* Back to Home */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
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