'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaRecycle, FaTools, FaArrowRight, FaGift, FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa'
import { useCart } from './context/CartContext'
import Link from 'next/link'

  const products = [
    {
      id: 1,
      name: 'Cozy Blanket',
      price: 89.99,
    description: 'A warm and comfortable blanket perfect for cold nights, made from recycled cotton yarn.',
    category: 'Home Decor',
    rating: 4.8
    },
    {
      id: 2,
      name: 'Baby Set',
      price: 49.99,
    description: 'Adorable set including hat, booties, and mittens. Perfect for welcoming a new arrival!',
    category: 'Baby',
    rating: 5.0
    },
    {
      id: 3,
      name: 'Winter Scarf',
      price: 34.99,
    description: 'Soft and stylish scarf to keep you warm. Makes an excellent gift!',
    category: 'Accessories',
    rating: 4.9
    }
  ];

function HomeContent() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleProductClick = (product) => {
    setActiveProduct(product);
    setModalOpen(true);
    setQuantity(1); // Reset quantity when opening modal
  };

  const handleAddToCart = () => {
    addToCart(activeProduct, quantity);
    setModalOpen(false);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className="space-y-16">
      {/* Hero Section with Animation */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-6"
      >
        <motion.div 
          className="relative w-48 h-48 mx-auto"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Image
            src="/logoCaydisCreation.PNG"
            alt="Caydi's Creations Logo"
            fill
            className="object-contain"
          />
        </motion.div>
        <motion.h1 
          className="text-4xl font-bold text-[#4A3419]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Welcome to Caydi's Creations
        </motion.h1>
        <motion.p 
          className="text-xl text-[#4A3419]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Handcrafted crochet pieces made with love
        </motion.p>
      </motion.section>

      {/* Feature Cards with Hover Effects */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-b-4 border-transparent hover:border-[#4A3419]"
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <div className="bg-[#4A3419] p-3 rounded-full mr-4">
              <FaHeart className="text-[#FFF5E6] text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-[#4A3419]">Made With Love</h2>
          </div>
          <p className="text-[#4A3419]">Every stitch is made with care and passion for the craft. Quality and attention to detail is our priority!</p>
          <Link href="/about">
            <motion.button 
              className="mt-4 flex items-center text-[#4A3419] font-medium hover:text-[#E8C39E]"
              whileHover={{ x: 5 }}
            >
              Our story <FaArrowRight className="ml-2" />
            </motion.button>
          </Link>
        </motion.div>

        <motion.div 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-b-4 border-transparent hover:border-[#4A3419]"
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center mb-4">
            <div className="bg-[#4A3419] p-3 rounded-full mr-4">
              <FaGift className="text-[#FFF5E6] text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-[#4A3419]">Customize Orders</h2>
          </div>
          <p className="text-[#4A3419]">Want something unique? We take custom orders to bring your vision to life. Each piece is tailored to your preferences!</p>
          <Link href="/customize-orders">
            <motion.button 
              className="mt-4 flex items-center text-[#4A3419] font-medium hover:text-[#E8C39E]"
              whileHover={{ x: 5 }}
            >
              Request custom item <FaArrowRight className="ml-2" />
            </motion.button>
          </Link>
        </motion.div>

        <motion.div 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-b-4 border-transparent hover:border-[#4A3419]"
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center mb-4">
            <div className="bg-[#4A3419] p-3 rounded-full mr-4">
              <FaRecycle className="text-[#FFF5E6] text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-[#4A3419]">Recycle Clothes To Crochet Items</h2>
          </div>
          <p className="text-[#4A3419]">We take your old clothes and recycle them into a product you will love. Recyclable crochet items made just for you!</p>
          <Link href="/recycle-clothes">
            <motion.button 
              className="mt-4 flex items-center text-[#4A3419] font-medium hover:text-[#E8C39E]"
              whileHover={{ x: 5 }}
            >
              Learn more <FaArrowRight className="ml-2" />
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Featured Products Section */}
      <motion.section 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-[#4A3419] mb-6 relative inline-block">
          Featured Products
          <motion.span 
            className="absolute bottom-0 left-0 w-full h-1 bg-[#E8C39E]"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 1 }}
          ></motion.span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div 
              key={product.id}
              className="bg-white p-6 rounded-lg shadow-md overflow-hidden group cursor-pointer relative"
              whileHover={{ 
                y: -10,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 * index }}
              onClick={() => handleProductClick(product)}
            >
              <div className="bg-[#E8C39E] h-48 rounded-md mb-4 overflow-hidden relative transform group-hover:scale-105 transition-transform duration-500">
                {/* Placeholder for product image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaStar className="text-[#4A3419] text-4xl opacity-20" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#4A3419] group-hover:text-[#E8C39E] transition-colors duration-300">{product.name}</h3>
              <p className="text-[#4A3419] font-bold">${product.price}</p>
              <div className="absolute bottom-0 left-0 right-0 bg-[#4A3419] text-white py-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center">
                <span>View Details</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Call to Action Banner */}
      <motion.section 
        className="bg-[#4A3419] text-[#FFF5E6] p-8 rounded-lg shadow-lg text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        whileHover={{ scale: 1.02 }}
      >
        <h2 className="text-2xl font-bold mb-4">Ready to transform your old clothes into beautiful crochet items?</h2>
        <p className="mb-6">Let us create something special that tells your story!</p>
        <motion.a 
          href="/contact"
          className="inline-block bg-[#E8C39E] text-[#4A3419] px-6 py-3 rounded-lg font-bold hover:bg-[#d6b28e] transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get in Touch Today
        </motion.a>
      </motion.section>

      {/* Product Modal */}
      {modalOpen && activeProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-white rounded-lg max-w-2xl w-full overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <div className="bg-[#E8C39E] h-64 relative">
              {/* Placeholder for product image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <FaStar className="text-[#4A3419] text-6xl opacity-20" />
              </div>
              <button 
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md"
                onClick={() => setModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-[#4A3419]">{activeProduct.name}</h3>
              <div className="flex items-center justify-between mt-2 mb-4">
                <p className="text-2xl font-bold text-[#4A3419]">${activeProduct.price}</p>
                <span className="bg-[#E8C39E] text-[#4A3419] px-3 py-1 rounded-full text-sm">
                  {activeProduct.category}
                </span>
              </div>
              <p className="text-gray-700 mb-6">{activeProduct.description}</p>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center border border-gray-200 rounded-lg p-2">
                  <button 
                    onClick={decrementQuantity} 
                    className="w-8 h-8 flex items-center justify-center bg-[#E8C39E] text-[#4A3419] rounded-full hover:bg-[#d6b28e]"
                  >
                    -
                  </button>
                  <span className="mx-4 text-lg font-medium text-[#4A3419]">{quantity}</span>
                  <button 
                    onClick={incrementQuantity} 
                    className="w-8 h-8 flex items-center justify-center bg-[#E8C39E] text-[#4A3419] rounded-full hover:bg-[#d6b28e]"
                  >
                    +
                  </button>
                </div>
                <motion.button 
                  className="flex items-center justify-center gap-2 bg-[#4A3419] text-white py-3 rounded-lg font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                >
                  <FaShoppingCart /> Add to Cart
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default function HomePage() {
  return <HomeContent />;
} 