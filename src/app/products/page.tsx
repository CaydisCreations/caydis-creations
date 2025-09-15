'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSearch, FaShoppingCart, FaStar, FaTimes, FaChevronDown } from 'react-icons/fa'
import { useCart } from '../context/CartContext'

function ProductImageCarousel({ images, alt, height = "h-64", onImageClick }: { images: string[], alt: string, height?: string, onImageClick?: () => void }) {
  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIndex(i => (i === 0 ? images.length - 1 : i - 1));
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIndex(i => (i === images.length - 1 ? 0 : i + 1));
  };

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setIndex(i => (i === images.length - 1 ? 0 : i + 1));
    }
    if (isRightSwipe) {
      setIndex(i => (i === 0 ? images.length - 1 : i - 1));
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Keyboard handlers
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setIndex(i => (i === 0 ? images.length - 1 : i - 1));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setIndex(i => (i === images.length - 1 ? 0 : i + 1));
    }
  };

  // Reset index when images change
  useEffect(() => {
    setIndex(0);
  }, [images]);

  // Handle image area click
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onImageClick) {
      onImageClick();
    }
  };

  return (
    <div 
      className={`relative ${height} rounded-md mb-4 overflow-hidden bg-[#E8C39E] flex items-center justify-center cursor-pointer`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onKeyDown={onKeyDown}
      onClick={handleImageClick}
      tabIndex={0}
      role="region"
      aria-label={`Image ${index + 1} of ${images.length}`}
      style={{ touchAction: 'pan-y pinch-zoom' }}
    >
      <img 
        src={images[index]} 
        alt={`${alt} - Image ${index + 1} of ${images.length}`} 
        className="object-contain w-full h-full transition-transform duration-300 hover:scale-105" 
      />
      {images.length > 1 && (
        <>
          <button 
            onClick={prev} 
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 text-[#4A3419] hover:shadow-lg transition-all duration-200 z-10"
            aria-label="Previous image"
            type="button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={next} 
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 text-[#4A3419] hover:shadow-lg transition-all duration-200 z-10"
            aria-label="Next image"
            type="button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, i) => (
              <button
                key={i} 
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex(i);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  i === index 
                    ? 'bg-[#4A3419] scale-125' 
                    : 'bg-white bg-opacity-60 hover:bg-opacity-80'
                }`}
                aria-label={`Go to image ${i + 1}`}
                type="button"
              />
            ))}
          </div>
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm z-10">
            {index + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}

function ProductsContent() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagsDropdownOpen, setTagsDropdownOpen] = useState(false);
  const [fetchAttempts, setFetchAttempts] = useState(0);
  const [noProductsTimeout, setNoProductsTimeout] = useState(false);
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);

  // Fetch products from Stripe API
  useEffect(() => {
    let isMounted = true;
    let timeoutId;
    setIsLoading(true);
    setNoProductsTimeout(false);

    fetch('/api/stripe-products', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        setAllProducts(data.products || []);
        setIsLoading(false);
      });

    timeoutId = setTimeout(() => {
      setNoProductsTimeout(true);
    }, 10000);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  // Define the allowed categories
  const allowedCategories = ["All", "Wearables", "Bags", "Accessories", "Baby Clothes"];
  // Collect all unique categories from product metadata (not tags)
  const allCategories = [
    ...new Set([
      "All",
      ...allProducts.map(p => p.metadata?.category).filter(Boolean)
    ])
  ].filter(cat => allowedCategories.includes(cat));
  // Collect all unique tags from product metadata.tags
  const allTags = Array.from(new Set(
    allProducts.flatMap(p => p.metadata?.tags ? p.metadata.tags.split(',').map(t => t.trim()) : [])
  ));

  // Filtering logic
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let results = allProducts;
      if (selectedCategory !== 'All') {
          results = results.filter(product => product.metadata?.category === selectedCategory);
      }
      if (selectedTags.length > 0) {
        results = results.filter(product =>
          (product.metadata?.tags ? product.metadata.tags.split(',').map(t => t.trim()) : []).some(tag => selectedTags.includes(tag))
        );
      }
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const startsWith = results.filter(p => p.name.toLowerCase().startsWith(term));
        const includes = results.filter(p =>
          !p.name.toLowerCase().startsWith(term) &&
          (p.name.toLowerCase().includes(term) || (p.description || '').toLowerCase().includes(term))
        );
        results = [...startsWith, ...includes];
      }
      
      // Reorder products to move specific product to 14th position
      results = reorderProducts(results);
      
      setFilteredProducts(results);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchTerm, selectedTags, allProducts]);

  // Function to reorder products
  const reorderProducts = (products) => {
    // Find the target product (Handbag - Multicolor (Dark Bag) with green leaf pattern)
    const targetProduct = products.find(p => 
      p.name === "Handbag - Multicolor (Dark Bag)" && 
      p.description?.includes("green leaf pattern")
    );
    
    // Find the scarf product to move to second position
    const scarfProduct = products.find(p => p.name === "Scarf - White");
    
    let reorderedProducts = [...products];
    
    // Move scarf to second position if found
    if (scarfProduct) {
      reorderedProducts = reorderedProducts.filter(p => p.id !== scarfProduct.id);
      reorderedProducts.splice(1, 0, scarfProduct); // Insert at position 1 (second item)
    }
    
    // Move dark bag to 14th position if found
    if (targetProduct) {
      reorderedProducts = reorderedProducts.filter(p => p.id !== targetProduct.id);
      const insertPosition = Math.min(13, reorderedProducts.length);
      reorderedProducts.splice(insertPosition, 0, targetProduct);
    }
    
    return reorderedProducts;
  };

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
    addToCart({ ...product, priceId: product.priceId }, 1);
  };

  const handleAddToCartFromModal = () => {
    addToCart({ ...selectedProduct, priceId: selectedProduct.priceId }, quantity);
    setModalOpen(false);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  // Tag selection handler
  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="space-y-8 pt-8">
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
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
          <div className="relative md:w-[340px] w-full">
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
          <div className="flex flex-row items-center min-w-0 justify-end w-full md:w-auto">
            <div className="flex flex-wrap gap-2">
              {allCategories.map((category) => (
              <motion.button
                key={category}
                  className={`px-4 py-2 rounded-full border-2 transition-colors duration-200 font-semibold text-[#4A3419] ${selectedCategory === category ? 'bg-[#4A3419] text-white border-[#4A3419]' : 'bg-[#FFF5E6] border-[#E8C39E]'}`}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
              >
                {category}
              </motion.button>
            ))}
            </div>
            <div className="ml-2 md:ml-4 flex-shrink-0">
            <div className="relative">
              <button
                className="px-4 py-2 rounded-full bg-[#FFF5E6] text-[#4A3419] border border-[#4A3419] font-semibold flex items-center gap-2 hover:bg-[#E8C39E] transition-colors duration-300"
                  onClick={() => setTagDropdownOpen(open => !open)}
                type="button"
              >
                  Filter
                  <FaChevronDown className={`transition-transform duration-200 ${tagDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
                {tagDropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white border border-[#E8C39E] rounded-lg shadow-lg p-4 z-20 flex flex-wrap gap-2 min-w-[200px]">
                    {allTags.map(tag => (
                    <button
                      key={tag}
                        className={`px-4 py-1 rounded-full border font-semibold text-sm transition-colors duration-200 ${selectedTags.includes(tag) ? 'bg-[#4A3419] text-white border-[#4A3419]' : 'bg-[#FFF5E6] text-[#4A3419] border-[#4A3419]'}`}
                      onClick={() => toggleTag(tag)}
                      type="button"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Products grid */}
      <div className="relative min-h-[400px]">
        {isLoading || (!noProductsTimeout && filteredProducts.length === 0) ? (
          <div className="text-center text-[#4A3419] text-xl py-12">Loading products...</div>
        ) : filteredProducts.length === 0 && noProductsTimeout ? (
          <div className="text-center text-[#4A3419] text-xl py-12">No products found. Try to refresh the page or try a different search or category.</div>
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
                  {/* Product image */}
                  {product.images && product.images.length > 0 ? (
                    <ProductImageCarousel images={product.images} alt={product.name} onImageClick={() => handleProductClick(product)} />
                  ) : (
                    <div className="bg-[#E8C39E] h-64 rounded-md mb-4 overflow-hidden relative cursor-pointer" onClick={() => handleProductClick(product)}>
                      <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                      <div className="absolute top-0 right-0 bg-[#4A3419] text-white px-2 py-1 m-2 rounded-full text-sm">
                        {product.rating} ★
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
                      onClick={(e) => handleAddToCart(e, product)}
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
            onClick={closeModal}
          >
            <motion.div 
              className="bg-white rounded-lg w-full h-full max-w-none max-h-none overflow-hidden flex flex-col lg:flex-row"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ type: "spring", bounce: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Section - Full screen size */}
              <div className="lg:w-2/3 relative h-full">
                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                  <ProductImageCarousel 
                    images={selectedProduct.images} 
                    alt={selectedProduct.name} 
                    height="h-full" 
                    onImageClick={() => handleProductClick(selectedProduct)} 
                  />
                ) : (
                  <div className="bg-[#E8C39E] h-full relative flex items-center justify-center">
                    <img 
                      src={selectedProduct.image} 
                      alt={selectedProduct.name} 
                      className="object-contain w-full h-full" 
                    />
                  </div>
                )}
                <button 
                  className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:bg-[#E8C39E] transition-colors duration-300 z-20"
                  onClick={closeModal}
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
                    <h2 className="text-2xl lg:text-3xl font-bold text-[#4A3419] leading-tight">{selectedProduct.name}</h2>
                    <div className="flex items-center">
                      <span className="text-[#4A3419] font-bold mr-1">{selectedProduct.rating}</span>
                      <FaStar className="text-yellow-500" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-3xl lg:text-4xl font-bold text-[#4A3419]">${selectedProduct.price}</p>
                  </div>
                  
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">{selectedProduct.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="border border-gray-200 p-4 rounded-lg text-center">
                      <span className="block text-sm text-gray-500 mb-1">Material</span>
                      <span className="font-medium text-[#4A3419]">{selectedProduct.metadata?.material || 'Acrylic'}</span>
                    </div>
                    <div className="border border-gray-200 p-4 rounded-lg text-center">
                      <span className="block text-sm text-gray-500 mb-1">Size</span>
                      <span className="font-medium text-[#4A3419]">{selectedProduct.metadata?.size || 'Standard'}</span>
                    </div>
                  </div>

                  {/* Stock Status */}
                  {typeof selectedProduct.metadata?.stock !== 'undefined' && (
                    Number(selectedProduct.metadata.stock) === 0 ? (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <span className="text-red-600 font-bold text-lg">Sold Out</span>
                      </div>
                    ) : (
                      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <span className="text-green-700 font-semibold text-lg">In Stock: {selectedProduct.metadata.stock}</span>
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
                  onClick={handleAddToCartFromModal}
                  disabled={Number(selectedProduct.metadata?.stock) === 0}
                >
                  <FaShoppingCart size={20} />
                  Add to Cart
                </motion.button>

                {/* Product Tags */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {(selectedProduct.metadata?.tags ? selectedProduct.metadata.tags.split(',') : []).map(tag => (
                    <span key={tag} className="text-sm px-3 py-1 bg-[#E8C39E] text-[#4A3419] rounded-full">
                      {tag.trim()}
                    </span>
                  ))}
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