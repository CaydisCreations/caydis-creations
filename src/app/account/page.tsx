'use client'

import React, { useEffect, useState } from 'react';
import { useFirebaseAuth } from '../context/FirebaseAuthContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { sendEmailVerification, updateEmail, updatePassword, getAuth } from 'firebase/auth';
import PasswordInput from '../components/PasswordInput';

export default function AccountPage() {
  const { user, logout } = useFirebaseAuth();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editFields, setEditFields] = useState({ name: '', email: '', phone: '', address: { line1: '', line2: '', city: '', state: '', postal_code: '', country: '' } });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveMsgType, setSaveMsgType] = useState<'success' | 'error' | ''>('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordMsgType, setPasswordMsgType] = useState<'success' | 'error' | ''>('');
  const [verifyMsg, setVerifyMsg] = useState('');
  const [verifyMsgType, setVerifyMsgType] = useState<'success' | 'error' | ''>('');
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState({ phone: '', address: '' });

  // Auto-hide success messages after 3 seconds
  useEffect(() => {
    if (saveMsgType === 'success') {
      const timer = setTimeout(() => {
        setSaveMsg('');
        setSaveMsgType('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveMsgType]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    const fetchCustomer = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/stripe-customer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email })
        });
        const data = await res.json();
        if (data.customer) {
          setCustomer(data.customer);
          setEditFields({
            name: data.customer.name || data.customer.shipping?.name || '',
            email: data.customer.email || '',
            phone: data.customer.phone || '',
            address: {
              line1: data.customer.shipping?.address?.line1 || '',
              line2: data.customer.shipping?.address?.line2 || '',
              city: data.customer.shipping?.address?.city || '',
              state: data.customer.shipping?.address?.state || '',
              postal_code: data.customer.shipping?.address?.postal_code || '',
              country: data.customer.shipping?.address?.country || '',
            },
          });
        } else {
          // No Stripe customer: show empty fields, allow creation on save
          setCustomer(null);
          setEditFields({
            name: user.displayName || '',
            email: user.email || '',
            phone: '',
            address: { line1: '', line2: '', city: '', state: '', postal_code: '', country: 'US' },
          });
        }
      } catch (err) {
        setError('Failed to fetch account info.');
      }
      setLoading(false);
    };
    fetchCustomer();
  }, [user, router]);

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => { setEditMode(false); setSaveMsg(''); };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      setEditFields(f => ({ ...f, address: { ...f.address, [name.replace('address.', '')]: value } }));
    } else {
      setEditFields(f => ({ ...f, [name]: value }));
    }
  };
  const handleSave = async () => {
    setSaving(true);
    setSaveMsg('');
    let errors = { phone: '', address: '' };
    
    // Debug validation
    console.log('Validating fields:', { 
      phone: editFields.phone, 
      address: editFields.address,
      phoneValid: validatePhone(editFields.phone),
      addressValid: validateAddress(editFields.address)
    });
    
    if (!validatePhone(editFields.phone)) {
      errors.phone = 'Invalid phone number.';
    }
    if (!validateAddress(editFields.address)) {
      errors.address = 'Please fill all required address fields (Address Line 1, City, State, Postal Code).';
    }
    setFieldErrors(errors);
    if (errors.phone || errors.address) {
      setSaving(false);
      // Add shake animation for validation errors
      const form = document.querySelector('[data-section="account-form"]');
      if (form) {
        form.classList.add('animate-shake');
        setTimeout(() => {
          form.classList.remove('animate-shake');
        }, 500);
      }
      return;
    }
    try {
      console.log('Saving account info:', { customer: !!customer, editFields }); // Debug log
      let data;
      if (!customer) {
        // No customer: create new Stripe customer
        console.log('Creating new Stripe customer...'); // Debug log
        const res = await fetch('/api/stripe-customer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            create: true,
            name: editFields.name,
            email: editFields.email,
            phone: editFields.phone,
            address: editFields.address,
          })
        });
        data = await res.json();
        console.log('Create customer response:', data); // Debug log
      } else {
        // Update existing customer
        console.log('Updating existing Stripe customer:', customer.id); // Debug log
        const res = await fetch('/api/stripe-customer-update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: customer.id,
            name: editFields.name,
            email: editFields.email,
            phone: editFields.phone,
            address: editFields.address,
          })
        });
        data = await res.json();
        console.log('Update customer response:', data); // Debug log
      }
      if (data.customer) {
        setCustomer(data.customer);
        setEditMode(false);
        setSaveMsg('Saved successfully!');
        setSaveMsgType('success');
        console.log('Account saved successfully:', data.customer); // Debug log
        
        // Add a subtle success animation by briefly highlighting the sections
        const sections = document.querySelectorAll('[data-section="account-form"]');
        sections.forEach(section => {
          section.classList.add('animate-pulse');
          setTimeout(() => {
            section.classList.remove('animate-pulse');
          }, 1000);
        });
      } else {
        const errorMsg = data.error || 'Failed to save.';
        setSaveMsg(errorMsg);
        setSaveMsgType('error');
        console.error('Save failed:', errorMsg); // Debug log
      }
    } catch (err) {
      console.error('Error saving account:', err); // Debug log
      setSaveMsg('Failed to save. Please try again.');
      setSaveMsgType('error');
    }
    setSaving(false);
  };

  const handleSendVerification = async () => {
    setVerifyMsg('');
    setVerifyMsgType('');
    if (user && user.email && !user.emailVerified) {
      try {
        console.log('🔧 Sending email verification...');
        const auth = getAuth();
        const currentUser = auth.currentUser;
        
        if (currentUser && !currentUser.emailVerified) {
          console.log('📧 Current user found, sending verification email to:', currentUser.email);
          
          // Configure action code settings for custom domain
          const actionCodeSettings = {
            url: `${window.location.origin}/account`,
            handleCodeInApp: false,
            // Note: The custom domain is configured in Firebase Console
            // The sender email should be set to: noreply@confirmation.caydiscreations.com
          };
          
          await sendEmailVerification(currentUser, actionCodeSettings);
          console.log('✅ Email verification sent successfully');
          console.log('📧 Email should be sent from: noreply@confirmation.caydiscreations.com');
          setVerifyMsg('Verification email sent! Please check your inbox (and spam folder).');
          setVerifyMsgType('success');
        } else {
          console.log('ℹ️ User already verified or no current user');
          setVerifyMsg('Your email is already verified.');
          setVerifyMsgType('success');
        }
      } catch (err: any) {
        console.error('❌ Email verification error:', err);
        console.error('Error code:', err.code);
        console.error('Error message:', err.message);
        
        // Provide user-friendly error messages
        let errorMessage = 'Failed to send verification email.';
        if (err.code === 'auth/too-many-requests') {
          errorMessage = 'Too many requests. Please wait a few minutes before trying again.';
        } else if (err.code === 'auth/invalid-email') {
          errorMessage = 'Invalid email address. Please check your email format.';
        } else if (err.code === 'auth/user-not-found') {
          errorMessage = 'User not found. Please try logging in again.';
        }
        
        setVerifyMsg(errorMessage);
        setVerifyMsgType('error');
      }
    } else if (user && user.emailVerified) {
      setVerifyMsg('Your email is already verified.');
      setVerifyMsgType('success');
    } else {
      setVerifyMsg('Please log in to verify your email.');
      setVerifyMsgType('error');
    }
  };
  // Password validation function
  const validatePassword = (password: string) => {
    const requirements = [
      { label: 'Minimum 8 characters', valid: password.length >= 8 },
      { label: 'At least one uppercase letter', valid: /[A-Z]/.test(password) },
      { label: 'At least one lowercase letter', valid: /[a-z]/.test(password) },
      { label: 'At least one number', valid: /[0-9]/.test(password) },
      { label: 'At least one special character', valid: /[^A-Za-z0-9]/.test(password) },
    ];
    return requirements;
  };

  const handleChangePassword = async () => {
    setPasswordMsg('');
    setPasswordMsgType('');
    
    // Validate current password
    if (!currentPassword) {
      setPasswordMsg('Please enter your current password.');
      setPasswordMsgType('error');
      return;
    }

    // Validate new password
    const requirements = validatePassword(newPassword);
    const allValid = requirements.every(r => r.valid);
    
    if (!allValid) {
      setPasswordMsg('Please meet all password requirements.');
      setPasswordMsgType('error');
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setPasswordMsg('New passwords do not match.');
      setPasswordMsgType('error');
      return;
    }

    if (user) {
      try {
        // First, re-authenticate with current password
        const { signInWithEmailAndPassword, getAuth } = await import('firebase/auth');
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, user.email, currentPassword);
        
        // Then update password
        await updatePassword(user, newPassword);
        setPasswordMsg('Password updated successfully!');
        setPasswordMsgType('success');
        setShowChangePassword(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } catch (err: any) {
        console.error('Password change error:', err);
        let errorMessage = 'Failed to update password.';
        
        if (err.code === 'auth/wrong-password') {
          errorMessage = 'Current password is incorrect.';
        } else if (err.code === 'auth/weak-password') {
          errorMessage = 'New password is too weak. Please choose a stronger password.';
        } else if (err.code === 'auth/requires-recent-login') {
          errorMessage = 'Please log in again before changing your password.';
        }
        
        setPasswordMsg(errorMessage);
        setPasswordMsgType('error');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center bg-[#FFF5E6] px-2 py-8">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <div className="text-[#4A3419]">Loading account...</div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FFF5E6] px-2 py-8">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <Image src="/logoCaydisCreation.PNG" alt="Caydi's Creations Logo" width={60} height={60} sizes="60px" className="mb-4 rounded-full bg-[#FFF5E6]" />
        <h1 className="text-3xl font-bold text-[#4A3419] mb-4">Account</h1>
        {loading ? (
          <div className="text-[#4A3419]">Loading account info...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="w-full space-y-6">
            <div className="bg-[#FFF5E6] rounded-lg p-4 border border-[#E8C39E]" data-section="account-form">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-[#4A3419]">Personal Info</h2>
                {!editMode && <button onClick={handleEdit} className="text-[#4A3419] underline hover:text-[#6B4B26] font-semibold">Edit</button>}
              </div>
              {editMode ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-300 ease-in-out">
                  <input name="name" value={editFields.name} onChange={handleChange} placeholder="Name" className="border p-2 rounded transition-all duration-200 focus:ring-2 focus:ring-[#4A3419] focus:border-[#4A3419]" />
                  <input name="email" value={editFields.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded transition-all duration-200 focus:ring-2 focus:ring-[#4A3419] focus:border-[#4A3419]" />
                  <input name="phone" value={editFields.phone} onChange={handleChange} placeholder="Phone" className="border p-2 rounded transition-all duration-200 focus:ring-2 focus:ring-[#4A3419] focus:border-[#4A3419]" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-300 ease-in-out">
                  <div className="p-2"><span className="font-semibold">Name:</span> {customer?.name || customer?.shipping?.name || '-'}</div>
                  <div className="p-2"><span className="font-semibold">Email:</span> {customer?.email || editFields.email}</div>
                  <div className="p-2"><span className="font-semibold">Phone:</span> {customer?.phone || '-'}</div>
                </div>
              )}
            </div>
            <div className="bg-[#FFF5E6] rounded-lg p-4 border border-[#E8C39E]" data-section="account-form">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-[#4A3419]">Shipping Address</h2>
                {!editMode && <button onClick={handleEdit} className="text-[#4A3419] underline hover:text-[#6B4B26] font-semibold">Edit</button>}
              </div>
              {editMode ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-300 ease-in-out">
                  <input name="address.line1" value={editFields.address.line1} onChange={handleChange} placeholder="Address Line 1 *" className="border p-2 rounded transition-all duration-200 focus:ring-2 focus:ring-[#4A3419] focus:border-[#4A3419]" />
                  <input name="address.line2" value={editFields.address.line2} onChange={handleChange} placeholder="Address Line 2" className="border p-2 rounded transition-all duration-200 focus:ring-2 focus:ring-[#4A3419] focus:border-[#4A3419]" />
                  <input name="address.city" value={editFields.address.city} onChange={handleChange} placeholder="City *" className="border p-2 rounded transition-all duration-200 focus:ring-2 focus:ring-[#4A3419] focus:border-[#4A3419]" />
                  <input name="address.state" value={editFields.address.state} onChange={handleChange} placeholder="State *" className="border p-2 rounded transition-all duration-200 focus:ring-2 focus:ring-[#4A3419] focus:border-[#4A3419]" />
                  <input name="address.postal_code" value={editFields.address.postal_code} onChange={handleChange} placeholder="Postal Code *" className="border p-2 rounded transition-all duration-200 focus:ring-2 focus:ring-[#4A3419] focus:border-[#4A3419]" />
                  <input name="address.country" value={editFields.address.country || 'US'} onChange={handleChange} placeholder="Country" className="border p-2 rounded transition-all duration-200 focus:ring-2 focus:ring-[#4A3419] focus:border-[#4A3419]" />
                </div>
              ) : customer && customer.shipping && customer.shipping.address ? (
                <div className="transition-all duration-300 ease-in-out">
                  <div className="p-2">{customer.shipping.name}</div>
                  <div className="p-2">{customer.shipping.address.line1} {customer.shipping.address.line2}</div>
                  <div className="p-2">{customer.shipping.address.city}, {customer.shipping.address.state} {customer.shipping.address.postal_code}</div>
                  <div className="p-2">{customer.shipping.address.country}</div>
                </div>
              ) : (
                <div className="text-[#4A3419] p-2 transition-all duration-300 ease-in-out">No shipping address on file.</div>
              )}
            </div>
            {editMode && (
              <div className="flex gap-4 mt-2">
                <button 
                  onClick={handleSave} 
                  className={`px-6 py-2 rounded-lg font-bold transition-all duration-200 flex items-center gap-2 ${
                    saving 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : saveMsgType === 'success'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-[#4A3419] text-[#FFF5E6] hover:bg-[#6B4B26]'
                  }`} 
                  disabled={saving}
                >
                  {saving && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button 
                  onClick={handleCancel} 
                  className="bg-[#E8C39E] text-[#4A3419] px-6 py-2 rounded-lg font-bold hover:bg-[#FFF5E6] transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                {saveMsg && (
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    saveMsgType === 'success' 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    {saveMsgType === 'success' ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    {saveMsg}
                  </div>
                )}
              </div>
            )}
            {/* Email Security Section */}
            <div className="bg-[#FFF5E6] rounded-lg p-4 border border-[#E8C39E] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-col md:w-1/3">
                <div className="text-xl font-bold text-[#4A3419]">Email Security</div>
                <div className="text-sm text-[#4A3419] mt-1">
                  {user.emailVerified ? (
                    <span className="text-green-600 font-medium">✅ Email Verified</span>
                  ) : (
                    <span className="text-red-600 font-medium">❌ Email Not Verified</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-2 md:w-2/3">
                {!user.emailVerified ? (
                  <button 
                    onClick={handleSendVerification} 
                    className="bg-[#4A3419] text-[#FFF5E6] px-4 py-2 rounded-lg font-bold hover:bg-[#6B4B26] transition-colors whitespace-nowrap"
                  >
                    Verify Email
                  </button>
                ) : (
                  <button 
                    disabled 
                    className="bg-gray-400 text-gray-600 px-4 py-2 rounded-lg font-bold cursor-not-allowed whitespace-nowrap"
                  >
                    Email Verified
                  </button>
                )}
                <button 
                  onClick={() => setShowChangePassword(v => !v)} 
                  className="bg-[#E8C39E] text-[#4A3419] px-4 py-2 rounded-lg font-bold hover:bg-[#FFF5E6] transition-colors whitespace-nowrap"
                >
                  Change Password
                </button>
              </div>
            </div>
            {verifyMsg && (
              <div className={verifyMsgType === 'error' ? 'text-red-600 text-sm mt-1' : 'text-green-600 text-sm mt-1'}>{verifyMsg}</div>
            )}
            {showChangePassword && (
              <div className="bg-white rounded-lg p-4 border border-[#E8C39E] mt-2">
                <h3 className="text-lg font-bold text-[#4A3419] mb-4">Change Password</h3>
                
                {/* Current Password */}
                <div className="mb-4">
                  <PasswordInput 
                    value={currentPassword} 
                    onChange={e => setCurrentPassword(e.target.value)} 
                    placeholder="Enter your current password" 
                    label="Current Password"
                  />
                </div>

                {/* New Password */}
                <div className="mb-4">
                  <PasswordInput 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    placeholder="Enter your new password" 
                    label="New Password"
                  />
                  
                  {/* Password Requirements */}
                  {newPassword && (
                    <div className="mt-2 text-xs">
                      <div className="font-medium text-[#4A3419] mb-1">Password Requirements:</div>
                      {validatePassword(newPassword).map((req, index) => (
                        <div key={index} className={req.valid ? 'text-green-600' : 'text-red-600'}>
                          {req.valid ? '✅' : '❌'} {req.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <PasswordInput 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    placeholder="Confirm your new password" 
                    label="Confirm New Password"
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <div className="text-red-600 text-xs mt-1">Passwords do not match</div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button 
                    onClick={handleChangePassword} 
                    className="bg-[#4A3419] text-[#FFF5E6] px-4 py-2 rounded-lg font-bold hover:bg-[#6B4B26] transition-colors"
                  >
                    Update Password
                  </button>
                  <button 
                    onClick={() => {
                      setShowChangePassword(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                      setPasswordMsg('');
                    }} 
                    className="bg-[#E8C39E] text-[#4A3419] px-4 py-2 rounded-lg font-bold hover:bg-[#FFF5E6] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {passwordMsg && (
              <div className={`text-sm mt-2 ${passwordMsgType === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                {passwordMsg}
              </div>
            )}
            <PurchaseHistory customerId={customer?.id} />
            <button onClick={logout} className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg font-bold hover:bg-red-600">Log out</button>
          </div>
        )}
      </div>
    </div>
  );
}

function PurchaseHistory({ customerId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (!customerId) return;
    const fetchHistory = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/stripe-purchase-history?customerId=${customerId}`);
        const data = await res.json();
        if (data.history) setHistory(data.history);
        else setError('No purchase history found.');
      } catch (err) {
        setError('Failed to fetch purchase history.');
      }
      setLoading(false);
    };
    fetchHistory();
  }, [customerId]);

  return (
    <div className="bg-[#FFF5E6] rounded-lg p-4 border border-[#E8C39E]">
      <h2 className="text-xl font-bold text-[#4A3419] mb-2">Purchase History</h2>
      {loading ? (
        <div className="text-[#4A3419]">Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : history.length === 0 ? (
        <div>No purchases found.</div>
      ) : (
        <ul className="space-y-6">
          {history.map((session, i) => (
            <li key={i} className="bg-white rounded-lg border border-[#E8C39E] p-4 shadow-sm">
              <div className="font-bold mb-2 text-[#4A3419]">{new Date(session.created * 1000).toLocaleDateString()} — ${(session.amount_total / 100).toFixed(2)} {session.currency?.toUpperCase()}</div>
              {session.line_items && session.line_items.data && session.line_items.data.length > 0 && (
                <ul className="space-y-1">
                  {session.line_items.data.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      {item.price?.product?.images && item.price.product.images[0] && (
                        <img src={item.price.product.images[0]} alt={item.description} className="w-10 h-10 object-cover rounded" />
                      )}
                      <span className="font-semibold">{item.description}</span>
                      <span>— Qty: {item.quantity}</span>
                      <span>— ${(item.amount_total / 100).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function validatePhone(phone) {
  // Accepts US and international, numbers, spaces, dashes, parentheses, +
  if (!phone) return true;
  return /^\+?[0-9\s\-()]{7,20}$/.test(phone);
}
function validateAddress(address) {
  // Make country optional, default to 'US' if empty
  if (!address.country?.trim()) {
    address.country = 'US';
  }
  
  return (
    address.line1?.trim() &&
    address.city?.trim() &&
    address.state?.trim() &&
    address.postal_code?.trim()
  );
} 