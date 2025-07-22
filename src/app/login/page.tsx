'use client'
import React, { useState } from 'react';
import { useFirebaseAuth } from '../context/FirebaseAuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const { login, loginWithGoogle, user, loading } = useFirebaseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMsg, setResetMsg] = useState('');
  const router = useRouter();

  if (user && !loading) {
    router.push('/');
    return null;
  }

  const getFriendlyError = (code: string) => {
    switch (code) {
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again or reset your password.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later or reset your password.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Please log in or use a different email.';
      default:
        return 'Login failed. Please try again or contact support.';
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
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
      setError(err.message || 'Google login failed');
    }
    setSubmitting(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMsg('');
    setError('');
    try {
      console.log('🔧 Sending password reset email...');
      const { getAuth, sendPasswordResetEmail } = await import('firebase/auth');
      const auth = getAuth();
      
      console.log('📧 Sending reset email to:', resetEmail);
      
      // Configure action code settings for custom domain
      const actionCodeSettings = {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false,
        // Note: The custom domain is configured in Firebase Console
        // The sender email should be set to: noreply@confirmation.caydiscreations.com
      };
      
      await sendPasswordResetEmail(auth, resetEmail, actionCodeSettings);
      console.log('✅ Password reset email sent successfully');
      console.log('📧 Email should be sent from: noreply@confirmation.caydiscreations.com');
      setResetMsg('Password reset email sent! Please check your inbox (and spam folder).');
      setError('');
    } catch (err: any) {
      console.error('❌ Password reset error:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      
      const code = err.code || err.message || '';
      const friendlyError = getFriendlyError(code);
      setError(friendlyError);
      setResetMsg('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#FFF5E6] px-2">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <Image src="/logoCaydisCreation.PNG" alt="Caydi's Creations Logo" width={60} height={60} sizes="60px" className="mb-4 rounded-full bg-[#FFF5E6]" />
        {showReset ? (
          <>
            <h1 className="text-2xl md:text-3xl font-bold text-[#4A3419] mb-2 text-center">Password Recovery</h1>
            <form onSubmit={handleResetPassword} className="w-full space-y-4 mb-4 animate-fade-slide-up">
              <input
                type="email"
                placeholder="Enter your email address"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                className="w-full border border-[#E8C39E] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#4A3419] bg-[#FFF5E6] text-[#4A3419]"
                required
              />
              <button
                type="submit"
                className="w-full bg-[#4A3419] text-[#FFF5E6] py-3 rounded-lg font-bold hover:bg-[#6B4B26] transition-colors"
              >
                Send password reset email
              </button>
              <button type="button" onClick={() => setShowReset(false)} className="w-full mt-2 text-[#4A3419] underline hover:text-[#6B4B26]">Back to login</button>
              {resetMsg && <div className="text-green-600 mt-2 text-center">{resetMsg}</div>}
              {error && <div className="text-red-600 mt-2 text-center">{error}</div>}
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl md:text-3xl font-bold text-[#4A3419] mb-2 text-center">Sign in to your account</h1>
            <div className="mb-6 text-center text-[#4A3419]">
              Or <a href="/signup" className="text-[#4A3419] underline hover:text-[#6B4B26] font-semibold">create a new account</a>
            </div>
            <form onSubmit={handleLogin} className="w-full space-y-4">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-[#E8C39E] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#4A3419] bg-[#FFF5E6] text-[#4A3419]"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-[#E8C39E] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#4A3419] bg-[#FFF5E6] text-[#4A3419]"
                required
              />
              <button
                type="submit"
                className="w-full bg-[#4A3419] text-[#FFF5E6] py-3 rounded-lg font-bold hover:bg-[#6B4B26] transition-colors"
                disabled={submitting}
              >
                {submitting ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </>
        )}
        <div className="mt-4 w-full text-center">
          <button type="button" onClick={() => setShowReset(true)} className="text-[#4A3419] underline hover:text-[#6B4B26]">Forgot your password?</button>
        </div>
        {error && !showReset && <div className="text-red-600 mt-4 text-center">{error}</div>}
      </div>
    </div>
  );
} 