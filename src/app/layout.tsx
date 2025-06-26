import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import './globals.css'
import { FaEnvelope, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa'
import CartWrapper from './components/CartWrapper'
import CartIcon from './components/CartIcon'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Caydi's Creations - Handmade Crochet Art",
  description: 'Beautiful handmade crochet creations crafted with love',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/logoCaydisCreation.PNG" />
      </head>
      <body className={`${inter.className} bg-[#FFF5E6]`}>
        <CartWrapper>
        <nav className="bg-[#4A3419] text-[#FFF5E6] sticky top-0 z-50 shadow-lg transition-all duration-300">
          <div className="container mx-auto flex justify-between items-center py-3 px-4">
            <a href="/" className="flex items-center gap-2 text-2xl font-bold transition-transform duration-300 transform hover:scale-105">
              <span className="relative w-10 h-10 overflow-hidden rounded-full border-2 border-[#E8C39E] shadow-lg">
                <Image src="/logoCaydisCreation.PNG" alt="Logo" fill className="object-contain" />
              </span>
              <span className="relative">
                Caydi's Creations
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E8C39E] group-hover:w-full transition-all duration-300"></span>
              </span>
            </a>
            <div className="flex items-center">
              <div className="hidden md:flex space-x-8 mr-8">
                <a href="/" className="hover:text-[#E8C39E] relative group py-2">
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E8C39E] group-hover:w-full transition-all duration-300"></span>
                </a>
                <a href="/products" className="hover:text-[#E8C39E] relative group py-2">
                  Products
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E8C39E] group-hover:w-full transition-all duration-300"></span>
                </a>
                <a href="/customize-orders" className="hover:text-[#E8C39E] relative group py-2">
                  Customize Orders
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E8C39E] group-hover:w-full transition-all duration-300"></span>
                </a>
                <a href="/recycle-clothes" className="hover:text-[#E8C39E] relative group py-2">
                  Recycle Clothes To Crochet Items
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E8C39E] group-hover:w-full transition-all duration-300"></span>
                </a>
                <a href="/gallery" className="hover:text-[#E8C39E] relative group py-2">
                  Gallery
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E8C39E] group-hover:w-full transition-all duration-300"></span>
                </a>
                <a href="/about" className="hover:text-[#E8C39E] relative group py-2">
                  About
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E8C39E] group-hover:w-full transition-all duration-300"></span>
                </a>
                <a href="/contact" className="hover:text-[#E8C39E] relative group py-2">
                  Contact
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E8C39E] group-hover:w-full transition-all duration-300"></span>
                </a>
              </div>
              <div className="flex items-center space-x-3">
                  <CartIcon />
              </div>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-[#4A3419] text-[#FFF5E6] p-8 mt-8 shadow-inner">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold border-b border-[#E8C39E] pb-2">About Us</h3>
              <p>Handcrafted crochet pieces made with love and recycled materials.</p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-[#FFF5E6] hover:text-[#E8C39E] transition-transform duration-300 transform hover:scale-125">
                  <FaFacebook size={24} />
                </a>
                <a href="#" className="text-[#FFF5E6] hover:text-[#E8C39E] transition-transform duration-300 transform hover:scale-125">
                  <FaInstagram size={24} />
                </a>
                <a href="#" className="text-[#FFF5E6] hover:text-[#E8C39E] transition-transform duration-300 transform hover:scale-125">
                  <FaTwitter size={24} />
                </a>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold border-b border-[#E8C39E] pb-2">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/products" className="hover:text-[#E8C39E] transition-all duration-200 hover:pl-2">
                    Products
                  </a>
                </li>
                <li>
                  <a href="/customize-orders" className="hover:text-[#E8C39E] transition-all duration-200 hover:pl-2">
                    Customize Orders
                  </a>
                </li>
                <li>
                  <a href="/recycle-clothes" className="hover:text-[#E8C39E] transition-all duration-200 hover:pl-2">
                    Recycle Clothes To Crochet Items
                  </a>
                </li>
                <li>
                  <a href="/gallery" className="hover:text-[#E8C39E] transition-all duration-200 hover:pl-2">
                    Gallery
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:text-[#E8C39E] transition-all duration-200 hover:pl-2">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-[#E8C39E] transition-all duration-200 hover:pl-2">
                    Contact Us
                  </a>
                </li>
                  <li>
                    <a href="/cart" className="hover:text-[#E8C39E] transition-all duration-200 hover:pl-2">
                      Shopping Cart
                    </a>
                  </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold border-b border-[#E8C39E] pb-2">Contact Us</h3>
              <p className="flex items-center">
                <FaEnvelope className="mr-2" /> caydicreations@gmail.com
              </p>
              <form className="mt-2">
                <input 
                  type="email" 
                  placeholder="Subscribe to newsletter..." 
                  className="w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#E8C39E] bg-[#FFF5E6] text-[#4A3419]"
                />
                <button className="mt-2 w-full bg-[#E8C39E] text-[#4A3419] p-2 rounded hover:bg-[#d6b28e] transition-colors duration-300">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <div className="text-center mt-8 pt-4 border-t border-[#E8C39E]">
            <p>© 2024 Caydi's Creations. All rights reserved.</p>
          </div>
        </footer>
        </CartWrapper>
      </body>
    </html>
  )
} 