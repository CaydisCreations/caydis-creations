"use client"
import React, { useState, useRef } from 'react'
import Image from 'next/image'
import CartIcon from './CartIcon'
import { FaBars, FaTimes } from 'react-icons/fa'
import { useFirebaseAuth } from '../context/FirebaseAuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiLogIn, FiUserPlus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function NavBar() {
  const { user, logout } = useFirebaseAuth();
  const [showLogin, setShowLogin] = React.useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const closeTimeout = useRef<NodeJS.Timeout | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname();
  const { getCartCount } = useCart();

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
      <div className="container mx-auto flex justify-end items-center py-3 px-4">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold transition-transform duration-300 transform hover:scale-105 mr-8 cursor-pointer">
          <span className="relative w-10 h-10 overflow-hidden rounded-full border-2 border-[#E8C39E] shadow-lg">
            <Image src="/logoCaydisCreation.PNG" alt="Logo" fill sizes="(max-width: 768px) 40vw, 40px" className="object-contain" />
          </span>
          <span className="relative">
            Caydi's Creations
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E8C39E] group-hover:w-full transition-all duration-300"></span>
          </span>
        </Link>
        <div className="flex items-center flex-1 justify-end">
          <div className="hidden md:flex space-x-8 mr-8">
            <Link href="/" className="hover:text-[#E8C39E] relative group py-2 cursor-pointer">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E8C39E] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/products" className="hover:text-[#E8C39E] relative group py-2 cursor-pointer">
              Products
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E8C39E] group-hover:w-full transition-all duration-300"></span>
            </Link>
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
                <Link href="/customize-orders" className="block px-6 py-3 hover:bg-[#E8C39E] hover:text-[#4A3419] rounded-t-lg transition-colors cursor-pointer" onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>Customize Orders</Link>
                <Link href="/recycle-clothes" className="block px-6 py-3 hover:bg-[#E8C39E] hover:text-[#4A3419] transition-colors cursor-pointer" onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>Recycled Producted</Link>
                <Link href="/gallery" className="block px-6 py-3 hover:bg-[#E8C39E] hover:text-[#4A3419] rounded-b-lg transition-colors cursor-pointer" onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>Gallery</Link>
              </div>
            </div>
            <Link href="/about" className="hover:text-[#E8C39E] relative group py-2 cursor-pointer">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E8C39E] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/contact" className="hover:text-[#E8C39E] relative group py-2 cursor-pointer">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E8C39E] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/terms" className="hover:text-[#E8C39E] relative group py-2 cursor-pointer">
              Terms
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E8C39E] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/shipping-services" className="hover:text-[#E8C39E] relative group py-2 cursor-pointer">
              Shipping
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E8C39E] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <div className="relative ml-4 group flex items-center cursor-pointer">
                <CartIcon className="w-7 h-7 text-[#FFF5E6] group-hover:text-[#E8C39E] transition-transform duration-200 group-hover:scale-110" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#F7D7B7] to-[#E8C39E] rounded-full p-1 flex items-center shadow-md">
            {!user ? (
              <>
                <Link href="/login">
                  <button className={`flex items-center gap-1 px-3 py-1 text-sm font-bold rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#E8C39E] ${pathname === '/login' ? 'bg-[#4A3419] text-[#FFF5E6]' : 'bg-transparent text-[#4A3419] hover:bg-[#E8C39E]'} cursor-pointer`}> <FiLogIn className="w-4 h-4" /> Log in</button>
                </Link>
                <Link href="/signup">
                  <button className={`flex items-center gap-1 px-3 py-1 text-sm font-bold rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#E8C39E] ${pathname === '/signup' ? 'bg-[#4A3419] text-[#FFF5E6]' : 'bg-transparent text-[#4A3419] hover:bg-[#E8C39E]'} cursor-pointer`}> <FiUserPlus className="w-4 h-4" /> Sign up</button>
                </Link>
              </>
            ) : (
              <div className="relative group">
                <Link href="/account">
                  <button className="flex items-center gap-2 bg-[#4A3419] text-[#FFF5E6] rounded-full px-5 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-[#E8C39E] transition-all cursor-pointer">
                    Account
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                </Link>
                <div className="absolute right-0 mt-2 w-40 bg-white text-[#4A3419] rounded-lg shadow-lg border border-[#E8C39E] z-50 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto">
                  <button onClick={logout} className="w-full text-left px-4 py-3 hover:bg-[#E8C39E] rounded-lg font-semibold cursor-pointer">Log out</button>
                </div>
              </div>
            )}
          </div>
              <button 
            className="md:hidden ml-4 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#E8C39E] cursor-pointer"
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
            className="absolute top-4 right-4 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#E8C39E] cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <FaTimes size={24} />
            </button>
            <nav className="flex flex-col mt-20 space-y-4 px-8">
            <Link href="/" className="py-2 text-lg font-bold hover:text-[#E8C39E] cursor-pointer" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/products" className="py-2 text-lg font-bold hover:text-[#E8C39E] cursor-pointer" onClick={() => setMobileMenuOpen(false)}>Products</Link>
              <div className="border-t border-[#E8C39E] my-2"></div>
              <span className="text-base font-semibold mt-2 mb-1">Create & Explore</span>
            <Link href="/customize-orders" className="py-2 pl-2 text-base hover:text-[#E8C39E] cursor-pointer" onClick={() => setMobileMenuOpen(false)}>Customize Orders</Link>
            <Link href="/recycle-clothes" className="py-2 pl-2 text-base hover:text-[#E8C39E] cursor-pointer" onClick={() => setMobileMenuOpen(false)}>Recycled Producted</Link>
            <Link href="/gallery" className="py-2 pl-2 text-base hover:text-[#E8C39E] cursor-pointer" onClick={() => setMobileMenuOpen(false)}>Gallery</Link>
              <div className="border-t border-[#E8C39E] my-2"></div>
            <Link href="/about" className="py-2 text-lg font-bold hover:text-[#E8C39E] cursor-pointer" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link href="/contact" className="py-2 text-lg font-bold hover:text-[#E8C39E] cursor-pointer" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            <Link href="/terms" className="py-2 text-lg font-bold hover:text-[#E8C39E] cursor-pointer" onClick={() => setMobileMenuOpen(false)}>Terms</Link>
            <Link href="/shipping-services" className="py-2 text-lg font-bold hover:text-[#E8C39E] cursor-pointer" onClick={() => setMobileMenuOpen(false)}>Shipping</Link>
            </nav>
        </div>
      </div>
    </nav>
  )
} 