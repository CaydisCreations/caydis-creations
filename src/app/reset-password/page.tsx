'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAuth, confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import Image from 'next/image';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [oobCode, setOobCode] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get the oobCode from URL parameters
    const code = searchParams.get('oobCode');
    if (code) {
      setOobCode(code);
      verifyResetCode(code);
    } else {
      setError('Invalid password reset link. Please request a new one.');
      setVerifying(false);
    }
  }, [searchParams]);

  const verifyResetCode = async (code: string) => {
    try {
      const auth = getAuth();
      await verifyPasswordResetCode(auth, code);
      setVerifying(false);
    } catch (err: any) {
      console.error('Reset code verification error:', err);
      setError('This password reset link has expired or is invalid. Please request a new one.');
      setVerifying(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const auth = getAuth();
      await confirmPasswordReset(auth, oobCode, password);
      setSuccess('Password reset successfully! You can now log in with your new password.');
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      console.error('Password reset error:', err);
      let errorMessage = 'Failed to reset password. Please try again.';
      
      if (err.code === 'auth/expired-action-code') {
        errorMessage = 'This password reset link has expired. Please request a new one.';
      } else if (err.code === 'auth/invalid-action-code') {
        errorMessage = 'Invalid password reset link. Please request a new one.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      }
      
      setError(errorMessage);
    }
    
    setLoading(false);
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#FFF5E6] px-2">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <Image src="/logoCaydisCreation.PNG" alt="Caydi's Creations Logo" width={60} height={60} sizes="60px" className="mb-4 rounded-full bg-[#FFF5E6]" />
          <h1 className="text-2xl font-bold text-[#4A3419] mb-4 text-center">Verifying Reset Link</h1>
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A3419]"></div>
            <span className="ml-3 text-[#4A3419]">Verifying...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#FFF5E6] px-2">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <Image src="/logoCaydisCreation.PNG" alt="Caydi's Creations Logo" width={60} height={60} sizes="60px" className="mb-4 rounded-full bg-[#FFF5E6]" />
        
        {success ? (
          <>
            <h1 className="text-2xl font-bold text-[#4A3419] mb-4 text-center">Password Reset Successful!</h1>
            <div className="text-center text-green-600 mb-4">{success}</div>
            <div className="text-center text-[#4A3419]">
              Redirecting to login page...
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-[#4A3419] mb-4 text-center">Reset Your Password</h1>
            
            {error && (
              <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleResetPassword} className="w-full space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#4A3419] mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="w-full border border-[#E8C39E] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#4A3419] bg-[#FFF5E6] text-[#4A3419]"
                  required
                  minLength={8}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 8 characters long
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#4A3419] mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="w-full border border-[#E8C39E] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#4A3419] bg-[#FFF5E6] text-[#4A3419]"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4A3419] text-[#FFF5E6] py-3 rounded-lg font-bold hover:bg-[#6B4B26] transition-colors disabled:opacity-50"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>
            
            <div className="mt-4 text-center">
              <a href="/login" className="text-[#4A3419] underline hover:text-[#6B4B26]">
                Back to Login
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 