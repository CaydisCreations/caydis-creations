'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { useCart } from '../context/CartContext'

export default function Navigation() {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'
  const isSignupPage = pathname === '/signup'
  const { getCartCount, isLoaded } = useCart()

  return (
    <nav className="bg-[#4A3419] text-[#FFF5E6] sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2 text-2xl font-bold">
            <span className="relative w-10 h-10 overflow-hidden rounded-full border-2 border-[#E8C39E] shadow-lg">
              <img src="/logoCaydisCreation.PNG" alt="Logo" className="w-full h-full object-contain" />
            </span>
            <span>Caydi's Creations</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a href="/" className="hover:text-[#E8C39E] transition-colors">Home</a>
            <a href="/products" className="hover:text-[#E8C39E] transition-colors">Products</a>
            
            {/* Create & Explore Dropdown */}
            <div className="relative group">
              <button className="hover:text-[#E8C39E] transition-colors flex items-center gap-1">
                Create & Explore
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <a href="/customize-orders" className="block px-4 py-2 text-[#4A3419] hover:bg-[#E8C39E]">Customize Orders</a>
                  <a href="/recycle-clothes" className="block px-4 py-2 text-[#4A3419] hover:bg-[#E8C39E]">Recycle Clothes</a>
                  <a href="/gallery" className="block px-4 py-2 text-[#4A3419] hover:bg-[#E8C39E]">Gallery</a>
                </div>
              </div>
            </div>

            <a href="/about" className="hover:text-[#E8C39E] transition-colors">About</a>
            <a href="/contact" className="hover:text-[#E8C39E] transition-colors">Contact</a>
            <a href="/terms" className="hover:text-[#E8C39E] transition-colors">Terms</a>
          </div>

          {/* Right Side - Cart and Auth */}
          <div className="flex items-center gap-4">
            {/* Shopping Cart */}
            <a href="/cart" className="relative hover:text-[#E8C39E] transition-colors mr-2">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm12.75 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
              {isLoaded && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {getCartCount()}
                </span>
              )}
            </a>

            {/* Auth Buttons Container */}
            <div className="hidden md:flex items-center">
              <div className="bg-[#E8C39E] border border-[#4A3419] rounded-full px-1 py-1 flex items-center gap-0">
                <a 
                  href="/login" 
                  className={`px-4 py-2 rounded-full transition-all duration-200 text-sm font-bold flex items-center gap-2 hover:scale-105 ${
                    isLoginPage 
                      ? 'bg-[#4A3419] text-[#E8C39E]' 
                      : 'bg-[#E8C39E] text-[#4A3419] hover:bg-[#D4B08C]'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.716 17.716 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  Log in
                </a>
                <a 
                  href="/signup" 
                  className={`px-4 py-2 rounded-full transition-all duration-200 text-sm font-bold flex items-center gap-2 hover:scale-105 ${
                    isSignupPage 
                      ? 'bg-[#4A3419] text-[#E8C39E]' 
                      : 'bg-[#E8C39E] text-[#4A3419] hover:bg-[#D4B08C]'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                  </svg>
                  Sign up
                </a>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-[#FFF5E6] hover:text-[#E8C39E] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className="md:hidden mt-4 pb-4 border-t border-[#E8C39E] pt-4">
          <div className="flex flex-col space-y-3">
            <a href="/" className="hover:text-[#E8C39E] transition-colors">Home</a>
            <a href="/products" className="hover:text-[#E8C39E] transition-colors">Products</a>
            <a href="/customize-orders" className="hover:text-[#E8C39E] transition-colors">Customize Orders</a>
            <a href="/recycle-clothes" className="hover:text-[#E8C39E] transition-colors">Recycle Clothes</a>
            <a href="/gallery" className="hover:text-[#E8C39E] transition-colors">Gallery</a>
            <a href="/about" className="hover:text-[#E8C39E] transition-colors">About</a>
            <a href="/contact" className="hover:text-[#E8C39E] transition-colors">Contact</a>
            <a href="/terms" className="hover:text-[#E8C39E] transition-colors">Terms</a>
            <div className="flex gap-2 pt-2">
              <div className="bg-[#E8C39E] border border-[#4A3419] rounded-full px-1 py-1 flex items-center gap-0 w-full">
                <a 
                  href="/login" 
                  className={`px-4 py-2 rounded-full transition-all duration-200 text-sm font-bold flex-1 text-center flex items-center justify-center gap-2 hover:scale-105 ${
                    isLoginPage 
                      ? 'bg-[#4A3419] text-[#E8C39E]' 
                      : 'bg-[#E8C39E] text-[#4A3419] hover:bg-[#D4B08C]'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.716 17.716 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  Log in
                </a>
                <a 
                  href="/signup" 
                  className={`px-4 py-2 rounded-full transition-all duration-200 text-sm font-bold flex-1 text-center flex items-center justify-center gap-2 hover:scale-105 ${
                    isSignupPage 
                      ? 'bg-[#4A3419] text-[#E8C39E]' 
                      : 'bg-[#E8C39E] text-[#4A3419] hover:bg-[#D4B08C]'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                  </svg>
                  Sign up
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
