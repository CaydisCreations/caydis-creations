'use client'

import React, { useEffect, useState } from 'react';
import { useFirebaseAuth } from '../context/FirebaseAuthContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { sendEmailVerification, updateEmail, updatePassword, getAuth } from 'firebase/auth';

export default function AccountPage() {
  const { user, logout } = useFirebaseAuth();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editFields, setEditFields] = useState({ name: '', email: '', phone: '', address: { line1: '', line2: '', city: '', state: '', postal_code: '', country: '' } });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [verifyMsg, setVerifyMsg] = useState('');
  const [verifyMsgType, setVerifyMsgType] = useState<'success' | 'error' | ''>('');
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState({ phone: '', address: '' });

  useEffect(() => {
    if (!user) {
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
            address: { line1: '', line2: '', city: '', state: '', postal_code: '', country: '' },
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
    if (!validatePhone(editFields.phone)) {
      errors.phone = 'Invalid phone number.';
    }
    if (!validateAddress(editFields.address)) {
      errors.address = 'Please fill all address fields.';
    }
    setFieldErrors(errors);
    if (errors.phone || errors.address) {
      setSaving(false);
      return;
    }
    try {
      let data;
      if (!customer) {
        // No customer: create new Stripe customer
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
      } else {
        // Update existing customer
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
      }
      if (data.customer) {
        setCustomer(data.customer);
        setEditMode(false);
        setSaveMsg('Saved!');
      } else {
        setSaveMsg(data.error || 'Failed to save.');
      }
    } catch (err) {
      setSaveMsg('Failed to save.');
    }
    setSaving(false);
  };

  const handleSendVerification = async () => {
    setVerifyMsg('');
    setVerifyMsgType('');
    if (user && user.email && !user.emailVerified) {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser && !currentUser.emailVerified) {
          await sendEmailVerification(currentUser);
          setVerifyMsg('Verification email sent!');
          setVerifyMsgType('success');
        } else {
          setVerifyMsg('Your email is already verified.');
          setVerifyMsgType('success');
        }
      } catch (err: any) {
        setVerifyMsg('Failed to send verification email.');
        setVerifyMsgType('error');
      }
    } else if (user && user.emailVerified) {
      setVerifyMsg('Your email is already verified.');
      setVerifyMsgType('success');
    }
  };
  const handleChangePassword = async () => {
    setPasswordMsg('');
    if (user && passwordInput) {
      try {
        await updatePassword(user, passwordInput);
        setPasswordMsg('Password updated!');
        setShowChangePassword(false);
      } catch (err: any) {
        setPasswordMsg('Failed to update password.');
      }
    }
  };

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
            <div className="bg-[#FFF5E6] rounded-lg p-4 border border-[#E8C39E]">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-[#4A3419]">Personal Info</h2>
                {!editMode && <button onClick={handleEdit} className="text-[#4A3419] underline hover:text-[#6B4B26] font-semibold">Edit</button>}
              </div>
              {editMode ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="name" value={editFields.name} onChange={handleChange} placeholder="Name" className="border p-2 rounded" />
                  <input name="email" value={editFields.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded" />
                  <input name="phone" value={editFields.phone} onChange={handleChange} placeholder="Phone" className="border p-2 rounded" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><span className="font-semibold">Name:</span> {customer?.name || customer?.shipping?.name || '-'}</div>
                  <div><span className="font-semibold">Email:</span> {customer?.email || editFields.email}</div>
                  <div><span className="font-semibold">Phone:</span> {customer?.phone || '-'}</div>
                </div>
              )}
            </div>
            <div className="bg-[#FFF5E6] rounded-lg p-4 border border-[#E8C39E]">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-[#4A3419]">Shipping Address</h2>
                {!editMode && <button onClick={handleEdit} className="text-[#4A3419] underline hover:text-[#6B4B26] font-semibold">Edit</button>}
              </div>
              {editMode ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="address.line1" value={editFields.address.line1} onChange={handleChange} placeholder="Address Line 1" className="border p-2 rounded" />
                  <input name="address.line2" value={editFields.address.line2} onChange={handleChange} placeholder="Address Line 2" className="border p-2 rounded" />
                  <input name="address.city" value={editFields.address.city} onChange={handleChange} placeholder="City" className="border p-2 rounded" />
                  <input name="address.state" value={editFields.address.state} onChange={handleChange} placeholder="State" className="border p-2 rounded" />
                  <input name="address.postal_code" value={editFields.address.postal_code} onChange={handleChange} placeholder="Postal Code" className="border p-2 rounded" />
                  <input name="address.country" value={editFields.address.country} onChange={handleChange} placeholder="Country" className="border p-2 rounded" />
                </div>
              ) : customer && customer.shipping && customer.shipping.address ? (
                <div>
                  <div>{customer.shipping.name}</div>
                  <div>{customer.shipping.address.line1} {customer.shipping.address.line2}</div>
                  <div>{customer.shipping.address.city}, {customer.shipping.address.state} {customer.shipping.address.postal_code}</div>
                  <div>{customer.shipping.address.country}</div>
                </div>
              ) : (
                <div className="text-[#4A3419]">No shipping address on file.</div>
              )}
            </div>
            {editMode && (
              <div className="flex gap-4 mt-2">
                <button onClick={handleSave} className="bg-[#4A3419] text-[#FFF5E6] px-6 py-2 rounded-lg font-bold hover:bg-[#6B4B26] transition-colors" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                <button onClick={handleCancel} className="bg-[#E8C39E] text-[#4A3419] px-6 py-2 rounded-lg font-bold hover:bg-[#FFF5E6] transition-colors">Cancel</button>
                {saveMsg && <span className="ml-4 text-[#4A3419]">{saveMsg}</span>}
              </div>
            )}
            {/* Email Security Section */}
            <div className="bg-[#FFF5E6] rounded-lg p-4 border border-[#E8C39E] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="text-xl font-bold text-[#4A3419] md:w-1/3">Email Security</div>
              <div className="flex flex-col md:flex-row gap-2 md:w-2/3">
                {!user.emailVerified && (
                  <button onClick={handleSendVerification} className="bg-[#4A3419] text-[#FFF5E6] px-4 py-2 rounded-lg font-bold hover:bg-[#6B4B26] transition-colors whitespace-nowrap">Verify Email</button>
                )}
                <button onClick={() => setShowChangePassword(v => !v)} className="bg-[#E8C39E] text-[#4A3419] px-4 py-2 rounded-lg font-bold hover:bg-[#FFF5E6] transition-colors whitespace-nowrap">Change Password</button>
              </div>
            </div>
            {verifyMsg && (
              <div className={verifyMsgType === 'error' ? 'text-red-600 text-sm mt-1' : 'text-green-600 text-sm mt-1'}>{verifyMsg}</div>
            )}
            {showChangePassword && (
              <div className="flex flex-col md:flex-row gap-2 mt-2">
                <input type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} placeholder="New password" className="border p-2 rounded flex-1" />
                <button onClick={handleChangePassword} className="bg-[#4A3419] text-[#FFF5E6] px-4 py-1 rounded-lg font-bold hover:bg-[#6B4B26] transition-colors">Save</button>
                <button onClick={() => setShowChangePassword(false)} className="bg-[#E8C39E] text-[#4A3419] px-4 py-1 rounded-lg font-bold hover:bg-[#FFF5E6] transition-colors">Cancel</button>
              </div>
            )}
            {passwordMsg && <div className="text-[#4A3419] text-sm mt-1">{passwordMsg}</div>}
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
  return (
    address.line1?.trim() &&
    address.city?.trim() &&
    address.state?.trim() &&
    address.postal_code?.trim() &&
    address.country?.trim()
  );
} 