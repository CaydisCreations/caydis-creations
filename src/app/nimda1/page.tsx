'use client'

import { useEffect } from 'react'
import { useFirebaseAuth } from '../context/FirebaseAuthContext'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const { user, loading } = useFirebaseAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // No user - redirect to login
        router.push('/login')
        return
      }

      // Check if user is authorized
      if (user.email === 'caydiscreations@gmail.com') {
        // Redirect to verify page for 2FA
        router.push('/nimda1/verify')
        return
      } else {
        // Unauthorized - redirect to 404
        router.push('/404')
        return
      }
    }
  }, [user, loading, router])

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5E6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A3419] mx-auto mb-4"></div>
          <p className="text-[#4A3419]">Loading...</p>
        </div>
      </div>
    )
  }

  return null // Will redirect
}
