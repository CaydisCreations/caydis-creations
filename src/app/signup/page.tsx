'use client'
import React, { useState, useEffect } from 'react';
import { useFirebaseAuth } from '../context/FirebaseAuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import PasswordInput from '../components/PasswordInput';

export default function SignupPage() {
  const { signup, loginWithGoogle, user, loading } = useFirebaseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (user && !loading) {
    return null;
  }

  // Password requirements
  const requirements = [
    { label: 'Minimum 8 characters', valid: password.length >= 8 },
    { label: 'At least one uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'At least one lowercase letter', valid: /[a-z]/.test(password) },
    { label: 'At least one number', valid: /[0-9]/.test(password) },
    { label: 'At least one special character', valid: /[^A-Za-z0-9]/.test(password) },
    { label: 'Passwords match', valid: password === confirmPassword && password.length > 0 },
  ];
  const allValid = requirements.every(r => r.valid);

  const getFriendlyError = (code: string) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Please log in or use a different email.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Your password is too weak. Please choose a stronger password.';
      case 'auth/operation-not-allowed':
        return 'Sign up is currently disabled. Please contact support.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.';
      default:
        return 'Signup failed. Please try again or contact support.';
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    if (!allValid) {
      setError('Please meet all password requirements.');
      setSubmitting(false);
      return;
    }
    try {
      await signup(email, password);
      router.push('/');
    } catch (err: any) {
      // Map Firebase error codes to friendly messages
      const code = err.code || err.message || '';
      setError(getFriendlyError(code));
    }
    setSubmitting(false);
  };

  const handleGoogle = async () => {
    setSubmitting(true);
    setError('');
    try {
      await loginWithGoogle();
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Google signup failed');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#FFF5E6] px-2">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <Image src="/logoCaydisCreation.PNG" alt="Caydi's Creations Logo" width={60} height={60} sizes="60px" className="mb-4 rounded-full bg-[#FFF5E6]" />
        <h1 className="text-2xl md:text-3xl font-bold text-[#4A3419] mb-2 text-center">Create a new account</h1>
        <div className="mb-6 text-center text-[#4A3419]">
          Or <a href="/login" className="text-[#4A3419] underline hover:text-[#6B4B26] font-semibold">sign in to your account</a>
        </div>
        <form onSubmit={handleSignup} className="w-full space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-[#E8C39E] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#4A3419] bg-[#FFF5E6] text-[#4A3419]"
            required
          />
          <PasswordInput
            label="Password"
            value={password}
            onChange={setPassword}
            onFocus={() => setShowValidation(true)}
            showValidation={showValidation}
            requirements={requirements}
          />
          <PasswordInput
            label="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            onFocus={() => setShowValidation(true)}
            showValidation={showValidation}
            requirements={requirements}
          />
          {showValidation && (
            <div className="bg-[#FFF5E6] border border-[#E8C39E] rounded-lg p-4 mb-2 text-[#4A3419] shadow-sm animate-fade-slide-up">
              <h3 className="font-semibold mb-2">Password requirements:</h3>
              <ul className="space-y-1">
                {requirements.map((r, i) => (
                  <li key={i} className="flex items-center">
                    {r.valid ? (
                      <span className="inline-block w-4 h-4 mr-2 rounded-full bg-green-500 text-white flex items-center justify-center">✓</span>
                    ) : (
                      <span className="inline-block w-4 h-4 mr-2 rounded-full bg-red-400 text-white flex items-center justify-center">✗</span>
                    )}
                    <span className={r.valid ? '' : 'opacity-70'}>{r.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-[#4A3419] text-[#FFF5E6] py-3 rounded-lg font-bold hover:bg-[#6B4B26] transition-colors disabled:opacity-60"
            disabled={submitting || !allValid}
          >
            {submitting ? 'Signing up...' : 'Sign up'}
          </button>
        </form>
        {/* Remove the Google signup button */}
        {/* <button
          onClick={handleGoogle}
          className="w-full mt-4 bg-red-500 text-white py-2 rounded-lg font-bold hover:bg-red-600"
          disabled={submitting}
        >
          {submitting ? 'Please wait...' : 'Sign up with Google'}
        </button> */}
        <div className="mt-4 w-full text-center">
          <a href="#" className="text-[#4A3419] underline hover:text-[#6B4B26]">Forgot your password?</a>
        </div>
        {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
      </div>
    </div>
  );
} 