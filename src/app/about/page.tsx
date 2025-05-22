import React from 'react'
import Image from 'next/image'

export default function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-[#4A3419]">About Caydi's Creations</h1>
        <p className="mt-2 text-[#4A3419]">Crafting beautiful crochet pieces with love and dedication</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="relative h-96">
          <Image
            src="/caydiPFP.jpg"
            alt="Caydi's Profile"
            fill
            className="object-contain rounded-xl shadow-lg"
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#4A3419]">Our Story</h2>
          <p className="text-[#4A3419]">
            Welcome to Caydi's Creations, where every stitch tells a story of passion and creativity. 
            What started as a love for crochet has blossomed into a dedicated craft business, 
            bringing warmth and comfort to homes through handmade pieces.
          </p>
          <p className="text-[#4A3419]">
            Each item in our collection is carefully crafted using premium materials, 
            ensuring both beauty and durability. We take pride in creating pieces that 
            become cherished parts of your home and daily life.
          </p>
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