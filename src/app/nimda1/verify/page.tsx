'use client'

import { useState, useEffect } from 'react'
import { useFirebaseAuth } from '../../context/FirebaseAuthContext'
import { useRouter } from 'next/navigation'
import { FaShieldAlt, FaSpinner } from 'react-icons/fa'
import Image from 'next/image'

export default function AdminVerify() {
  const { user, loading: authLoading } = useFirebaseAuth()
  const router = useRouter()
  const [twoFACode, setTwoFACode] = useState('')
  const [twoFALoading, setTwoFALoading] = useState(false)
  const [error, setError] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)

  useEffect(() => {
    // If no user or not authorized, redirect to 404
    if (!authLoading && (!user || user.email !== 'caydiscreations@gmail.com')) {
      router.push('/404')
      return
    }

    // If user is authorized, automatically send 2FA code
    if (user && user.email === 'caydiscreations@gmail.com' && !codeSent && !sendingCode) {
      send2FACode()
    }
  }, [user, authLoading, codeSent, sendingCode, router])

  const send2FACode = async () => {
    setSendingCode(true)
    setError('')
    
    try {
      const response = await fetch('/api/nimda1/send-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'caydiscreations@gmail.com' }),
      })

      if (response.ok) {
        setCodeSent(true)
        setError('')
      } else {
        const error = await response.json()
        setError(error.error || 'Failed to send 2FA code')
      }
    } catch (err: any) {
      setError('Failed to send 2FA code')
      console.error('Send 2FA error:', err)
    } finally {
      setSendingCode(false)
    }
  }

  const handle2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    setTwoFALoading(true)
    setError('')

    try {
      const response = await fetch('/api/nimda1/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: 'caydiscreations@gmail.com', 
          code: twoFACode 
        }),
      })

      if (response.ok) {
        router.push('/nimda1/dashboard')
      } else {
        const error = await response.json()
        setError(error.error || 'Invalid 2FA code')
      }
    } catch (err: any) {
      setError('Failed to verify 2FA code')
      console.error('2FA verification error:', err)
    } finally {
      setTwoFALoading(false)
    }
  }

  // Show loading while checking authentication
  if (authLoading || sendingCode) {
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
              <a 
                href="/"
                className="block w-full bg-[#4A3419] text-white py-3 px-6 rounded-lg hover:bg-[#6B4B26] transition-colors duration-300 text-center font-semibold"
              >
                Go Home
              </a>
              <a 
                href="/products"
                className="block w-full border border-[#4A3419] text-[#4A3419] py-3 px-6 rounded-lg hover:bg-[#4A3419] hover:text-white transition-colors duration-300 text-center font-semibold"
              >
                Browse Products
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Need help? <a href="/contact" className="text-[#4A3419] underline hover:no-underline">Contact us</a>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // If not authorized, show 404
  if (!user || user.email !== 'caydiscreations@gmail.com') {
    return null // Will redirect to 404
  }

  return (
    <div className="min-h-screen bg-[#FFF5E6] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-[#4A3419] rounded-full flex items-center justify-center mb-4">
              <FaShieldAlt className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-[#4A3419]">Two-Factor Authentication</h1>
            <p className="text-gray-600 mt-2">
              {codeSent 
                ? "Enter the 6-digit code sent to your email"
                : "Sending verification code to your email..."
              }
            </p>
          </div>

          {codeSent && (
            <form onSubmit={handle2FA} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#4A3419] mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A3419] text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={twoFALoading || twoFACode.length !== 6}
                className="w-full bg-[#4A3419] text-white py-2 px-4 rounded-lg hover:bg-[#6B4B26] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {twoFALoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  'Verify Code'
                )}
              </button>
            </form>
          )}

          {codeSent && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 mb-2">
                Check your email for the verification code
              </p>
              <button
                type="button"
                onClick={send2FACode}
                disabled={sendingCode}
                className="text-[#4A3419] underline hover:no-underline disabled:opacity-50"
              >
                {sendingCode ? 'Sending...' : 'Resend Code'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 