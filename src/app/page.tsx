'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FaRecycle, FaTools, FaArrowRight, FaGift, FaStar, FaShoppingCart, FaHeart, FaTimes } from 'react-icons/fa'
import { useCart } from './context/CartContext'
import Link from 'next/link'

function HomeContent() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [allProducts, setAllProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stripe-products')
      .then(res => res.json())
      .then(data => {
        setAllProducts(data.products || []);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!allProducts.length) return;
    // Feature specific products: Scrunchie Set 2, Beanie - Blue, Scarf - White, and a bag
    const scrunchieSet2 = allProducts.find(p => p.name === 'Scrunchie Set 2');
    const beanieBlue = allProducts.find(p => p.name === 'Beanie - Blue');
    const scarfWhite = allProducts.find(p => p.name === 'Scarf - White');
    const bag = allProducts.find(p => p.metadata?.category === 'Bags' && p.name !== 'Shoulder Bag - Brown');
    setFeaturedProducts([scrunchieSet2, beanieBlue, scarfWhite, bag].filter(Boolean));
  }, [allProducts]);

  const handleProductClick = (product) => {
    setActiveProduct(product);
    setModalOpen(true);
    setQuantity(1); // Reset quantity when opening modal
  };

  const handleAddToCart = () => {
    addToCart({ ...activeProduct, priceId: activeProduct.priceId }, quantity);
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
            src="https://caydiscreations.s3.us-east-2.amazonaws.com/Public/logoCaydisCreation.PNG"
            alt="Caydi's Creations Logo"
            fill
            sizes="(max-width: 768px) 100vw, 384px"
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
        <Link href="/about" className="group">
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-2 border-b-4 border-transparent hover:border-[#4A3419] cursor-pointer h-full flex flex-col"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center mb-4">
              <div className="bg-[#4A3419] p-3 rounded-full mr-4">
                <FaHeart className="text-[#FFF5E6] text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-[#4A3419]">Made With Love</h2>
            </div>
            <p className="text-[#4A3419] flex-1">Every stitch is made with care and passion for the craft. Quality and attention to detail is our priority!</p>
            <span className="mt-4 flex items-center text-[#4A3419] font-medium group-hover:text-[#E8C39E] transition-colors">
              Our story <FaArrowRight className="ml-2" />
            </span>
          </motion.div>
        </Link>

        <Link href="/customize-orders" className="group">
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-2 border-b-4 border-transparent hover:border-[#4A3419] cursor-pointer h-full flex flex-col"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <div className="flex items-center mb-4">
              <div className="bg-[#4A3419] p-3 rounded-full mr-4">
                <FaGift className="text-[#FFF5E6] text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-[#4A3419]">Customize Orders</h2>
            </div>
            <p className="text-[#4A3419] flex-1">Want something unique? We take custom orders to bring your vision to life. Each piece is tailored to your preferences!</p>
            <span className="mt-4 flex items-center text-[#4A3419] font-medium group-hover:text-[#E8C39E] transition-colors">
              Request custom item <FaArrowRight className="ml-2" />
            </span>
          </motion.div>
        </Link>

        <Link href="/recycle-clothes" className="group">
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-2 border-b-4 border-transparent hover:border-[#4A3419] cursor-pointer h-full flex flex-col"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          >
            <div className="flex items-center mb-4">
              <div className="bg-[#4A3419] p-3 rounded-full mr-4">
                <FaRecycle className="text-[#FFF5E6] text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-[#4A3419]">Recycle Clothes To Crochet Items</h2>
            </div>
            <p className="text-[#4A3419] flex-1">We take your old clothes and recycle them into a product you will love. Recyclable crochet items made just for you!</p>
            <span className="mt-4 flex items-center text-[#4A3419] font-medium group-hover:text-[#E8C39E] transition-colors">
              Learn more <FaArrowRight className="ml-2" />
            </span>
          </motion.div>
        </Link>
      </section>

      {/* Featured Products Section */}
      <motion.section 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between items-center gap-4 mt-12 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#4A3419] mb-2 md:mb-0 border-b-4 border-[#E8C39E] inline-block">Featured Products</h2>
          <Link
            href="/products"
            className="px-6 py-2 bg-[#E8C39E] text-[#4A3419] rounded-lg font-bold hover:bg-[#D6B28E] transition-colors duration-300 text-lg flex items-center gap-2 mt-2 md:mt-0"
            style={{ width: 'fit-content' }}
          >
            See Products <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-3 text-center text-[#4A3419] text-xl py-12">Loading featured products...</div>
          ) : featuredProducts.length === 0 ? (
            <div className="col-span-3 text-center text-[#4A3419] text-xl py-12">No featured products found.</div>
          ) : featuredProducts.map((product, index) => (
            <motion.div 
              key={product.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer relative group"
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleProductClick(product)}
            >
              {/* Product image */}
              {product.images && product.images.length > 0 ? (
                <div className="bg-[#E8C39E] h-64 rounded-md mb-4 overflow-hidden relative cursor-pointer">
                  <img src={product.images[0]} alt={product.name} className="object-contain w-full h-full" />
                  <div className="absolute top-0 right-0 bg-[#4A3419] text-white px-2 py-1 m-2 rounded-full text-sm">
                    {product.rating || '5'} ★
                  </div>
                </div>
              ) : (
                <div className="bg-[#E8C39E] h-64 rounded-md mb-4 overflow-hidden relative cursor-pointer">
                  <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                  <div className="absolute top-0 right-0 bg-[#4A3419] text-white px-2 py-1 m-2 rounded-full text-sm">
                    {product.rating || '5'} ★
                  </div>
                </div>
              )}
              <h2 className="text-xl font-bold text-[#4A3419] group-hover:text-[#6B4B26] transition-colors">{product.name}</h2>
              <p className="text-[#4A3419] mb-2 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-lg font-bold text-[#4A3419]">${product.price}</span>
              </div>
              {typeof product.metadata?.stock !== 'undefined' && (
                Number(product.metadata.stock) === 0 ? (
                  <span className="block text-red-600 font-bold mt-2">Sold Out</span>
                ) : (
                  <span className="block text-green-700 font-semibold mt-2">In Stock: {product.metadata.stock}</span>
                )
              )}
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent"></div>
              <div className="hidden group-hover:flex absolute right-0 bottom-0 p-2">
                <motion.button
                  className="p-2 bg-[#4A3419] text-white rounded-full hover:bg-[#6B4B26] flex items-center gap-1"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart({ ...product, priceId: product.priceId }, 1);
                  }}
                  disabled={Number(product.metadata?.stock) === 0}
                >
                  <FaShoppingCart size={14} />
                  <span className="text-xs">Add</span>
                </motion.button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {(product.metadata?.tags ? product.metadata.tags.split(',') : []).map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 bg-[#E8C39E] text-[#4A3419] rounded-full">{tag}</span>
                ))}
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
          href="/recycle-clothes"
          className="inline-block bg-[#E8C39E] text-[#4A3419] px-6 py-3 rounded-lg font-bold hover:bg-[#d6b28e] transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Let's Get Started
        </motion.a>
      </motion.section>

      {/* Product Details Modal */}
      <AnimatePresence>
        {modalOpen && activeProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-white rounded-lg w-full h-full max-w-none max-h-none overflow-hidden flex flex-col lg:flex-row"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", bounce: 0.3 }}
          >
            {/* Image Section - Full screen size */}
            <div className="lg:w-2/3 relative h-full">
              {activeProduct.images && activeProduct.images.length > 0 ? (
                <div className="bg-[#E8C39E] h-full relative flex items-center justify-center">
                  <img 
                    src={activeProduct.images[0]} 
                    alt={activeProduct.name} 
                    className="object-contain w-full h-full" 
                  />
                </div>
              ) : (
                <div className="bg-[#E8C39E] h-full relative flex items-center justify-center">
                  <img 
                    src={activeProduct.image} 
                    alt={activeProduct.name} 
                    className="object-contain w-full h-full" 
                  />
                </div>
              )}
              <button 
                className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:bg-[#E8C39E] transition-colors duration-300 z-20"
                onClick={() => setModalOpen(false)}
                type="button"
                aria-label="Close modal"
              >
                <FaTimes className="text-[#4A3419]" size={20} />
              </button>
            </div>

            {/* Product Details Section */}
            <div className="lg:w-1/3 p-6 lg:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl lg:text-3xl font-bold text-[#4A3419] leading-tight">{activeProduct.name}</h2>
                  <div className="flex items-center">
                    <span className="text-[#4A3419] font-bold mr-1">{activeProduct.rating || '5'}</span>
                    <FaStar className="text-yellow-500" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <p className="text-3xl lg:text-4xl font-bold text-[#4A3419]">${activeProduct.price}</p>
                </div>
                
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">{activeProduct.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="border border-gray-200 p-4 rounded-lg text-center">
                    <span className="block text-sm text-gray-500 mb-1">Material</span>
                    <span className="font-medium text-[#4A3419]">{activeProduct.metadata?.material || 'Acrylic'}</span>
                  </div>
                  <div className="border border-gray-200 p-4 rounded-lg text-center">
                    <span className="block text-sm text-gray-500 mb-1">Size</span>
                    <span className="font-medium text-[#4A3419]">{activeProduct.metadata?.size || 'Standard'}</span>
                  </div>
                </div>

                {/* Stock Status */}
                {typeof activeProduct.metadata?.stock !== 'undefined' && (
                  Number(activeProduct.metadata.stock) === 0 ? (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <span className="text-red-600 font-bold text-lg">Sold Out</span>
                    </div>
                  ) : (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <span className="text-green-700 font-semibold text-lg">In Stock: {activeProduct.metadata.stock}</span>
                    </div>
                  )
                )}

                {/* Quantity Selector */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[#4A3419] font-semibold">Quantity:</span>
                  <div className="flex items-center border border-[#E8C39E] rounded-lg">
                    <button
                      onClick={decrementQuantity}
                      className="px-4 py-2 text-[#4A3419] hover:bg-[#E8C39E] transition-colors duration-200"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-6 py-2 text-[#4A3419] font-semibold">{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      className="px-4 py-2 text-[#4A3419] hover:bg-[#E8C39E] transition-colors duration-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <motion.button
                className="w-full bg-[#4A3419] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-[#6B4B26] transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={Number(activeProduct.metadata?.stock) === 0}
              >
                <FaShoppingCart size={20} />
                Add to Cart
              </motion.button>

              {/* Product Tags */}
              <div className="flex flex-wrap gap-2 mt-6">
                {(activeProduct.metadata?.tags ? activeProduct.metadata.tags.split(',') : []).map(tag => (
                  <span key={tag} className="text-sm px-3 py-1 bg-[#E8C39E] text-[#4A3419] rounded-full">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </div>
  )
}

export default function HomePage() {
  return <HomeContent />;
} 