'use client'

import { useEffect, useState } from 'react'
import { useFirebaseAuth } from '../context/FirebaseAuthContext'
import { useRouter } from 'next/navigation'
import { FaSpinner } from 'react-icons/fa'
import Image from 'next/image'

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

      setIsAuthorized(true)
      setCheckingAuth(false)
    }
  }, [user, loading, router])

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

          {/* Loading Content */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-6xl font-bold text-[#4A3419] mb-4">🔐</h1>
            <h2 className="text-2xl font-semibold text-[#4A3419] mb-4">
              Verifying Access
            </h2>
            <p className="text-gray-700 mb-6">
              Please wait while we verify your credentials...
            </p>

            {/* Loading Spinner */}
            <div className="flex justify-center mb-6">
              <FaSpinner className="animate-spin text-4xl text-[#4A3419]" />
            </div>

            {/* Status */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Checking authentication...
              </p>
            </div>
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