'use client'

import React, { useEffect, useState } from 'react'
import { FaShoppingCart } from 'react-icons/fa'
import { useCart } from '../context/CartContext'
import Link from 'next/link'

export default function CartIcon({ className = '' }: { className?: string }) {
  const { getCartCount, isLoaded } = useCart()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) {
    // Render a placeholder span to match client/server
    return <span className={className}><FaShoppingCart /></span>
  }

  return (
    <Link href="/cart" className="hover:text-[#E8C39E] transition-transform duration-300 transform hover:scale-110 relative">
      <FaShoppingCart className={className || 'text-xl'} />
      {isLoaded && getCartCount() > 0 && (
        <span className="absolute -top-2 -right-2 bg-[#E8C39E] text-[#4A3419] text-[10px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center shadow border-2 border-white group-hover:scale-110 transition-transform duration-200">
          {getCartCount()}
        </span>
      )}
    </Link>
  )
} 