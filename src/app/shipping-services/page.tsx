import ShippingServices from '../components/ShippingServices';
import Image from 'next/image';

export default function ShippingServicesPage() {
  return (
    <div className="min-h-screen bg-[#FFF5E6]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-[#E8C39E]">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <Image 
              src="/logoCaydisCreation.PNG" 
              alt="Caydi's Creations Logo" 
              width={80} 
              height={80} 
              className="mx-auto mb-4 rounded-full bg-[#FFF5E6]"
            />
            <h1 className="text-4xl font-bold text-[#4A3419] mb-4">Shipping & Delivery</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We offer a comprehensive range of shipping options to meet your needs. 
              From fast express delivery to cost-effective ground shipping, we've got you covered.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <ShippingServices showPricing={true} />
      </div>

      {/* Additional Information */}
      <div className="bg-white border-t border-[#E8C39E] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Shipping Information */}
            <div className="text-center">
              <div className="bg-[#FFF5E6] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-xl font-bold text-[#4A3419] mb-2">Package Protection</h3>
              <p className="text-gray-600">
                All packages are carefully wrapped and protected to ensure your items arrive safely.
              </p>
            </div>

            {/* Tracking */}
            <div className="text-center">
              <div className="bg-[#FFF5E6] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="text-xl font-bold text-[#4A3419] mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">
                Track your package every step of the way with detailed tracking information.
              </p>
            </div>

            {/* Customer Support */}
            <div className="text-center">
              <div className="bg-[#FFF5E6] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-bold text-[#4A3419] mb-2">Customer Support</h3>
              <p className="text-gray-600">
                Need help? Our customer service team is here to assist with any shipping questions.
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#4A3419] text-center mb-8">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#FFF5E6] rounded-lg p-6">
                <h3 className="font-bold text-[#4A3419] mb-2">How long does shipping take?</h3>
                <p className="text-gray-600 text-sm">
                  Delivery times vary by service. Express options can deliver in 1-3 days, while economy options may take 3-7 days. International shipping typically takes 3-10 days.
                </p>
              </div>
              
              <div className="bg-[#FFF5E6] rounded-lg p-6">
                <h3 className="font-bold text-[#4A3419] mb-2">Do you ship internationally?</h3>
                <p className="text-gray-600 text-sm">
                  Yes! We offer international shipping to most countries through USPS, UPS, and FedEx international services.
                </p>
              </div>
              
              <div className="bg-[#FFF5E6] rounded-lg p-6">
                <h3 className="font-bold text-[#4A3419] mb-2">Is tracking included?</h3>
                <p className="text-gray-600 text-sm">
                  Yes, all our shipping services include tracking information so you can monitor your package's journey.
                </p>
              </div>
              
              <div className="bg-[#FFF5E6] rounded-lg p-6">
                <h3 className="font-bold text-[#4A3419] mb-2">What if my package is damaged?</h3>
                <p className="text-gray-600 text-sm">
                  We carefully package all items, but if damage occurs, please contact us immediately. We'll work with the carrier to resolve the issue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 