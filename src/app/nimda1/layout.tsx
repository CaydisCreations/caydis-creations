'use client'

import { useEffect, useState } from 'react'
import { useFirebaseAuth } from '../context/FirebaseAuthContext'
import { useRouter } from 'next/navigation'
import { FaSpinner } from 'react-icons/fa'

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
      <div className="min-h-screen bg-[#FFF5E6] flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#4A3419] mx-auto mb-4" />
          <p className="text-[#4A3419] text-lg">Verifying access...</p>
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