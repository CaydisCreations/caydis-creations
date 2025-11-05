'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function About() {
  const [showFull, setShowFull] = useState(false);
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 space-y-12 pt-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-[#4A3419]">About Caydi's Creations</h1>
        <p className="mt-2 text-[#4A3419]">Hi, I'm Caydance — but everyone knows me as Caydi — the hands and heart behind Caydi's Creations!</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="relative h-96">
          <img
            src="/caydiSittingPFP.jpg"
            alt="Caydi's Profile"
            className="object-contain rounded-xl shadow-lg w-full h-full"
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#4A3419]">My Story</h2>
          <p className="text-[#4A3419]">
            I'm a crochet artist based in West Haven, Connecticut, creating cozy, handmade pieces that are as unique as the people who wear or use them. Every item I make is crafted with love, care, and a little bit of my personality stitched in.
          </p>
          <p className="text-[#4A3419]">
            By day, I'm an undergraduate at the University of New Haven, studying Criminal Justice and Accounting. And when I'm not buried in textbooks or yarn, you'll probably find me on the rugby field repping my school — Go Chargers!
          </p>
          {!showFull && (
            <button
              className="mt-2 px-4 py-2 bg-[#E8C39E] text-[#4A3419] rounded hover:bg-[#d6b28e] font-bold transition-colors"
              onClick={() => setShowFull(true)}
            >
              Continue Reading
            </button>
          )}
          <AnimatePresence>
            {showFull && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <p className="text-[#4A3419]">
                  I first picked up a crochet hook in the summer of 2023, hoping to make my own stuffed animals. That simple curiosity quickly turned into a passion. While I still adore making plushies, I've fallen in love with creating all kinds of handmade items. Whether it's a cozy hat, a custom order, or a thoughtful gift, I find so much joy in making things that bring comfort, smiles, and a little magic to others.
                </p>
                <p className="text-[#4A3419]">
                  What started as a relaxing hobby has now grown into a heartfelt business rooted in creativity, connection, and the joy of handmade art.
                </p>
                <p className="text-[#4A3419]">
                  Thank you so much for being here and supporting what I do — it truly means the world to me. If you ever want to collaborate on something custom or just say hi, I'd love to hear from you!
                </p>
                <button
                  className="mt-2 px-4 py-2 bg-[#E8C39E] text-[#4A3419] rounded hover:bg-[#d6b28e] font-bold transition-colors"
                  onClick={() => setShowFull(false)}
                >
                  Show Less
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-[#4A3419] mb-4">Our Mission</h3>
          <p className="text-[#4A3419]">
            To create beautiful, high-quality crochet pieces that bring joy and comfort 
            to our customers while maintaining the highest standards of craftsmanship.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-[#4A3419] mb-4">Quality Promise</h3>
          <p className="text-[#4A3419]">
            We use only the finest materials and pay attention to every detail to ensure 
            each piece meets our high standards of quality and durability.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-[#4A3419] mb-4">Custom Orders</h3>
          <p className="text-[#4A3419]">
            We love bringing your ideas to life! Contact us for custom orders and let's 
            create something special together.
          </p>
        </div>
      </div>

      {/* Meet the Developer Section */}
      <div className="grid md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-lg shadow-md">
        <div className="relative h-96">
          <img
            src="/pearsonPFP_hopkins.png"
            alt="Pearson - Developer"
            className="object-cover rounded-xl shadow-lg w-full h-full"
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#4A3419]">Meet the Developer</h2>
          <p className="text-[#4A3419] leading-relaxed">
            My name is Pearson and I am Caydi's brother. I play football at Brown and like to develop websites. It's been awesome working with my sister and I can't wait to see her business grow!
          </p>
          <p className="text-[#4A3419] leading-relaxed">
            If you guys want to learn more about what I do, here's a link to my work: 
            <a 
              href="https://hillwebworks.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#8B4513] hover:text-[#4A3419] font-medium underline transition-colors"
            >
              HillWebWorks.com
            </a>
          </p>
        </div>
      </div>

      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#4A3419]">Ready to Start Shopping?</h2>
        <p className="text-[#4A3419]">
          Browse our collection of handcrafted items or get in touch for custom orders.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/products"
            className="px-6 py-3 bg-[#4A3419] text-[#FFF5E6] rounded hover:bg-[#6B4B26]"
          >
            View Products
          </a>
          <a
            href="/contact"
            className="px-6 py-3 bg-[#4A3419] text-[#FFF5E6] rounded hover:bg-[#6B4B26]"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
} 