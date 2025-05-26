'use client'

import React, { useState, useEffect } from 'react'
import { FaShoppingCart } from 'react-icons/fa'
import { useCart } from '../context/CartContext'
import Link from 'next/link'

export default function CartIcon() {
  const { getCartCount } = useCart()
  const [isClient, setIsClient] = useState(false)
  
  // Fix hydration errors by only showing count on client
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <Link href="/cart" className="hover:text-[#E8C39E] transition-transform duration-300 transform hover:scale-110 relative">
      <FaShoppingCart className="text-xl" />
      {isClient && getCartCount() > 0 && (
        <span className="absolute -top-2 -right-2 bg-[#E8C39E] text-[#4A3419] rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
          {getCartCount()}
        </span>
      )}
    </Link>
  )
} 