'use client'

import { useEffect, useState } from 'react'
import { useFirebaseAuth } from '../context/FirebaseAuthContext'
import { useRouter } from 'next/navigation'
import { FaSpinner } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useFirebaseAuth()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    if (!loading) {
      // Check if user is authenticated
      if (!user) {
        router.push('/nimda1/auth')
        return
      }

      // Check if user is authorized (specific email)
      const authorizedEmails = [
        'caydiscreations@gmail.com',
        // Add other authorized emails here
      ]

      if (!authorizedEmails.includes(user.email || '')) {
        console.log('Unauthorized access attempt:', user.email)
        // Show 404 for unauthorized users
        router.push('/404')
        return
      }

      // User is authenticated and authorized
      setIsAuthorized(true)
      setCheckingAuth(false)
    }
  }, [user, loading, router])

  // If user is authenticated and authorized, show content immediately
  if (user && user.email === 'caydiscreations@gmail.com' && !loading) {
    return (
      <div className="min-h-screen bg-[#FFF5E6]">
        {children}
      </div>
    )
  }

  if (loading || checkingAuth) {
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

  if (!isAuthorized) {
    return null // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-[#FFF5E6]">
      {children}
    </div>
  )
} 