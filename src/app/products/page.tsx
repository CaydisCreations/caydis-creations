'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSearch, FaShoppingCart, FaStar, FaTimes } from 'react-icons/fa'
import { useCart } from '../context/CartContext'

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
    description: 'Soft and stylish scarf to keep you warm. Makes an excellent gift for friends and family.',
    category: 'Accessories',
    rating: 4.7
  },
  {
    id: 4,
    name: 'Throw Pillows',
    price: 29.99,
    description: 'Decorative throw pillows with intricate patterns. These add a cozy touch to any home!',
    category: 'Home Decor',
    rating: 4.5
  },
  {
    id: 5,
    name: 'Baby Blanket',
    price: 45.99,
    description: 'Soft and gentle blanket for your little one. Made with love, care, and quality materials.',
    category: 'Baby',
    rating: 4.9
  },
  {
    id: 6,
    name: 'Beanie Hat',
    price: 24.99,
    description: 'Stylish and warm beanie hat for winter. One-size-fits-most design for ultimate comfort.',
    category: 'Accessories',
    rating: 4.6
  }
];

function ProductsContent() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  // Filter products based on selected category and search term
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let results = products;
      if (selectedCategory !== 'All') {
        results = results.filter(product => product.category === selectedCategory);
      }
      if (searchTerm) {
        results = results.filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      setFilteredProducts(results);
      setIsLoading(false);
    }, 300); // Add slight delay to simulate filtering

    return () => clearTimeout(timer);
  }, [selectedCategory, searchTerm]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
    setQuantity(1); // Reset quantity when opening modal
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Prevents triggering handleProductClick when clicking the button
    addToCart(product, 1);
  };

  const handleAddToCartFromModal = () => {
    addToCart(selectedProduct, quantity);
    setModalOpen(false);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const categories = ['All', 'Home Decor', 'Baby', 'Accessories'];

  return (
    <div className="space-y-8">
      <motion.header 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-[#4A3419]">Our Products</h1>
        <p className="mt-2 text-[#4A3419]">Browse our handcrafted collection</p>
      </motion.header>

      <motion.div 
        className="bg-white p-6 rounded-lg shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-[#E8C39E] rounded-full focus:outline-none focus:ring-2 focus:ring-[#4A3419]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4A3419]" />
            {searchTerm && (
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4A3419] hover:text-red-500"
                onClick={() => setSearchTerm('')}
              >
                <FaTimes />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <motion.button
                key={category}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === category 
                    ? 'bg-[#4A3419] text-[#FFF5E6]' 
                    : 'bg-[#FFF5E6] text-[#4A3419] border border-[#4A3419]'
                } hover:bg-[#6B4B26] hover:text-[#FFF5E6] transition-colors duration-300`}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Products grid */}
      <div className="relative min-h-[400px]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#FFF5E6] bg-opacity-60 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A3419]"></div>
          </div>
        )}
        
        {filteredProducts.length === 0 && !isLoading ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xl text-[#4A3419]">No products found. Try a different search or category.</p>
          </motion.div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredProducts.map((product) => (
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
                  {/* Product image placeholder */}
                  <div className="bg-[#E8C39E] h-48 rounded-md mb-4 overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FaStar className="text-[#4A3419] text-4xl opacity-20" />
                    </div>
                    <div className="absolute top-0 right-0 bg-[#4A3419] text-white px-2 py-1 m-2 rounded-full text-sm">
                      {product.rating} ★
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-[#4A3419] group-hover:text-[#6B4B26] transition-colors">{product.name}</h2>
                  <p className="text-[#4A3419] mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-bold text-[#4A3419]">${product.price}</span>
                    <span className="text-sm px-3 py-1 bg-[#E8C39E] rounded-full text-[#4A3419]">
                      {product.category}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent"></div>
                  <div className="hidden group-hover:flex absolute right-0 bottom-0 p-2">
                    <motion.button
                      className="p-2 bg-[#4A3419] text-white rounded-full hover:bg-[#6B4B26] flex items-center gap-1"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      <FaShoppingCart size={14} />
                      <span className="text-xs">Add</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Product Details Modal */}
      <AnimatePresence>
        {modalOpen && selectedProduct && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-lg max-w-3xl w-full overflow-hidden"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ type: "spring", bounce: 0.3 }}
            >
              <div className="relative">
                <div className="bg-[#E8C39E] h-64 relative">
                  {/* Product image placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FaStar className="text-[#4A3419] text-6xl opacity-20" />
                  </div>
                </div>
                <button 
                  className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-[#E8C39E] transition-colors duration-300"
                  onClick={closeModal}
                >
                  <FaTimes className="text-[#4A3419]" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-2xl font-bold text-[#4A3419]">{selectedProduct.name}</h2>
                  <div className="flex items-center">
                    <span className="text-[#4A3419] font-bold mr-1">{selectedProduct.rating}</span>
                    <FaStar className="text-yellow-500" />
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-2xl font-bold text-[#4A3419]">${selectedProduct.price}</p>
                  <span className="bg-[#E8C39E] text-[#4A3419] px-3 py-1 rounded-full text-sm">
                    {selectedProduct.category}
                  </span>
                </div>
                <p className="text-gray-700 mb-6">{selectedProduct.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="border border-gray-200 p-3 rounded-lg text-center">
                    <span className="block text-sm text-gray-500">Material</span>
                    <span className="font-medium text-[#4A3419]">Recycled Cotton</span>
                  </div>
                  <div className="border border-gray-200 p-3 rounded-lg text-center">
                    <span className="block text-sm text-gray-500">Size</span>
                    <span className="font-medium text-[#4A3419]">Standard</span>
                  </div>
                </div>
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
                    className="w-full bg-[#4A3419] text-white py-3 rounded-lg font-bold hover:bg-[#6B4B26] transition-colors duration-300 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAddToCartFromModal}
                  >
                    <FaShoppingCart /> Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ProductsPage() {
  return <ProductsContent />;
} 