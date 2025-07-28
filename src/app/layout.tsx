import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import './globals.css'
import { FaEnvelope, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa'
import CartProviderWrapper from './components/CartProviderWrapper'
import CartIcon from './components/CartIcon'
import NavBar from './components/NavBar'
import { FirebaseAuthProvider } from './context/FirebaseAuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Caydi's Creations - Handmade Crochet Art",
  description: 'Beautiful handmade crochet creations crafted with love',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#FFF5E6]">
        <CartProviderWrapper>
          <FirebaseAuthProvider>
            <NavBar />
            <div className="max-w-7xl mx-auto px-4 pt-8">
              {children}
            </div>
            <footer className="bg-[#4A3419] text-[#FFF5E6] p-8 mt-8 shadow-inner">
              <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold border-b border-[#E8C39E] pb-2">About Us</h3>
                  <p>Handcrafted crochet pieces made with love and recycled materials.</p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold border-b border-[#E8C39E] pb-2">Quick Links</h3>
                  <ul className="space-y-2">
                    <li><a href="/products" className="hover:text-[#E8C39E] transition-all duration-200 hover:pl-2">Products</a></li>
                    <li><a href="/customize-orders" className="hover:text-[#E8C39E] transition-all duration-200 hover:pl-2">Customize Orders</a></li>
                    <li><a href="/recycle-clothes" className="hover:text-[#E8C39E] transition-all duration-200 hover:pl-2">Recycled Products</a></li>
                    <li><a href="/gallery" className="hover:text-[#E8C39E] transition-all duration-200 hover:pl-2">Gallery</a></li>
                    <li><a href="/about" className="hover:text-[#E8C39E] transition-all duration-200 hover:pl-2">About Us</a></li>
                    <li><a href="/contact" className="hover:text-[#E8C39E] transition-all duration-200 hover:pl-2">Contact Us</a></li>
                    <li><a href="/cart" className="hover:text-[#E8C39E] transition-all duration-200 hover:pl-2">Shopping Cart</a></li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold border-b border-[#E8C39E] pb-2">Contact Us</h3>
                  <p className="flex items-center"><FaEnvelope className="mr-2" /> caydiscreations@gmail.com</p>
                  <div className="flex items-center mt-2">
                    <a href="https://www.instagram.com/caydiscreations/" target="_blank" rel="noopener noreferrer" className="flex items-center text-[#FFF5E6] hover:text-[#E8C39E] transition-transform duration-300 transform hover:scale-110 gap-2">
                      <FaInstagram size={24} />
                      <span className="font-bold">@caydiscreations</span>
                    </a>
                  </div>
                </div>
              </div>
              <div className="text-center mt-8 pt-4 border-t border-[#E8C39E]">
                <p>© 2025 Caydi's Creations. All rights reserved.</p>
              </div>
            </footer>
          </FirebaseAuthProvider>
        </CartProviderWrapper>
      </body>
    </html>
  )
} 