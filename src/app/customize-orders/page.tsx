'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGift, FaPalette, FaHeart, FaArrowRight, FaImages, FaStar } from 'react-icons/fa'
import Link from 'next/link'

export default function CustomizeOrdersPage() {
  const [activeTab, setActiveTab] = useState('What We Can Create Together');
  const tabs = [
    'What We Can Create Together',
    'Time Frames',
    'Order and Payment Terms',
  ];

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
            href="https://forms.gle/ky8cAJ8cpVJpTAKLA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#E8C39E] text-[#4A3419] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#d6b28e] transition-colors duration-300"
          >
            Start Your Custom Order <FaArrowRight className="inline ml-2" />
          </a>
        </div>

        {/* Gallery Preview Section (See My Experience) */}
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

        {/* What We Can Create Together & Time Frames Toggle Section */}
        <div className="flex justify-center mb-8 gap-4">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`px-6 py-2 rounded-full font-bold transition-colors duration-300 ${activeTab === tab ? 'bg-[#4A3419] text-[#FFF5E6]' : 'bg-[#E8C39E] text-[#4A3419]'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'What We Can Create Together' && (
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
            </div>
          </motion.section>
        )}
        <AnimatePresence mode="wait">
          {activeTab === 'Time Frames' && (
            <motion.div
              key="time-frames"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md p-8 mb-16"
            >
              <h2 className="text-3xl font-bold text-[#4A3419] mb-4">Time Range For How Long Items Take To Make</h2>
              <p className="text-[#4A3419] mb-6">All products range depending on the type of item, these times are not set in stone.</p>
              <ul className="text-lg text-[#4A3419] space-y-2">
                <li><b>Beanies:</b> 1-2 days</li>
                <li><b>Scarves:</b> 2-3 days</li>
                <li><b>Scrunchies:</b> 1 day</li>
                <li><b>Thick yarn Blanket:</b> 2-4 days</li>
                <li><b>Bags:</b> 2-4 days</li>
                <li><b>Cardigans:</b> 2 weeks minimum</li>
                <li><b>Sweaters:</b> 2 weeks minimum</li>
              </ul>
            </motion.div>
          )}
          {activeTab === 'Order and Payment Terms' && (
            <motion.div
              key="order-payment-terms"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md p-8 mb-16"
            >
              <h2 className="text-3xl font-bold text-[#4A3419] mb-4">Order and Payment Terms</h2>
              <ul className="text-lg text-[#4A3419] space-y-4 list-disc pl-6">
                <li>
                  <b>Quote Acceptance & Project Initiation:</b><br />
                  Upon acceptance of the quote and payment of the initial invoice, production of the product will begin. Please note that the final price may vary from the initial estimated quote provided.
                </li>
                <li>
                  <b>Quote Rejection or Non-Payment:</b><br />
                  If the quote is not accepted or the initial invoice is not paid, the order process will be terminated, and no further action will be taken. The Initial invoice must be paid within five (5) business days of issuance.
                </li>
                <li>
                  <b>Final Invoice Payment & Ownership Terms:</b><br />
                  The final invoice must be paid within five (5) business days of issuance. If payment is not received within this period and the customer has not contacted Caydi's Creations, ownership of the completed product will transfer to the company. In such cases, the customer will forfeit any right to receive the product.
                </li>
                <li>
                  <b>Payment Extension Policy:</b><br />
                  A one-time extension of five (5) additional business days may be granted if the customer contacts Caydi's Creations within the original payment period. This extension may be applied to either the initial invoice or the final invoice—but not both. If payment is still not received after the extended period, the customer forfeits all rights to the product.
                </li>
                <li>
                  <b>Company Rights to Product:</b><br />
                  In the event of forfeiture, Caydi's Creations retains full ownership and reserves the right to use, sell, or dispose of the product at its sole discretion.
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
        
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
                <div className="bg-[#4A3419] text-[#FFF5E6] rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">1</div>
                <div>
                  <h3 className="text-lg font-bold text-[#4A3419] mb-2">Fill out form</h3>
                  <p className="text-[#4A3419]">Submit your custom order details using the online form.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-[#4A3419] text-[#FFF5E6] rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">2</div>
                <div>
                  <h3 className="text-lg font-bold text-[#4A3419] mb-2">Get a confirmation email</h3>
                  <p className="text-[#4A3419]">You'll receive an email confirming your request was received.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-[#4A3419] text-[#FFF5E6] rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">3</div>
                <div>
                  <h3 className="text-lg font-bold text-[#4A3419] mb-2">Go over details for order and give a quote</h3>
                  <p className="text-[#4A3419]">We'll discuss your order details and provide a quote after gauging the cost of yarn and materials.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-[#4A3419] text-[#FFF5E6] rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">4</div>
                <div>
                  <h3 className="text-lg font-bold text-[#4A3419] mb-2">Accept quote & pay initial invoice</h3>
                  <p className="text-[#4A3419]">If you accept the quote, you'll receive an initial invoice to cover material costs.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-[#4A3419] text-[#FFF5E6] rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">5</div>
                <div>
                  <h3 className="text-lg font-bold text-[#4A3419] mb-2">Materials purchased & product creation begins</h3>
                  <p className="text-[#4A3419]">After the initial invoice is paid, we will buy all the materials and start making your product.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-[#4A3419] text-[#FFF5E6] rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">6</div>
                <div>
                  <h3 className="text-lg font-bold text-[#4A3419] mb-2">Final invoice & delivery</h3>
                  <p className="text-[#4A3419]">Once your product is finished, you'll receive a final invoice for the remaining balance. After payment, your custom piece will be shipped to you.</p>
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
            href="https://forms.gle/ky8cAJ8cpVJpTAKLA"
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