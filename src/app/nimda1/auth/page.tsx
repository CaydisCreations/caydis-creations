'use client'

import { useState, useEffect } from 'react'
import { useFirebaseAuth } from '../../context/FirebaseAuthContext'
import { useRouter } from 'next/navigation'
import { FaLock, FaEye, FaEyeSlash, FaShieldAlt, FaSpinner } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'

export default function AdminAuth() {
  const { user, loading: authLoading, login } = useFirebaseAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1) // 1: login, 2: 2FA
  const [twoFACode, setTwoFACode] = useState('')
  const [twoFALoading, setTwoFALoading] = useState(false)

  useEffect(() => {
    // If user is already authenticated and authorized, redirect to dashboard
    if (user && user.email === 'caydiscreations@gmail.com' && !authLoading) {
      router.push('/nimda1/dashboard')
    }
  }, [user, authLoading, router])

  // Show loading while checking authentication
  if (authLoading) {
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(email, password)
      
      // Send 2FA code to email
      const response = await fetch('/api/nimda1/send-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setStep(2) // Move to 2FA step
      } else {
        const error = await response.json()
        setError(error.error || 'Failed to send 2FA code')
      }
    } catch (err: any) {
      setError('Invalid email or password')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
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
        body: JSON.stringify({ email, code: twoFACode }),
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

  if (step === 1) {
    return (
      <div className="min-h-screen bg-[#FFF5E6] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-[#4A3419] rounded-full flex items-center justify-center mb-4">
                <FaLock className="text-white text-2xl" />
              </div>
              <h1 className="text-2xl font-bold text-[#4A3419]">Admin Access</h1>
              <p className="text-gray-600 mt-2">Sign in to access the admin dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#4A3419] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A3419]"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4A3419] mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A3419] pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4A3419] text-white py-2 px-4 rounded-lg hover:bg-[#6B4B26] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                This area is restricted to authorized personnel only.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 2FA Step
  return (
    <div className="min-h-screen bg-[#FFF5E6] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-[#4A3419] rounded-full flex items-center justify-center mb-4">
              <FaShieldAlt className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-[#4A3419]">Two-Factor Authentication</h1>
            <p className="text-gray-600 mt-2">Enter the 6-digit code sent to your email</p>
          </div>

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

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-[#4A3419] py-2 px-4 rounded-lg border border-[#4A3419] hover:bg-[#4A3419] hover:text-white transition-colors duration-300"
            >
              Back to Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Check your email for the verification code
            </p>
            <button
              type="button"
              onClick={async () => {
                try {
                  const response = await fetch('/api/nimda1/send-2fa', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                  })
                  if (response.ok) {
                    setError('')
                    alert('New code sent to your email!')
                  } else {
                    const error = await response.json()
                    setError(error.error || 'Failed to send new code')
                  }
                } catch (err) {
                  setError('Failed to send new code')
                }
              }}
              className="text-[#4A3419] underline hover:no-underline mt-2"
            >
              Resend Code
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 