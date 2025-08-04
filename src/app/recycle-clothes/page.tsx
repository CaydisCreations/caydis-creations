'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaRecycle, FaTshirt, FaYarn, FaHeart, FaArrowRight } from 'react-icons/fa'
import Link from 'next/link'

const duffleBagImages = [
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/5956c54e-731a-4c33-8490-130c94bb2ed2.jpeg',
  '/duffleBag/IMG_6990.jpg',
  '/duffleBag/IMG_6989.jpg',
  '/duffleBag/IMG_6988.jpg',
  '/duffleBag/IMG_6987.jpg',
  '/duffleBag/IMG_6986.jpg',
  '/duffleBag/IMG_6985.jpg',
];

const coasterImages = [
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Coasters/IMG_6332.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Coasters/IMG_6333.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Coasters/IMG_6334.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Coasters/IMG_6335.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Coasters/IMG_6336.jpeg',
];

const basketImages = [
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/SmallBasket/IMG_6337.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/SmallBasket/IMG_6338.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/SmallBasket/IMG_6339.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/SmallBasket/IMG_6341.jpeg',
];

export default function RecycleClothesPage() {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [coasterCarouselIndex, setCoasterCarouselIndex] = useState(0);
  const [basketCarouselIndex, setBasketCarouselIndex] = useState(0);
  const prevImage = () => setCarouselIndex(i => (i === 0 ? duffleBagImages.length - 1 : i - 1));
  const nextImage = () => setCarouselIndex(i => (i === duffleBagImages.length - 1 ? 0 : i + 1));
  const prevCoasterImage = () => setCoasterCarouselIndex(i => (i === 0 ? coasterImages.length - 1 : i - 1));
  const nextCoasterImage = () => setCoasterCarouselIndex(i => (i === coasterImages.length - 1 ? 0 : i + 1));
  const prevBasketImage = () => setBasketCarouselIndex(i => (i === 0 ? basketImages.length - 1 : i - 1));
  const nextBasketImage = () => setBasketCarouselIndex(i => (i === basketImages.length - 1 ? 0 : i + 1));
  const [activeTab, setActiveTab] = useState('Recycled Product Info');
  const tabs = [
    'Recycled Product Info',
    'Example',
    'Order and Payment Terms',
  ];

  return (
    <div className="min-h-screen bg-[#FFF5E6] py-12">
      <div className="max-w-4xl mx-auto px-4 pt-8">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div 
            className="bg-[#4A3419] p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <FaRecycle className="text-[#FFF5E6] text-3xl" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#4A3419] mb-4">
            Recycle Clothes To Crochet Items
          </h1>
          <p className="text-xl text-[#4A3419] max-w-2xl mx-auto">
            Transform your beloved clothes into beautiful, sustainable crochet pieces. 
            Give new life to your old garments while creating something truly special.
          </p>
        </motion.section>

        {/* Google Form Button at Top */}
        <div className="flex justify-center mb-8">
          <a
            href="https://forms.gle/vjnsN5vUJhSFtsbX6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#E8C39E] text-[#4A3419] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#d6b28e] transition-colors duration-300"
          >
            Start Your Recycle Project <FaArrowRight className="inline ml-2" />
          </a>
        </div>

        {/* How It Works Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-[#4A3419] text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md text-center"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-[#E8C39E] p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FaTshirt className="text-[#4A3419] text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-[#4A3419] mb-3">1. Send Your Clothes</h3>
              <p className="text-[#4A3419]">
                Send in your shirts, sweaters, and other clothing items that hold special meaning to you.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md text-center"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-[#E8C39E] p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FaYarn className="text-[#4A3419] text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-[#4A3419] mb-3">2. We Transform to Yarn</h3>
              <p className="text-[#4A3419]">
                We carefully process your clothes into high-quality yarn, preserving the memories and stories they hold.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md text-center"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="bg-[#E8C39E] p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FaHeart className="text-[#4A3419] text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-[#4A3419] mb-3">3. Create Your Item</h3>
              <p className="text-[#4A3419]">
                We craft your chosen crochet item with love, turning your memories into a beautiful, functional piece.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Tabbed Section for Types, Accept, Process */}
        <div className="flex justify-center mb-8 gap-4">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`px-6 py-2 rounded-full font-bold transition-colors duration-300 ${activeTab === tab ? 'bg-[#4A3419] text-[#FFF5E6]' : 'bg-[#E8C39E] text-[#4A3419]'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {activeTab === 'Recycled Product Info' && (
            <motion.section
              key="info"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-[#4A3419] text-center mb-8">
                Recycled Product Info
              </h2>
              {/* Types of Items We Can Make */}
              <div className="bg-white p-8 rounded-lg shadow-md text-[#4A3419] text-lg space-y-2 mb-8">
                <h3 className="text-2xl font-bold mb-4">Types of Items We Can Make</h3>
                <ul className="list-disc ml-6">
                  <li>Bags (see example in next tab)</li>
                  <li>Small baskets</li>
                  <li>Coasters</li>

                </ul>
              </div>
              {/* What We Accept */}
              <div className="bg-white p-8 rounded-lg shadow-md mb-8">
                <h3 className="text-2xl font-bold mb-4 text-[#4A3419]">What We Accept</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xl font-bold text-[#4A3419] mb-4">✅ Perfect for Recycling:</h4>
                    <ul className="space-y-2 text-[#4A3419]">
                      <li>• Wool shirts</li>
                      <li>• Cotton t-shirts and shirts</li>
                      <li>• Polyester, acrylic, velvet</li>
                      <li>• Cotton dresses and skirts</li>
                      <li>• Natural fiber clothing</li>
                      <li>• Thin blankets</li>
                      <li>• Jeans/denim</li>
                      <li>• Sweaters</li>
                      <li>• Hoodies</li>
                      <li>• Sweatpants (with no seams)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#4A3419] mb-4">❌ Not Suitable:</h4>
                    <ul className="space-y-2 text-[#4A3419]">
                      <li>• Items with lots of seams or heavy embellishments</li>
                      <li>• Very thick or stiff fabrics</li>
                      <li>• Items with large prints/logos</li>
                    </ul>
                  </div>
                </div>
                {/* Tips for Best Results */}
                <div className="mt-8">
                  <p className="font-bold text-lg text-[#4A3419] mb-2">Tips for Best Results:</p>
                  <ul className="list-disc ml-6 text-[#4A3419]">
                    <li>Try not to send shirts with seams on the sides (Go to example tab above).</li>
                    <li>Try to send plain shirts with no or little design (Go to example tab above).</li>
                  </ul>
                </div>
              </div>
              {/* The Process */}
              <div className="bg-white p-8 rounded-lg shadow-md text-[#4A3419] text-lg">
                <h3 className="text-2xl font-bold mb-4 text-center">The Process</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#4A3419] text-[#FFF5E6] rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">1</div>
                    <div>
                      <h4 className="text-lg font-bold text-[#4A3419] mb-2">Complete the Order Form</h4>
                      <p className="text-[#4A3419]">Please fill out the provided form, indicating the number of clothing items you would like to send and specifying if you would like any of the clothing repurposed into a new item.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#4A3419] text-[#FFF5E6] rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">2</div>
                    <div>
                      <h4 className="text-lg font-bold text-[#4A3419] mb-2">Order Confirmation and Quote</h4>
                      <p className="text-[#4A3419]">Upon submission, we will send an email with the details of your order, including an estimated quote. You will be required to confirm your acceptance of the quote and state where you are shipping the clothes from and where you want the finished product shipped to. You will do this by replying to the email.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#4A3419] text-[#FFF5E6] rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">3</div>
                    <div>
                      <h4 className="text-lg font-bold text-[#4A3419] mb-2">Shipping Details</h4>
                      <p className="text-[#4A3419]">After your acceptance, we will send you an email containing the shipping address and a prepaid shipping label for your convenience.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#4A3419] text-[#FFF5E6] rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">4</div>
                    <div>
                      <h4 className="text-lg font-bold text-[#4A3419] mb-2">Shipment of Clothing</h4>
                      <p className="text-[#4A3419]">Please send the clothing items to the provided address. Once received, our team will review the items, and an invoice for your order will be sent to you.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#4A3419] text-[#FFF5E6] rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">5</div>
                    <div>
                      <h4 className="text-lg font-bold text-[#4A3419] mb-2">Invoice Payment</h4>
                      <p className="text-[#4A3419]">Upon payment of the invoice, the production of yarn from your clothing will commence.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#4A3419] text-[#FFF5E6] rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">6</div>
                    <div>
                      <h4 className="text-lg font-bold text-[#4A3419] mb-2">Repurposing (if requested)</h4>
                      <p className="text-[#4A3419]">If you have requested that the yarn be transformed into another item, we will proceed with that process after the yarn is ready.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#4A3419] text-[#FFF5E6] rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 mt-1">7</div>
                    <div>
                      <h4 className="text-lg font-bold text-[#4A3419] mb-2">Return of Final Product</h4>
                      <p className="text-[#4A3419]">Once the requested items are completed, we will ship them back to you.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 p-6 bg-[#FFF5E6] border border-[#E8C39E] rounded-lg text-[#4A3419]">
                  <h4 className="text-xl font-bold mb-2">Pricing & Example</h4>
                  <div className="space-y-2">
                    <p className="font-bold">Cost:</p>
                    <ul className="list-disc ml-6 mb-4">
                      <li>Shirts: $5</li>
                      <li>Hoodies, sweats, jeans: $7</li>
                    </ul>
                    <p className="mb-4">If you have any questions about specific pieces of clothes, please reach out to us!</p>
                    <p className="mb-4">If you want an item made and we need to provide more balls of yarn made from clothes: $10 per extra ball</p>
                    <p className="font-bold">Example (Duffle Bag): 13 shirts/balls of yarn used → 13 x $5 = $65. Made into a duffle bag: +$20. Total: $85</p>
                    <p className="text-sm mt-2">Shipping is not included in example.</p>
                    <p className="text-sm mt-2">Please go to example tab to see more.</p>
                  </div>
                  <div className="mt-4">
                    <b>Additional Item Costs:</b>
                    <ul className="list-disc ml-6">
                      <li>Coaster: +$10</li>
                      <li>Duffle Bag: +$20</li>
                      <li>Small Basket: +$10</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
          {activeTab === 'Example' && (
            <motion.section
              key="example"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-[#4A3419] text-center mb-8">
                Products Examples
              </h2>
              {/* Duffle Bag Example Section with Carousel */}
              <div className="bg-white p-8 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-8">
                <div className="relative w-full max-w-xs flex-shrink-0">
                  <img src={duffleBagImages[carouselIndex]} alt={`Duffle Bag Example ${carouselIndex + 1}`} className="w-full rounded-lg shadow-md object-contain" />
                  {duffleBagImages.length > 1 && (
                    <>
                      <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 text-[#4A3419] hover:bg-opacity-100">&#8592;</button>
                      <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 text-[#4A3419] hover:bg-opacity-100">&#8594;</button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {duffleBagImages.map((_, i) => (
                          <span key={i} className={`inline-block w-2 h-2 rounded-full ${i === carouselIndex ? 'bg-[#4A3419]' : 'bg-[#E8C39E]'}`}></span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="text-[#4A3419] text-lg">
                  <p className="mb-2"><b>This duffle bag was made out of t-shirts (mainly cotton, some polyester).</b></p>
                  <p className="mb-2">It was made out of about 13 shirts/balls of yarn. <b>13 balls is enough for a duffle bag that is perfect for an overnight bag.</b></p>
                  <p className="mb-2">Plain shirts and shirts without side seams work best for this type of project.</p>
                  <div className="mt-6 p-6 bg-[#FFF5E6] border border-[#E8C39E] rounded-lg text-[#4A3419] max-w-2xl">
                    <span className="font-bold">Example (Duffle Bag):</span> 13 shirts/balls of yarn used → 13 x $5 = $65. Made into a duffle bag: +$20. <span className="font-bold">Total: $85</span>
                    <p className="text-sm mt-2">Please note that shipping is not included in the example.</p>
                  </div>
                </div>
              </div>
              
              {/* Coasters Example Section */}
              <div className="bg-white p-8 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-8 mt-8">
                <div className="relative w-full max-w-xs flex-shrink-0">
                  <img src={coasterImages[coasterCarouselIndex]} alt={`Coasters Example ${coasterCarouselIndex + 1}`} className="w-full rounded-lg shadow-md object-contain" />
                  {coasterImages.length > 1 && (
                    <>
                      <button onClick={prevCoasterImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 text-[#4A3419] hover:bg-opacity-100">&#8592;</button>
                      <button onClick={nextCoasterImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 text-[#4A3419] hover:bg-opacity-100">&#8594;</button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {coasterImages.map((_, i) => (
                          <span key={i} className={`inline-block w-2 h-2 rounded-full ${i === coasterCarouselIndex ? 'bg-[#4A3419]' : 'bg-[#E8C39E]'}`}></span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="text-[#4A3419] text-lg">
                  <p className="mb-2"><b>The blue coaster is made from a cotton shirt and the white coasters from a polyester shirt.</b></p>
                  <p className="mb-2">It takes 1 shirt/ ball of yarn with extra yarn remaining.</p>
                  <p className="mb-2">Plain shirts and shirts without side seams work best for this type of project.</p>
                  <div className="mt-6 p-6 bg-[#FFF5E6] border border-[#E8C39E] rounded-lg text-[#4A3419] max-w-2xl">
                    <span className="font-bold">Pricing example:</span> 1 shirt/ball → 1x$5=$5. Made into a coaster: +$10. <span className="font-bold">Total: $15</span>
                    <p className="text-sm mt-2">Please note that shipping is not included in the example.</p>
                  </div>
                </div>
              </div>

              {/* Small Basket Example Section */}
              <div className="bg-white p-8 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-8 mt-8">
                <div className="relative w-full max-w-xs flex-shrink-0">
                  <img src={basketImages[basketCarouselIndex]} alt={`Small Basket Example ${basketCarouselIndex + 1}`} className="w-full rounded-lg shadow-md object-contain" />
                  {basketImages.length > 1 && (
                    <>
                      <button onClick={prevBasketImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 text-[#4A3419] hover:bg-opacity-100">&#8592;</button>
                      <button onClick={nextBasketImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 text-[#4A3419] hover:bg-opacity-100">&#8594;</button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {basketImages.map((_, i) => (
                          <span key={i} className={`inline-block w-2 h-2 rounded-full ${i === basketCarouselIndex ? 'bg-[#4A3419]' : 'bg-[#E8C39E]'}`}></span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="text-[#4A3419] text-lg">
                  <p className="mb-2"><b>The small basket is made out of cotton shirts.</b></p>
                  <p className="mb-2">It takes 4 shirts to make.</p>
                  <p className="mb-2">Plain shirts and shirts without side seams work best for this type of project.</p>
                  <div className="mt-6 p-6 bg-[#FFF5E6] border border-[#E8C39E] rounded-lg text-[#4A3419] max-w-2xl">
                    <span className="font-bold">Pricing example:</span> 4 shirts/balls→ 4x$5= $20. Made into basket: +10. <span className="font-bold">Total: $30</span>
                    <p className="text-sm mt-2">Please note that shipping is not included in the example.</p>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
          {activeTab === 'Order and Payment Terms' && (
            <motion.section
              key="terms"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-[#4A3419] text-center mb-8">
                Order and Payment Terms
              </h2>
              <div className="bg-white p-8 rounded-lg shadow-md text-[#4A3419] text-lg space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">General Process and Terms (Applies to all)</h3>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>A prepaid shipping label will be provided by the company. Customers are responsible for shipping their clothing to the address listed on the label.</li>
                    <li>Once received, all clothing will be reviewed to assess usability.</li>
                    <li>A final invoice will be sent after review. Customers have five (5) business days to complete payment.</li>
                    <li>If payment is not received within 5 business days and no communication is made, all clothing becomes the property of the company and will not be returned or processed.</li>
                    <li>If the customer requests an extension, an additional 5 business days will be granted. This extension can only be used once per order. If the invoice remains unpaid after the extension, all clothing is forfeited.</li>
                    <li>Upon invoice payment, the processing or creation phase begins.</li>
                    <li>If any changes are requested after invoice payment, a re-evaluation will occur to determine whether a refund is due or an additional invoice is needed.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">For Yarn Creation Only (No Product Request)</h3>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Clothing that is approved will be converted into yarn.</li>
                    <li>If clothing is sent that was previously stated as unacceptable, it will not be processed and will be returned with the final package.</li>
                    <li>Customers may opt to pay $10 per unusable item to receive the yarn that would have been made from that item.</li>
                    <li>If the company determines a clothing item is unusable but not previously listed as unacceptable, yarn will still be provided at no additional cost, and the clothing will be returned.</li>
                  </ul>
                  <h4 className="text-xl font-bold mt-4 mb-2">Final Invoice & Payment</h4>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Once the review is complete, the final invoice will be sent.</li>
                    <li>Failure to pay within the specified period results in forfeiture of all submitted materials.</li>
                    <li>Review General Process and Terms for more information on invoice payments.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">For Yarn and Product Request</h3>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Once the clothing is received, it will be reviewed for compatibility with the requested item.</li>
                  </ul>
                  <h4 className="text-xl font-bold mt-4 mb-2">Scenario 1: Unusable clothing not previously listed</h4>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Yarn will be provided from that clothing at no fee.</li>
                    <li>If more yarn is needed to complete the item:
                      <ul className="list-disc ml-6">
                        <li>The customer may opt to proceed with the item by paying $10 per additional clothing piece provided by the company.</li>
                        <li>The customer may opt to change to a different item that uses less yarn.</li>
                        <li>The customer may opt to receive only the yarn (no item made).</li>
                      </ul>
                    </li>
                  </ul>
                  <h4 className="text-xl font-bold mt-4 mb-2">Scenario 2: Unusable clothing was listed as not accepted</h4>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>The customer will be contacted to choose:
                      <ul className="list-disc ml-6">
                        <li>Receive yarn only, no item made.</li>
                        <li>Receive yarn only + request yarn substitution for the unusable items ($10 per clothing item).</li>
                        <li>Proceed with the item, without substitute yarn provided by the company.</li>
                        <li>Choose a different item without substitute yarn provided by the company.</li>
                        <li>Choose a different item + request yarn from unusable clothing ($10 per item).</li>
                      </ul>
                    </li>
                  </ul>
                  <h4 className="text-xl font-bold mt-4 mb-2">Scenario 3: More yarn needed during production</h4>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>The customer will be notified and may:
                      <ul className="list-disc ml-6">
                        <li>Proceed and pay $10 per clothing item for additional yarn provided.</li>
                        <li>Cancel item request and receive only the yarn.</li>
                        <li>Switch to a smaller item requiring less yarn.</li>
                      </ul>
                    </li>
                  </ul>
                  <h4 className="text-xl font-bold mt-4 mb-2">Final Product & Extras</h4>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>All extra yarn will be returned with the final product.</li>
                    <li>Any unusable clothing will also be returned with the final package.</li>
                  </ul>
                  <h4 className="text-xl font-bold mt-4 mb-2">Final Invoice & Payment</h4>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>The final invoice will be sent after the reviewing of the product.</li>
                    <li>As with all orders, failure to pay within the designated time frame results in complete forfeiture of the submitted clothing.</li>
                    <li>Review General Process and Terms for more information on invoice payments.</li>
                  </ul>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-[#4A3419] text-[#FFF5E6] p-8 rounded-lg shadow-lg text-center"
        >
          <h2 className="text-2xl font-bold mb-4">
            Ready to Transform Your Clothes?
          </h2>
          <p className="mb-6 text-lg">
            Let's create something beautiful together from your cherished garments.
          </p>
          <motion.a 
            href="https://forms.gle/vjnsN5vUJhSFtsbX6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#E8C39E] text-[#4A3419] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#d6b28e] transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Recycle Project
            <FaArrowRight className="inline ml-2" />
          </motion.a>
        </motion.section>

        {/* Back to Home */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Link 
            href="/"
            className="text-[#4A3419] hover:text-[#E8C39E] font-medium transition-colors duration-300"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
} 