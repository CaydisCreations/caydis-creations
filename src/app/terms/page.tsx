'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function TermsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('returns-exchanges');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Intersection Observer to track which section is currently visible
  useEffect(() => {
    const observerOptions = {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5DC] to-[#E8E8D0]">
      <div className="flex pt-8">
        {/* Collapsible Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 h-[calc(100vh-4rem)] sticky top-16 z-40 overflow-y-auto`}>
          <div className="p-4">
            <button
              onClick={toggleSidebar}
              className="w-full flex items-center justify-center p-2 rounded-lg bg-[#8B4513] text-white hover:bg-[#4A3419] transition-colors duration-200 mb-6"
            >
              {sidebarOpen ? <FaChevronLeft size={16} /> : <FaChevronRight size={16} />}
            </button>
            
            {sidebarOpen && (
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#4A3419] mb-4">Contents</h3>
                
                <button
                  onClick={() => scrollToSection('returns-exchanges')}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 font-medium ${
                    activeSection === 'returns-exchanges'
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                      : 'hover:bg-[#F8F8F0] text-[#4A3419]'
                  }`}
                >
                  1. Returns & Exchanges
                </button>
                
                <button
                  onClick={() => scrollToSection('privacy-policy')}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 font-medium ${
                    activeSection === 'privacy-policy'
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                      : 'hover:bg-[#F8F8F0] text-[#4A3419]'
                  }`}
                >
                  2. Privacy Policy
                </button>
                
                <button
                  onClick={() => scrollToSection('custom-orders')}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 font-medium ${
                    activeSection === 'custom-orders'
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                      : 'hover:bg-[#F8F8F0] text-[#4A3419]'
                  }`}
                >
                  3. Custom Orders
                </button>
                
                <button
                  onClick={() => scrollToSection('recycling')}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 font-medium ${
                    activeSection === 'recycling'
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                      : 'hover:bg-[#F8F8F0] text-[#4A3419]'
                  }`}
                >
                  4. Recycling Services
                </button>
                
                <button
                  onClick={() => scrollToSection('media-marketing')}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 font-medium ${
                    activeSection === 'media-marketing'
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                      : 'hover:bg-[#F8F8F0] text-[#4A3419]'
                  }`}
                >
                  5. Media & Marketing
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg shadow-lg p-8 min-h-[calc(100vh-6rem)] overflow-y-auto"
            >
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-[#4A3419] mb-4">Terms of Service</h1>
                <div className="w-24 h-1 bg-[#8B4513] mx-auto"></div>
              </div>

              {/* Returns & Exchanges Section */}
              <section id="returns-exchanges" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#4A3419] mb-6 border-b-2 border-[#8B4513] pb-2">
                  1. Returns & Exchanges
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-[#F8F8F0] p-6 rounded-lg">
                    <h3 className="text-xl font-medium text-[#4A3419] mb-3">Pre-made Items</h3>
                    <p className="text-[#4A3419] leading-relaxed">
                      You may return or exchange pre-made items within 14 days of receiving them, as long as the item is unused and in its original condition (including tags and packaging). Customers are responsible for return shipping fees. Refunds or exchanges will be processed after inspection.
                    </p>
                  </div>

                  <div className="bg-[#F8F8F0] p-6 rounded-lg">
                    <h3 className="text-xl font-medium text-[#4A3419] mb-3">Custom Orders</h3>
                    <p className="text-[#4A3419] leading-relaxed">
                      We do not accept returns or exchanges on custom orders, as these are made specifically for you. If your custom item is defective or does not meet the agreed-upon specifications, please contact us within 7 days, and we will fix or replace it.
                    </p>
                  </div>

                  <div className="bg-[#F8F8F0] p-6 rounded-lg">
                    <h3 className="text-xl font-medium text-[#4A3419] mb-3">Recycling Clothes to Yarn</h3>
                    <p className="text-[#4A3419] leading-relaxed">
                      Due to the personalized nature of this service, we cannot accept returns or exchanges for items that have been upcycled into yarn. Please ensure the clothing you send is in good condition. If we find issues with the fabric, we'll notify you before proceeding with the transformation.
                    </p>
                  </div>

                  <div className="bg-[#F8F8F0] p-6 rounded-lg">
                    <h3 className="text-xl font-medium text-[#4A3419] mb-3">Custom Items Made from Recycled Yarn</h3>
                    <p className="text-[#4A3419] leading-relaxed">
                      Once your recycled yarn is used to make a custom item, we cannot accept returns or exchanges unless the item is defective or was made incorrectly based on your specifications. If there is a mistake in the final product, we will work with you to fix or replace it. Please notify us within 7 days of receiving the item.
                    </p>
                  </div>
                </div>
              </section>

              {/* Privacy Policy Section */}
              <section id="privacy-policy" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#4A3419] mb-6 border-b-2 border-[#8B4513] pb-2">
                  2. Privacy Policy
                </h2>
                
                <div className="bg-[#F8F8F0] p-6 rounded-lg">
                  <p className="text-[#4A3419] leading-relaxed">
                    We value your privacy and are committed to protecting your information. The only information we collect from our customers is what's necessary to enhance your shopping experience. When you create an account, we collect your name, email address, shipping address, payment details, and order history. This information is used solely to process your orders efficiently and to better understand product demand so we can continue to improve our offerings. All payment data is encrypted and handled in compliance with industry-standard security protocols. We never share or sell your personal information.
                  </p>
                </div>
              </section>

              {/* Custom Orders Section */}
              <section id="custom-orders" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#4A3419] mb-6 border-b-2 border-[#8B4513] pb-2">
                  3. Custom Orders: Order and Payment Terms
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-[#F8F8F0] p-6 rounded-lg">
                    <h3 className="text-xl font-medium text-[#4A3419] mb-3">Quote Acceptance & Project Initiation</h3>
                    <p className="text-[#4A3419] leading-relaxed">
                      Upon acceptance of the quote and payment of the initial invoice, production of the product will begin. Please note that the final price may vary from the initial estimated quote provided.
                    </p>
                  </div>

                  <div className="bg-[#F8F8F0] p-6 rounded-lg">
                    <h3 className="text-xl font-medium text-[#4A3419] mb-3">Quote Rejection or Non-Payment</h3>
                    <p className="text-[#4A3419] leading-relaxed">
                      If the quote is not accepted or the initial invoice is not paid, the order process will be terminated, and no further action will be taken. The Initial invoice must be paid within five (5) business days of issuance.
                    </p>
                  </div>

                  <div className="bg-[#F8F8F0] p-6 rounded-lg">
                    <h3 className="text-xl font-medium text-[#4A3419] mb-3">Final Invoice Payment & Ownership Terms</h3>
                    <p className="text-[#4A3419] leading-relaxed">
                      The final invoice must be paid within five (5) business days of issuance. If payment is not received within this period and the customer has not contacted Caydi's Creations, ownership of the completed product will transfer to the company. In such cases, the customer will forfeit any right to receive the product.
                    </p>
                  </div>

                  <div className="bg-[#F8F8F0] p-6 rounded-lg">
                    <h3 className="text-xl font-medium text-[#4A3419] mb-3">Payment Extension Policy</h3>
                    <p className="text-[#4A3419] leading-relaxed">
                      A one-time extension of five (5) additional business days may be granted if the customer contacts Caydi's Creations within the original payment period. This extension may be applied to either the initial invoice or the final invoice—but not both. If payment is still not received after the extended period, the customer forfeits all rights to the product.
                    </p>
                  </div>

                  <div className="bg-[#F8F8F0] p-6 rounded-lg">
                    <h3 className="text-xl font-medium text-[#4A3419] mb-3">Company Rights to Product</h3>
                    <p className="text-[#4A3419] leading-relaxed">
                      In the event of forfeiture, Caydi's Creations retains full ownership and reserves the right to use, sell, or dispose of the product at its sole discretion.
                    </p>
                  </div>
                </div>
              </section>

              {/* Recycling Section */}
              <section id="recycling" className="mb-12">
                <h2 className="text-2xl font-semibold text-[#4A3419] mb-6 border-b-2 border-[#8B4513] pb-2">
                  4. Recycling: Order and Payment Terms
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-[#F8F8F0] p-6 rounded-lg">
                    <h3 className="text-xl font-medium text-[#4A3419] mb-3">General Process and Terms (Applies to all)</h3>
                    <ul className="text-[#4A3419] leading-relaxed space-y-2">
                      <li>• A prepaid shipping label will be provided by the company. Customers are responsible for shipping their clothing to the address listed on the label.</li>
                      <li>• Once received, all clothing will be reviewed to assess usability.</li>
                      <li>• A final invoice will be sent after review. Customers have five (5) business days to complete payment.</li>
                      <li>• If payment is not received within 5 business days and no communication is made, all clothing becomes the property of the company and will not be returned or processed.</li>
                      <li>• If the customer requests an extension, an additional 5 business days will be granted. This extension can only be used once per order. If the invoice remains unpaid after the extension, all clothing is forfeited.</li>
                      <li>• Upon invoice payment, the processing or creation phase begins.</li>
                      <li>• If any changes are requested after invoice payment, a re-evaluation will occur to determine whether a refund is due or an additional invoice is needed.</li>
                    </ul>
                  </div>

                  <div className="bg-[#F8F8F0] p-6 rounded-lg">
                    <h3 className="text-xl font-medium text-[#4A3419] mb-3">For Yarn Creation Only (No Product Request)</h3>
                    <h4 className="font-medium text-[#4A3419] mb-2">Clothing Review and Yarn Processing</h4>
                    <ul className="text-[#4A3419] leading-relaxed space-y-2 mb-4">
                      <li>• Clothing that is approved will be converted into yarn.</li>
                      <li>• If clothing is sent that was previously stated as unacceptable, it will not be processed and will be returned with the final package.</li>
                      <li>• Customers may opt to pay $10 per unusable item to receive the yarn that would have been made from that item.</li>
                      <li>• If the company determines a clothing item is unusable but not previously listed as unacceptable, yarn will still be provided at no additional cost, and the clothing will be returned.</li>
                    </ul>
                    <h4 className="font-medium text-[#4A3419] mb-2">Final Invoice & Payment</h4>
                    <ul className="text-[#4A3419] leading-relaxed space-y-2">
                      <li>• Once the review is complete, the final invoice will be sent.</li>
                      <li>• Failure to pay within the specified period results in forfeiture of all submitted materials.</li>
                      <li>• Review General Process and Terms for more information on invoice payments</li>
                    </ul>
                  </div>

                  <div className="bg-[#F8F8F0] p-6 rounded-lg">
                    <h3 className="text-xl font-medium text-[#4A3419] mb-3">For Yarn and Product Request</h3>
                    <h4 className="font-medium text-[#4A3419] mb-2">Clothing Review and Yarn Processing</h4>
                    <p className="text-[#4A3419] leading-relaxed mb-4">
                      Once the clothing is received, it will be reviewed for compatibility with the requested item.
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium text-[#4A3419] mb-2">Scenario 1: If there are unusable clothing that was not previously listed:</h5>
                        <ul className="text-[#4A3419] leading-relaxed space-y-1 ml-4">
                          <li>• Yarn will be provided from that clothing at no fee.</li>
                          <li>• If more yarn is needed to complete the item:</li>
                          <li className="ml-4">- The customer may opt to proceed with the item by paying $10 per additional clothing piece provided by the company.</li>
                          <li className="ml-4">- The customer may opt to change to a different item that uses less yarn.</li>
                          <li className="ml-4">- The customer may opt to receive only the yarn (no item made).</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium text-[#4A3419] mb-2">Scenario 2: If there are unusable clothing was listed as not accepted:</h5>
                        <p className="text-[#4A3419] leading-relaxed mb-2">The customer will be contacted to choose:</p>
                        <ul className="text-[#4A3419] leading-relaxed space-y-1 ml-4">
                          <li>• Receive yarn only, no item made.</li>
                          <li>• Receive yarn only + request yarn substitution for the unusable items ($10 per clothing item).</li>
                          <li>• Proceed with the item, without substitute yarn provided by the company</li>
                          <li>• Choose a different item without substitute yarn provided by the company</li>
                          <li>• Choose a different item + request yarn from unusable clothing ($10 per item).</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium text-[#4A3419] mb-2">Scenario 3: If more yarn is needed during production:</h5>
                        <p className="text-[#4A3419] leading-relaxed mb-2">The customer will be notified and may:</p>
                        <ul className="text-[#4A3419] leading-relaxed space-y-1 ml-4">
                          <li>• Proceed and pay $10 per clothing item for additional yarn provided.</li>
                          <li>• Cancel item request and receive only the yarn.</li>
                          <li>• Switch to a smaller item requiring less yarn.</li>
                        </ul>
                      </div>
                    </div>

                    <h4 className="font-medium text-[#4A3419] mb-2 mt-4">Final Product & Extras</h4>
                    <ul className="text-[#4A3419] leading-relaxed space-y-2 mb-4">
                      <li>• All extra yarn will be returned with the final product.</li>
                      <li>• Any unusable clothing will also be returned with the final package.</li>
                    </ul>

                    <h4 className="font-medium text-[#4A3419] mb-2">Final Invoice & Payment</h4>
                    <ul className="text-[#4A3419] leading-relaxed space-y-2">
                      <li>• The final invoice will be sent after the reviewing of the product.</li>
                      <li>• As with all orders, failure to pay within the designated time frame results in complete forfeiture of the submitted clothing.</li>
                      <li>• Review General Process and Terms for more information on invoice payments</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Media and Marketing Section */}
              <section id="media-marketing" className="mb-8">
                <h2 className="text-2xl font-semibold text-[#4A3419] mb-6 border-b-2 border-[#8B4513] pb-2">
                  5. Media and Marketing
                </h2>
                
                <div className="bg-[#F8F8F0] p-6 rounded-lg">
                  <p className="text-[#4A3419] leading-relaxed">
                    All products and custom-made items (including anything sold by the company) are subject to full consent for use in marketing and social media, including both in-process and finished pieces.
                  </p>
                </div>
              </section>

              {/* Contact Information */}
              <div className="text-center mt-12 pt-8 border-t-2 border-[#8B4513]">
                <p className="text-[#4A3419] text-lg">
                  Questions about our terms? Contact us at{' '}
                  <a href="mailto:caydiscreations@gmail.com" className="text-[#8B4513] hover:text-[#4A3419] font-medium">
                    caydiscreations@gmail.com
                  </a>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 