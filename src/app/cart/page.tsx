'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaShoppingCart, FaTrash, FaStar } from 'react-icons/fa'
import { useCart } from '../context/CartContext'
import Link from 'next/link'

function CartContent() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
  const [isClient, setIsClient] = useState(false)
  const [loading, setLoading] = useState(false)

  // Fix for hydration errors by only rendering on client
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems })
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Failed to redirect to checkout.')
        setLoading(false)
      }
    } catch (err) {
      alert('Error starting checkout. Please try again.')
      setLoading(false)
    }
  }

  if (!isClient) {
    return <div className="p-8 text-center">Loading cart...</div>
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <FaShoppingCart className="text-[#4A3419] text-6xl opacity-50 mb-4" />
        <h1 className="text-3xl font-bold text-[#4A3419] mb-4">Your cart is empty</h1>
        <p className="text-[#4A3419] mb-8">Looks like you haven't added any products to your cart yet.</p>
        <Link 
          href="/products"
          className="bg-[#4A3419] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#6B4B26] transition-colors duration-300"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.header 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-[#4A3419]">Your Shopping Cart</h1>
        <p className="mt-2 text-[#4A3419]">Review your items before checkout</p>
      </motion.header>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-6 gap-4 font-semibold text-[#4A3419] mb-4">
            <div className="col-span-3">Product</div>
            <div className="text-center">Price</div>
            <div className="text-center">Quantity</div>
            <div className="text-right">Total</div>
          </div>

          <AnimatePresence>
            {cartItems.map(item => (
              <motion.div 
                key={item.id}
                className="grid grid-cols-6 gap-4 py-4 items-center border-b border-gray-100 last:border-b-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <div className="col-span-3 flex items-center space-x-4">
                  <div className="bg-[#E8C39E] h-16 w-16 rounded-md overflow-hidden relative">
                    {/* Placeholder for product image */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FaStar className="text-[#4A3419] text-xl opacity-20" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#4A3419]">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>
                </div>

                <div className="text-center">
                  ${item.price.toFixed(2)}
                </div>

                <div className="flex items-center justify-center">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center bg-[#E8C39E] text-[#4A3419] rounded-full hover:bg-[#d6b28e]"
                  >
                    -
                  </button>
                  <span className="mx-3 text-[#4A3419] w-8 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center bg-[#E8C39E] text-[#4A3419] rounded-full hover:bg-[#d6b28e]"
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center justify-end space-x-2">
                  <span className="font-bold text-[#4A3419]">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 hover:bg-red-100 text-red-500 rounded-full transition-colors duration-300"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="p-6 bg-[#FFF5E6] border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <button 
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 flex items-center"
              >
                <FaTimes className="mr-2" /> Clear Cart
              </button>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-[#4A3419]">
                Subtotal: <span className="text-2xl ml-2">${getCartTotal().toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">Taxes and shipping calculated at checkout</p>
              <div className="space-x-4">
                <Link
                  href="/products"
                  className="px-6 py-2 border border-[#4A3419] text-[#4A3419] rounded-lg hover:bg-[#E8C39E] transition-colors duration-300"
                >
                  Continue Shopping
                </Link>
                <motion.button 
                  className="px-6 py-2 bg-[#4A3419] text-white rounded-lg hover:bg-[#6B4B26] transition-colors duration-300 disabled:opacity-60"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? 'Redirecting...' : 'Proceed to Checkout'}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CartPage() {
  return <CartContent />;
} 