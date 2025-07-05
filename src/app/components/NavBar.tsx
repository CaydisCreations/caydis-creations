"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import CartIcon from './CartIcon'

export default function NavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isDropdownHovered, setIsDropdownHovered] = useState(false)

  // Dropdown is open if either clicked or hovered
  const dropdownOpen = isDropdownOpen || isDropdownHovered

  const toggleDropdown = () => {
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
              onMouseEnter={() => setIsDropdownHovered(true)}
              onMouseLeave={() => setIsDropdownHovered(false)}
            >
              <button 
                onClick={toggleDropdown}
                className="hover:text-[#E8C39E] relative py-2 font-inherit bg-transparent border-none outline-none cursor-pointer flex items-center"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                Create & Explore
                <svg className={`ml-1 w-4 h-4 transition-transform duration-50 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className={`absolute left-0 mt-2 w-56 bg-white text-[#4A3419] rounded-lg shadow-lg transition-all duration-200 z-50 transform origin-top ${dropdownOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <a href="/customize-orders" className="block px-6 py-3 hover:bg-[#E8C39E] hover:text-[#4A3419] rounded-t-lg transition-colors">Customize Orders</a>
                <a href="/recycle-clothes" className="block px-6 py-3 hover:bg-[#E8C39E] hover:text-[#4A3419] transition-colors">Recycled Producted</a>
                <a href="/gallery" className="block px-6 py-3 hover:bg-[#E8C39E] hover:text-[#4A3419] rounded-b-lg transition-colors">Gallery</a>
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
          </div>
        </div>
      </div>
    </nav>
  )
} 