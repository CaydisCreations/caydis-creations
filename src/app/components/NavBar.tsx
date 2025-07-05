"use client"
import React, { useState, useRef } from 'react'
import Image from 'next/image'
import CartIcon from './CartIcon'
import { FaBars, FaTimes } from 'react-icons/fa'

export default function NavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const closeTimeout = useRef<NodeJS.Timeout | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const openDropdown = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current)
    setIsDropdownOpen(true)
  }
  const closeDropdown = () => {
    closeTimeout.current = setTimeout(() => setIsDropdownOpen(false), 100)
  }
  const handleDropdownClick = () => {
    setIsDropdownOpen((open) => !open)
  }

  return (
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
            <div 
              className="relative"
              onMouseEnter={openDropdown}
              onMouseLeave={closeDropdown}
            >
              <button 
                onClick={handleDropdownClick}
                className="hover:text-[#E8C39E] relative py-2 font-inherit bg-transparent border-none outline-none cursor-pointer flex items-center"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdown}
              >
                Create & Explore
                <svg className={`ml-1 w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div 
                className={`absolute left-0 mt-0 w-56 bg-white text-[#4A3419] rounded-lg shadow-lg transition-all duration-200 z-50 transform origin-top ${isDropdownOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdown}
              >
                <a 
                  href="/customize-orders" 
                  className="block px-6 py-3 hover:bg-[#E8C39E] hover:text-[#4A3419] rounded-t-lg transition-colors"
                  onMouseEnter={openDropdown}
                  onMouseLeave={closeDropdown}
                >Customize Orders</a>
                <a 
                  href="/recycle-clothes" 
                  className="block px-6 py-3 hover:bg-[#E8C39E] hover:text-[#4A3419] transition-colors"
                  onMouseEnter={openDropdown}
                  onMouseLeave={closeDropdown}
                >Recycled Producted</a>
                <a 
                  href="/gallery" 
                  className="block px-6 py-3 hover:bg-[#E8C39E] hover:text-[#4A3419] rounded-b-lg transition-colors"
                  onMouseEnter={openDropdown}
                  onMouseLeave={closeDropdown}
                >Gallery</a>
              </div>
            </div>
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
              <button 
                className="md:hidden ml-4 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#E8C39E]"
                onClick={() => setMobileMenuOpen(open => !open)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
          </div>
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-40 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
          )}
          <div className={`fixed top-0 right-0 h-full w-64 bg-[#FFF5E6] text-[#4A3419] shadow-lg z-50 transform transition-transform duration-300 md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{minHeight: '100vh'}}>
            <button 
              className="absolute top-4 right-4 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#E8C39E]"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <FaTimes size={24} />
            </button>
            <nav className="flex flex-col mt-20 space-y-4 px-8">
              <a href="/" className="py-2 text-lg font-bold hover:text-[#E8C39E]" onClick={() => setMobileMenuOpen(false)}>Home</a>
              <a href="/products" className="py-2 text-lg font-bold hover:text-[#E8C39E]" onClick={() => setMobileMenuOpen(false)}>Products</a>
              <div className="border-t border-[#E8C39E] my-2"></div>
              <span className="text-base font-semibold mt-2 mb-1">Create & Explore</span>
              <a href="/customize-orders" className="py-2 pl-2 text-base hover:text-[#E8C39E]" onClick={() => setMobileMenuOpen(false)}>Customize Orders</a>
              <a href="/recycle-clothes" className="py-2 pl-2 text-base hover:text-[#E8C39E]" onClick={() => setMobileMenuOpen(false)}>Recycled Producted</a>
              <a href="/gallery" className="py-2 pl-2 text-base hover:text-[#E8C39E]" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
              <div className="border-t border-[#E8C39E] my-2"></div>
              <a href="/about" className="py-2 text-lg font-bold hover:text-[#E8C39E]" onClick={() => setMobileMenuOpen(false)}>About</a>
              <a href="/contact" className="py-2 text-lg font-bold hover:text-[#E8C39E]" onClick={() => setMobileMenuOpen(false)}>Contact</a>
            </nav>
          </div>
        </div>
      </div>
    </nav>
  )
} 