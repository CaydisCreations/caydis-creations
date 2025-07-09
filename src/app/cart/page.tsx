'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaShoppingCart, FaTrash, FaStar } from 'react-icons/fa'
import { useCart } from '../context/CartContext'
import Link from 'next/link'
import { useFirebaseAuth } from '../context/FirebaseAuthContext';

type Address = {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

function validatePhone(phone: string) {
  // Accepts US and international, numbers, spaces, dashes, parentheses, +
  if (!phone) return false;
  return /^\+?[0-9\s\-()]{7,20}$/.test(phone);
}
function validateAddress(address: Address) {
  return (
    address.name?.trim() &&
    address.email?.trim() &&
    validatePhone(address.phone) &&
    address.line1?.trim() &&
    address.city?.trim() &&
    address.state?.trim() &&
    address.postal_code?.trim() &&
    address.country?.trim()
  );
}

function getValidAddress(initialAddress: Partial<Address> | undefined): Address {
  if (!initialAddress || typeof initialAddress !== 'object') {
    return {
      name: '', email: '', phone: '', line1: '', line2: '', city: '', state: '', postal_code: '', country: 'US',
    };
  }
  const addr = initialAddress as any;
  return {
    // @ts-ignore
    name: addr.name || '',
    // @ts-ignore
    email: addr.email || '',
    // @ts-ignore
    phone: addr.phone || '',
    // @ts-ignore
    line1: addr.line1 || '',
    // @ts-ignore
    line2: addr.line2 || '',
    // @ts-ignore
    city: addr.city || '',
    // @ts-ignore
    state: addr.state || '',
    // @ts-ignore
    postal_code: addr.postal_code || '',
    // @ts-ignore
    country: addr.country || 'US',
  };
}

interface ShippingModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (address: Address, selectedRate: any) => void;
  initialAddress?: Address;
  cartItems: any[];
}

function ShippingModal({ open, onClose, onConfirm, initialAddress = undefined, cartItems }: ShippingModalProps) {
  // Only set address on first mount
  const [address, setAddress] = useState<Address>(getValidAddress(initialAddress as Partial<Address> | undefined));
  const [rates, setRates] = useState([]);
  // Use a string key for selected rate
  const [selectedRateKey, setSelectedRateKey] = useState('');
  const [fetchingRates, setFetchingRates] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Helper to get a unique key for each rate
  const getRateKey = (rate: any) => rate.object_id || `${rate.provider}-${rate.servicelevel?.name}-${rate.amount}`;

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
    setFieldErrors(f => ({ ...f, [e.target.name]: '' }));
  };

  // Pure validation function
  const getValidationErrors = (addr: Address) => {
    const errors: Record<string, string> = {};
    if (!addr.name?.trim()) errors.name = 'Required';
    if (!addr.email?.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(addr.email)) errors.email = 'Valid email required';
    // Phone is now optional, but if present, must be valid
    if (addr.phone && !validatePhone(addr.phone)) errors.phone = 'Valid phone required';
    if (!addr.line1?.trim()) errors.line1 = 'Required';
    if (!addr.city?.trim()) errors.city = 'Required';
    if (!addr.state?.trim()) errors.state = 'Required';
    if (!addr.postal_code?.trim()) errors.postal_code = 'Required';
    if (!addr.country?.trim()) errors.country = 'Required';
    return errors;
  };

  // Use this for button disabling
  const isAddressValid = Object.keys(getValidationErrors(address)).length === 0;

  const fetchRates = async () => {
    const errors = getValidationErrors(address);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setFetchingRates(true);
    setRates([]);
    setSelectedRateKey('');
    setAddressError('');
    try {
      const parcelRes = await fetch('/api/cart-parcel-info', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cartItems })
      });
      const parcelData = await parcelRes.json();
      const cartWithParcel = parcelData.cartItems;
      const response = await fetch('/api/shipping-rates', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ address, cartItems: cartWithParcel })
      });
      const data = await response.json();
      if (data.rates && data.rates.length > 0) setRates(data.rates);
      else setAddressError('No shipping rates found for this address.');
    } catch (err) { setAddressError('Error fetching shipping rates.'); }
    setFetchingRates(false);
  };

  const handleConfirm = () => {
    const errors = getValidationErrors(address);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    if (!selectedRateKey) return;
    // Find the selected rate object
    const selectedRate = rates.find(rate => getRateKey(rate) === selectedRateKey);
    onConfirm(address, selectedRate);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
        <button className="absolute top-2 right-2 text-[#4A3419]" onClick={onClose}><FaTimes size={20} /></button>
        <h2 className="text-2xl font-bold mb-4 text-[#4A3419]">Shipping Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input name="name" value={address.name} onChange={handleAddressChange} placeholder="Full Name" className="border p-2 rounded" />
            {fieldErrors.name && <div className="text-xs text-red-600">{fieldErrors.name}</div>}
          </div>
          <div>
            <input name="email" value={address.email} onChange={handleAddressChange} placeholder="Email" className="border p-2 rounded" />
            {fieldErrors.email && <div className="text-xs text-red-600">{fieldErrors.email}</div>}
          </div>
          <div>
            <input name="phone" value={address.phone} onChange={handleAddressChange} placeholder="Phone" className="border p-2 rounded" />
            {fieldErrors.phone && <div className="text-xs text-red-600">{fieldErrors.phone}</div>}
          </div>
          <div>
            <input name="line1" value={address.line1} onChange={handleAddressChange} placeholder="Address Line 1" className="border p-2 rounded" />
            {fieldErrors.line1 && <div className="text-xs text-red-600">{fieldErrors.line1}</div>}
          </div>
          <div>
            <input name="line2" value={address.line2} onChange={handleAddressChange} placeholder="Address Line 2" className="border p-2 rounded" />
          </div>
          <div>
            <input name="city" value={address.city} onChange={handleAddressChange} placeholder="City" className="border p-2 rounded" />
            {fieldErrors.city && <div className="text-xs text-red-600">{fieldErrors.city}</div>}
          </div>
          <div>
            <input name="state" value={address.state} onChange={handleAddressChange} placeholder="State" className="border p-2 rounded" />
            {fieldErrors.state && <div className="text-xs text-red-600">{fieldErrors.state}</div>}
          </div>
          <div>
            <input name="postal_code" value={address.postal_code} onChange={handleAddressChange} placeholder="Postal Code" className="border p-2 rounded" />
            {fieldErrors.postal_code && <div className="text-xs text-red-600">{fieldErrors.postal_code}</div>}
          </div>
          <div>
            <select name="country" value={address.country} onChange={handleAddressChange} className="border p-2 rounded">
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="IT">Italy</option>
              <option value="ES">Spain</option>
              <option value="JP">Japan</option>
              <option value="CN">China</option>
              <option value="IN">India</option>
              <option value="MX">Mexico</option>
              <option value="BR">Brazil</option>
              <option value="NL">Netherlands</option>
              <option value="SE">Sweden</option>
              <option value="CH">Switzerland</option>
              <option value="IE">Ireland</option>
              <option value="NZ">New Zealand</option>
              <option value="SG">Singapore</option>
              <option value="KR">South Korea</option>
              <option value="ZA">South Africa</option>
              <option value="BE">Belgium</option>
              <option value="DK">Denmark</option>
              <option value="NO">Norway</option>
              <option value="FI">Finland</option>
              <option value="AT">Austria</option>
              <option value="PL">Poland</option>
              <option value="PT">Portugal</option>
              <option value="RU">Russia</option>
              <option value="TR">Turkey</option>
              <option value="IL">Israel</option>
              <option value="AE">United Arab Emirates</option>
              <option value="AR">Argentina</option>
              <option value="CL">Chile</option>
              <option value="CO">Colombia</option>
              <option value="TH">Thailand</option>
              <option value="MY">Malaysia</option>
              <option value="PH">Philippines</option>
              <option value="ID">Indonesia</option>
              <option value="SA">Saudi Arabia</option>
              <option value="EG">Egypt</option>
              <option value="GR">Greece</option>
              <option value="CZ">Czech Republic</option>
              <option value="HU">Hungary</option>
              <option value="RO">Romania</option>
              <option value="SK">Slovakia</option>
              <option value="SI">Slovenia</option>
              <option value="HR">Croatia</option>
              <option value="BG">Bulgaria</option>
              <option value="EE">Estonia</option>
              <option value="LV">Latvia</option>
              <option value="LT">Lithuania</option>
              <option value="LU">Luxembourg</option>
              <option value="MT">Malta</option>
              <option value="CY">Cyprus</option>
            </select>
            {fieldErrors.country && <div className="text-xs text-red-600">{fieldErrors.country}</div>}
          </div>
        </div>
        <button className="mt-4 px-4 py-2 bg-[#4A3419] text-white rounded hover:bg-[#6B4B26] disabled:opacity-60" onClick={fetchRates} disabled={fetchingRates || !isAddressValid}>
          {fetchingRates ? 'Fetching Rates...' : 'Get Shipping Rates'}
        </button>
        {addressError && <div className="text-red-600 mt-2">{addressError}</div>}
        {rates.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2 text-[#4A3419]">Select Shipping Rate</h3>
            <div className="flex flex-col gap-2 max-h-80 overflow-y-auto rounded border border-gray-200 bg-gray-50 p-2">
              {/* Organize and deduplicate rates */}
              {(() => {
                const seen = new Set();
                const uniqueRates = rates.filter(rate => {
                  const key = `${rate.provider}-${rate.servicelevel?.name}-${rate.amount}`;
                  if (seen.has(key)) return false;
                  seen.add(key);
                  return true;
                });
                uniqueRates.sort((a, b) => {
                  const priceDiff = parseFloat(a.amount) - parseFloat(b.amount);
                  if (priceDiff !== 0) return priceDiff;
                  if (a.provider !== b.provider) return a.provider.localeCompare(b.provider);
                  return (a.servicelevel?.name || '').localeCompare(b.servicelevel?.name || '');
                });
                const onlyUSPS = uniqueRates.every(rate => rate.provider === 'USPS');
                return (
                  <>
                    {onlyUSPS && (
                      <div className="text-xs text-gray-500 mb-2">Only USPS shipping is currently available.</div>
                    )}
                    {uniqueRates.map(rate => (
                      <label key={getRateKey(rate)}
                        className={`flex items-center border p-2 rounded cursor-pointer transition-colors duration-150 ${selectedRateKey === getRateKey(rate) ? 'border-[#4A3419] bg-[#FFF5E6]' : 'border-gray-200 hover:border-[#E8C39E]'}`}
                        tabIndex={0}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { setSelectedRateKey(getRateKey(rate)); } }}
                      >
                        <input type="radio" name="shippingRate" checked={selectedRateKey === getRateKey(rate)} onChange={() => setSelectedRateKey(getRateKey(rate))} className="mr-3" />
                        <span className="font-semibold">{rate.provider} {rate.servicelevel?.name}</span>
                        <span className="ml-2">${parseFloat(rate.amount).toFixed(2)}</span>
                        <span className="ml-2 text-xs text-gray-500">Est. {rate.estimated_days} days</span>
                      </label>
                    ))}
                  </>
                );
              })()}
            </div>
          </div>
        )}
        <button className="mt-6 w-full bg-[#4A3419] text-white py-2 rounded hover:bg-[#6B4B26] font-bold disabled:opacity-60" onClick={handleConfirm} disabled={!selectedRateKey || !isAddressValid}>Continue to Payment</button>
      </div>
    </div>
  );
}

function CartContent({ onCheckout, cartItems, setLoading, loading }) {
  const { removeFromCart, updateQuantity, getCartTotal, clearCart, isLoaded } = useCart()
  const [address, setAddress] = useState({
    name: '',
    email: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
  })
  const [rates, setRates] = useState([])
  const [selectedRate, setSelectedRate] = useState(null)
  const [fetchingRates, setFetchingRates] = useState(false)
  const [addressError, setAddressError] = useState('')

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value })
  }

  const fetchRates = async () => {
    setFetchingRates(true)
    setRates([])
    setSelectedRate(null)
    setAddressError('')
    try {
      // Fetch parcel info for cart items from the new API
      const parcelRes = await fetch('/api/cart-parcel-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems })
      })
      const parcelData = await parcelRes.json()
      const cartWithParcel = parcelData.cartItems
      const response = await fetch('/api/shipping-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, cartItems: cartWithParcel })
      })
      const data = await response.json()
      if (data.rates && data.rates.length > 0) {
        setRates(data.rates)
      } else {
        setAddressError('No shipping rates found for this address.')
      }
    } catch (err) {
      setAddressError('Error fetching shipping rates.')
    }
    setFetchingRates(false)
  }

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems, address, selectedRate })
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Failed to redirect to checkout.')
        setLoading(false)
      }
    } catch (err) {
      alert('Error starting checkout. Please try again.')
      setLoading(false)
    }
  }

  if (!isLoaded) {
    return <div className="p-8 text-center">Loading cart...</div>
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <FaShoppingCart className="text-[#4A3419] text-6xl opacity-50 mb-4" />
        <h1 className="text-3xl font-bold text-[#4A3419] mb-4">Your cart is empty</h1>
        <p className="text-[#4A3419] mb-8">Looks like you haven't added any products to your cart yet.</p>
        <Link 
          href="/products"
          className="bg-[#4A3419] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#6B4B26] transition-colors duration-300"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto mt-24">
      <motion.header 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-[#4A3419]">Your Shopping Cart</h1>
        <p className="mt-2 text-[#4A3419]">Review your items before checkout</p>
      </motion.header>

      {/* Shipping address form */}
      {/* Removed as per edit hint */}

      {/* Shipping rates selection */}
      {/* Removed as per edit hint */}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-6 gap-4 font-semibold text-[#4A3419] mb-4">
            <div className="col-span-3">Product</div>
            <div className="text-center">Price</div>
            <div className="text-center">Quantity</div>
            <div className="text-right">Total</div>
          </div>

          <AnimatePresence>
            {cartItems.map(item => (
              <motion.div 
                key={item.id}
                className="grid grid-cols-6 gap-4 py-4 items-center border-b border-gray-100 last:border-b-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <div className="col-span-3 flex items-center space-x-4">
                  <div className="bg-[#E8C39E] h-16 w-16 rounded-md overflow-hidden relative">
                    {/* Product image */}
                    <img src={item.image} alt={item.name} className="object-contain w-full h-full" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#4A3419]">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>
                </div>

                <div className="text-center">
                  ${item.price.toFixed(2)}
                </div>

                <div className="flex items-center justify-center">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center bg-[#E8C39E] text-[#4A3419] rounded-full hover:bg-[#d6b28e]"
                  >
                    -
                  </button>
                  <span className="mx-3 text-[#4A3419] w-8 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center bg-[#E8C39E] text-[#4A3419] rounded-full hover:bg-[#d6b28e]"
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center justify-end space-x-2">
                  <span className="font-bold text-[#4A3419]">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 hover:bg-red-100 text-red-500 rounded-full transition-colors duration-300"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="p-6 bg-[#FFF5E6] border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <button 
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 flex items-center"
              >
                <FaTimes className="mr-2" /> Clear Cart
              </button>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-[#4A3419]">
                Subtotal: <span className="text-2xl ml-2">${getCartTotal().toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">Taxes and shipping calculated at checkout</p>
              <div className="space-x-4">
                <Link
                  href="/products"
                  className="px-6 py-2 border border-[#4A3419] text-[#4A3419] rounded-lg hover:bg-[#E8C39E] transition-colors duration-300"
                >
                  Continue Shopping
                </Link>
                <motion.button 
                  className="px-6 py-2 bg-[#4A3419] text-white rounded-lg hover:bg-[#6B4B26] transition-colors duration-300 disabled:opacity-60"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onCheckout}
                  disabled={loading}
                >
                  {loading ? 'Redirecting...' : 'Proceed to Checkout'}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CartPage() {
  const { user } = useFirebaseAuth();
  const { cartItems } = useCart();
  const [modalOpen, setModalOpen] = useState(false);
  const [prefillAddress, setPrefillAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  const memoizedAddress = useMemo(() => prefillAddress, [JSON.stringify(prefillAddress)]);

  const handleOpenModal = async () => {
    if (user && user.email) {
      // Try to fetch Stripe customer info
      const res = await fetch('/api/stripe-customer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: user.email }) });
      const data = await res.json();
      let stripeAddress = null;
      if (data.customer && data.customer.shipping && data.customer.shipping.address) {
        stripeAddress = {
          ...data.customer.shipping.address,
          name: data.customer.shipping.name,
          email: user.email,
          phone: data.customer.phone || '',
        };
      }
      setPrefillAddress(stripeAddress || { name: user.displayName || '', email: user.email, phone: '', line1: '', line2: '', city: '', state: '', postal_code: '', country: 'US' });
    } else {
      setPrefillAddress({ name: '', email: '', phone: '', line1: '', line2: '', city: '', state: '', postal_code: '', country: 'US' });
    }
    setModalOpen(true);
  };

  const handleModalConfirm = async (address, selectedRate) => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems, address, selectedRate })
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to redirect to checkout.');
        setLoading(false);
      }
    } catch (err) {
      alert('Error starting checkout. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <CartContent onCheckout={handleOpenModal} cartItems={cartItems} setLoading={setLoading} loading={loading} />
      <ShippingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleModalConfirm}
        initialAddress={memoizedAddress}
        cartItems={cartItems}
      />
    </>
  );
} 