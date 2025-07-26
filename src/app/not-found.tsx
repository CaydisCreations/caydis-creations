import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFF5E6] flex flex-col justify-center items-center px-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="mb-8">
          <Image 
            src="/logoCaydisCreation.PNG" 
            alt="Caydi's Creations Logo" 
            width={80} 
            height={80} 
            className="mx-auto rounded-full bg-white p-2 shadow-lg"
          />
        </div>

        {/* 404 Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-6xl font-bold text-[#4A3419] mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-[#4A3419] mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-700 mb-6">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link 
              href="/"
              className="block w-full bg-[#4A3419] text-white py-3 px-6 rounded-lg hover:bg-[#6B4B26] transition-colors duration-300 text-center font-semibold"
            >
              Go Home
            </Link>
            <Link 
              href="/products"
              className="block w-full border border-[#4A3419] text-[#4A3419] py-3 px-6 rounded-lg hover:bg-[#4A3419] hover:text-white transition-colors duration-300 text-center font-semibold"
            >
              Browse Products
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Need help? <Link href="/contact" className="text-[#4A3419] underline hover:no-underline">Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  )
} 