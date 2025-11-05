'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaShoppingCart, FaTrash, FaStar } from 'react-icons/fa'
import { useCart } from '../context/CartContext'
import { Toast, useToast } from '../components/Toast'
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

  // Update address when initialAddress changes
  useEffect(() => {
    console.log('ShippingModal: initialAddress changed:', initialAddress); // Debug log
    if (initialAddress) {
      const validAddress = getValidAddress(initialAddress as Partial<Address> | undefined);
      console.log('ShippingModal: setting address to:', validAddress); // Debug log
      setAddress(validAddress);
    }
  }, [initialAddress]);

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
      const response = await fetch('/api/shipstation-shipping-rates', {
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
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-6xl relative">
        <button className="absolute top-2 right-2 text-[#4A3419]" onClick={onClose}><FaTimes size={20} /></button>
        
        {/* Side by side layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left side - Shipping Address */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-[#4A3419]">Shipping Address</h2>
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">
                📍 Please double-check your address and ensure it's correct, as this is essential for delivering your product successfully!
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input name="name" value={address.name} onChange={handleAddressChange} placeholder="Full Name" className="border p-2 rounded w-full" />
                {fieldErrors.name && <div className="text-xs text-red-600">{fieldErrors.name}</div>}
              </div>
              <div>
                <input name="email" value={address.email} onChange={handleAddressChange} placeholder="Email" className="border p-2 rounded w-full" />
                {fieldErrors.email && <div className="text-xs text-red-600">{fieldErrors.email}</div>}
              </div>
              <div>
                <input name="phone" value={address.phone} onChange={handleAddressChange} placeholder="Phone" className="border p-2 rounded w-full" />
                {fieldErrors.phone && <div className="text-xs text-red-600">{fieldErrors.phone}</div>}
              </div>
              <div>
                <input name="line1" value={address.line1} onChange={handleAddressChange} placeholder="Address Line 1" className="border p-2 rounded w-full" />
                {fieldErrors.line1 && <div className="text-xs text-red-600">{fieldErrors.line1}</div>}
              </div>
              <div className="md:col-span-2">
                <input name="line2" value={address.line2} onChange={handleAddressChange} placeholder="Address Line 2" className="border p-2 rounded w-full" />
              </div>
              <div>
                <input name="city" value={address.city} onChange={handleAddressChange} placeholder="City" className="border p-2 rounded w-full" />
                {fieldErrors.city && <div className="text-xs text-red-600">{fieldErrors.city}</div>}
              </div>
              <div>
                <input name="state" value={address.state} onChange={handleAddressChange} placeholder="State" className="border p-2 rounded w-full" />
                {fieldErrors.state && <div className="text-xs text-red-600">{fieldErrors.state}</div>}
              </div>
              <div>
                <input name="postal_code" value={address.postal_code} onChange={handleAddressChange} placeholder="Postal Code" className="border p-2 rounded w-full" />
                {fieldErrors.postal_code && <div className="text-xs text-red-600">{fieldErrors.postal_code}</div>}
              </div>
              <div>
                <select name="country" value={address.country} onChange={handleAddressChange} className="border p-2 rounded w-full">
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
          </div>
          
          {/* Right side - Shipping Rates */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-[#4A3419]">Select Shipping Rate</h3>
            {rates.length > 0 ? (
              <div className="flex flex-col gap-3 max-h-96 overflow-y-auto rounded border border-gray-200 bg-gray-50 p-3">
                {/* Organize and deduplicate rates by carrier */}
                {(() => {
                  const seen = new Set();
                  const uniqueRates = rates.filter(rate => {
                    const key = `${rate.provider}-${rate.servicelevel?.name}-${rate.amount}`;
                    if (seen.has(key)) return false;
                    seen.add(key);
                    return true;
                  });
                  
                  // Group rates by carrier
                  const ratesByCarrier = uniqueRates.reduce((acc, rate) => {
                    if (!acc[rate.provider]) {
                      acc[rate.provider] = [];
                    }
                    acc[rate.provider].push(rate);
                    return acc;
                  }, {} as Record<string, typeof uniqueRates>);
                  
                  // Sort rates within each carrier by price
                  Object.keys(ratesByCarrier).forEach(carrier => {
                    ratesByCarrier[carrier].sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
                  });
                  
                  const onlyUSPS = uniqueRates.every(rate => rate.provider === 'USPS');
                  
                  const getProviderIcon = (provider: string) => {
                    switch (provider) {
                      case 'USPS': return '📦';
                      case 'UPS': return '🚚';
                      case 'FedEx': return '✈️';
                      default: return '📦';
                    }
                  };
                  
                  const getDeliveryTimeColor = (days: string) => {
                    const numDays = parseInt(days);
                    if (numDays <= 3) return 'text-green-600';
                    if (numDays <= 7) return 'text-blue-600';
                    return 'text-gray-600';
                  };
                  
                  const getCarrierColor = (carrier: string) => {
                    switch (carrier) {
                      case 'USPS': return 'border-blue-200 bg-blue-50';
                      case 'UPS': return 'border-brown-200 bg-brown-50';
                      case 'FedEx': return 'border-purple-200 bg-purple-50';
                      default: return 'border-gray-200 bg-gray-50';
                    }
                  };
                  
                  return (
                    <>
                      {onlyUSPS && (
                        <div className="text-xs text-gray-500 mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                          💡 Only USPS shipping is currently available for this address. This is normal in test mode - production will have more carriers.
                        </div>
                      )}
                      
                      {Object.entries(ratesByCarrier).map(([carrier, carrierRates]) => (
                        <div key={carrier} className="mb-4">
                          {/* Carrier Header */}
                          <div className={`flex items-center space-x-2 mb-2 p-2 rounded ${getCarrierColor(carrier)}`}>
                            <span className="text-lg">{getProviderIcon(carrier)}</span>
                            <h4 className="font-bold text-[#4A3419]">{carrier}</h4>
                            <span className="text-xs text-gray-500">({(carrierRates as any[]).length} option{(carrierRates as any[]).length !== 1 ? 's' : ''})</span>
                          </div>
                          
                          {/* Carrier Options */}
                          <div className="space-y-2">
                            {(carrierRates as any[]).map(rate => {
                              const isSelected = selectedRateKey === getRateKey(rate);
                              
                              return (
                                <label key={getRateKey(rate)}
                                  className={`flex items-center border p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                    isSelected 
                                      ? 'border-[#4A3419] bg-[#FFF5E6] shadow-md' 
                                      : 'border-gray-200 hover:border-[#E8C39E] hover:bg-white'
                                  }`}
                                  tabIndex={0}
                                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { setSelectedRateKey(getRateKey(rate)); } }}
                                >
                                  <input 
                                    type="radio" 
                                    name="shippingRate" 
                                    checked={isSelected} 
                                    onChange={() => setSelectedRateKey(getRateKey(rate))} 
                                    className="mr-3" 
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                      <div className="flex items-center space-x-2">
                                        <div>
                                          <span className="font-semibold text-[#4A3419]">
                                            {rate.servicelevel?.name}
                                          </span>
                                          <div className="text-xs text-gray-500">
                                            {rate.provider === 'USPS' && rate.servicelevel?.name?.includes('Priority') && '📦 Reliable & Insured'}
                                            {rate.provider === 'UPS' && rate.servicelevel?.name?.includes('Ground') && '🚚 Cost-effective'}
                                            {rate.provider === 'FedEx' && rate.servicelevel?.name?.includes('Express') && '✈️ Fast & Guaranteed'}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <span className="font-bold text-lg text-[#4A3419]">
                                          ${parseFloat(rate.amount).toFixed(2)}
                                        </span>
                                        <div className={`text-xs font-medium ${getDeliveryTimeColor(rate.estimated_days)}`}>
                                          Est. {rate.estimated_days} days
                                        </div>
                                      </div>
                                    </div>
                                    {rate.servicelevel?.description && (
                                      <div className="text-xs text-gray-600 mt-1">
                                        {rate.servicelevel.description}
                                      </div>
                                    )}
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Enter your shipping address and click "Get Shipping Rates" to see available options.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Bottom button */}
        <div className="mt-6 flex justify-center">
          <button className="px-8 py-3 bg-[#4A3419] text-white rounded hover:bg-[#6B4B26] font-bold disabled:opacity-60" onClick={handleConfirm} disabled={!selectedRateKey || !isAddressValid}>
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
}

function CartContent({ onCheckout, cartItems, setLoading, loading, couponCode, setCouponCode, couponValid, couponDetails, validatingCoupon, couponError, validateCoupon, removeCoupon }) {
  const { removeFromCart, updateQuantity, getCartTotal, clearCart, isLoaded } = useCart()
  const { toast, showToast, hideToast } = useToast()
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
  
  // Coupon state
  // const [couponCode, setCouponCode] = useState('') // Moved to CartPage
  // const [couponValid, setCouponValid] = useState(false) // Moved to CartPage
  // const [couponDetails, setCouponDetails] = useState(null) // Moved to CartPage
  // const [validatingCoupon, setValidatingCoupon] = useState(false) // Moved to CartPage
  // const [couponError, setCouponError] = useState('') // Moved to CartPage

  // const validateCoupon = async () => { // Moved to CartPage
  //   if (!couponCode.trim()) {
  //     setCouponError('Please enter a coupon code');
  //     return;
  //   }

  //   setValidatingCoupon(true);
  //   setCouponError('');
    
  //   try {
  //     const response = await fetch('/api/validate-coupon', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ couponCode: couponCode.trim() })
  //     });
      
  //     const data = await response.json();
      
  //     if (data.valid) {
  //       setCouponValid(true);
  //       setCouponDetails(data.coupon);
  //       setCouponError('');
  //     } else {
  //       setCouponValid(false);
  //       setCouponDetails(null);
  //       setCouponError(data.error || 'Invalid coupon code');
  //     }
  //   } catch (err) {
  //     setCouponValid(false);
  //     setCouponDetails(null);
  //     setCouponError('Failed to validate coupon. Please try again.');
  //   }
    
  //   setValidatingCoupon(false);
  // };

  // const removeCoupon = () => { // Moved to CartPage
  //   setCouponCode('');
  //   setCouponValid(false);
  //   setCouponDetails(null);
  //   setCouponError('');
  // };

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
      const response = await fetch('/api/shipstation-shipping-rates', {
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
    <div className="max-w-4xl mx-auto mt-20 md:mt-24 pt-4 md:pt-8 px-4 md:px-6">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
      <motion.header 
        className="text-center mb-6 md:mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-4xl font-bold text-[#4A3419]">Your Shopping Cart</h1>
        <p className="mt-2 text-sm md:text-base text-[#4A3419]">Review your items before checkout</p>
      </motion.header>

      {/* Shipping address form */}
      {/* Removed as per edit hint */}

      {/* Shipping rates selection */}
      {/* Removed as per edit hint */}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Desktop Table Headers */}
        <div className="hidden md:block p-4 md:p-6 border-b border-gray-200">
          <div className="grid grid-cols-6 gap-4 font-semibold text-[#4A3419]">
            <div className="col-span-3">Product</div>
            <div className="text-center">Price</div>
            <div className="text-center">Quantity</div>
            <div className="text-right">Total</div>
          </div>
        </div>

        {/* Cart Items */}
        <div className="p-4 md:p-6">
          <AnimatePresence>
            {cartItems.map(item => (
              <motion.div 
                key={item.id}
                className="mb-4 md:mb-0 pb-4 md:pb-4 border-b border-gray-100 last:border-b-0 last:mb-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                {/* Mobile Layout */}
                <div className="md:hidden space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="bg-[#E8C39E] h-20 w-20 rounded-md overflow-hidden relative flex-shrink-0">
                      <img src={item.image} alt={item.name} className="object-contain w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#4A3419] text-base mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-600 mb-2">{item.category}</p>
                      <div className="text-sm font-semibold text-[#4A3419] mb-2">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 hover:bg-red-100 text-red-500 rounded-full transition-colors duration-300 flex-shrink-0"
                      aria-label="Remove item"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#4A3419]">Quantity:</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={async () => {
                          const result = await updateQuantity(item.id, item.quantity - 1);
                          if (!result.success) {
                            showToast(result.message, 'error');
                          }
                        }}
                        className="w-9 h-9 flex items-center justify-center bg-[#E8C39E] text-[#4A3419] rounded-full hover:bg-[#d6b28e] font-bold text-lg"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="text-[#4A3419] font-semibold w-8 text-center text-base">{item.quantity}</span>
                      <button 
                        onClick={async () => {
                          const result = await updateQuantity(item.id, item.quantity + 1);
                          if (!result.success) {
                            showToast(result.message, 'error');
                          }
                        }}
                        className="w-9 h-9 flex items-center justify-center bg-[#E8C39E] text-[#4A3419] rounded-full hover:bg-[#d6b28e] font-bold text-lg"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-sm font-medium text-[#4A3419]">Total:</span>
                    <span className="font-bold text-[#4A3419] text-base">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:grid grid-cols-6 gap-4 items-center">
                  <div className="col-span-3 flex items-center space-x-4">
                    <div className="bg-[#E8C39E] h-16 w-16 rounded-md overflow-hidden relative flex-shrink-0">
                      <img src={item.image} alt={item.name} className="object-contain w-full h-full" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-[#4A3419] truncate">{item.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{item.category}</p>
                    </div>
                  </div>

                  <div className="text-center">
                    ${item.price.toFixed(2)}
                  </div>

                  <div className="flex items-center justify-center">
                    <button 
                      onClick={async () => {
                        const result = await updateQuantity(item.id, item.quantity - 1);
                        if (!result.success) {
                          showToast(result.message, 'error');
                        }
                      }}
                      className="w-8 h-8 flex items-center justify-center bg-[#E8C39E] text-[#4A3419] rounded-full hover:bg-[#d6b28e]"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="mx-3 text-[#4A3419] w-8 text-center">{item.quantity}</span>
                    <button 
                      onClick={async () => {
                        const result = await updateQuantity(item.id, item.quantity + 1);
                        if (!result.success) {
                          showToast(result.message, 'error');
                        }
                      }}
                      className="w-8 h-8 flex items-center justify-center bg-[#E8C39E] text-[#4A3419] rounded-full hover:bg-[#d6b28e]"
                      aria-label="Increase quantity"
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
                      aria-label="Remove item"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Coupon Section */}
        <div className="p-4 md:p-6 bg-gray-50 border-t border-gray-200">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-[#4A3419]">Have a coupon code?</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A3419] focus:border-[#4A3419]"
                disabled={couponValid}
              />
              {!couponValid ? (
                <button
                  onClick={validateCoupon}
                  disabled={validatingCoupon || !couponCode.trim()}
                  className="px-4 py-2.5 bg-[#4A3419] text-white rounded-lg hover:bg-[#6B4B26] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium whitespace-nowrap"
                >
                  {validatingCoupon ? 'Validating...' : 'Apply'}
                </button>
              ) : (
                <button
                  onClick={removeCoupon}
                  className="px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  Remove
                </button>
              )}
            </div>
            {couponError && (
              <p className="text-red-600 text-sm">{couponError}</p>
            )}
            {couponValid && couponDetails && (
              <div className="p-3 bg-green-100 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm font-medium">
                  ✓ {couponDetails.name} applied
                </p>
                <p className="text-green-600 text-xs mt-1">
                  {couponDetails.percent_off ? 
                    `${couponDetails.percent_off}% off` : 
                    `$${(couponDetails.amount_off / 100).toFixed(2)} off`
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="p-4 md:p-6 bg-[#FFF5E6] border-t border-gray-200">
          <div className="space-y-4 md:space-y-0 md:flex md:justify-between md:items-start">
            <div className="mb-4 md:mb-0">
              <button 
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 flex items-center text-sm font-medium transition-colors"
              >
                <FaTimes className="mr-2" size={14} /> Clear Cart
              </button>
            </div>
            <div className="md:text-right space-y-4">
              <div>
                <div className="text-base md:text-lg font-semibold text-[#4A3419]">
                  Subtotal: <span className="text-xl md:text-2xl ml-2">${getCartTotal().toFixed(2)}</span>
                </div>
                <p className="text-xs md:text-sm text-gray-600 mt-1">Taxes and shipping calculated at checkout</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/products"
                  className="px-5 py-2.5 border-2 border-[#4A3419] text-[#4A3419] rounded-lg hover:bg-[#E8C39E] transition-colors duration-300 text-center font-medium text-sm md:text-base"
                >
                  Continue Shopping
                </Link>
                <motion.button 
                  className="px-5 py-2.5 bg-[#4A3419] text-white rounded-lg hover:bg-[#6B4B26] transition-colors duration-300 disabled:opacity-60 font-medium text-sm md:text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponValid, setCouponValid] = useState(false);
  const [couponDetails, setCouponDetails] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');

  const memoizedAddress = useMemo(() => prefillAddress, [JSON.stringify(prefillAddress)]);

  const validateCoupon = async (code) => {
    if (!code.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setValidatingCoupon(true);
    setCouponError('');
    
    try {
      const response = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponCode: code.trim() })
      });
      
      const data = await response.json();
      
      if (data.valid) {
        setCouponValid(true);
        setCouponDetails(data.coupon);
        setCouponError('');
      } else {
        setCouponValid(false);
        setCouponDetails(null);
        setCouponError(data.error || 'Invalid coupon code');
      }
    } catch (err) {
      setCouponValid(false);
      setCouponDetails(null);
      setCouponError('Failed to validate coupon. Please try again.');
    }
    
    setValidatingCoupon(false);
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponValid(false);
    setCouponDetails(null);
    setCouponError('');
  };

  const handleOpenModal = async () => {
    if (user && user.email) {
      try {
        // Try to fetch Stripe customer info
        const res = await fetch('/api/stripe-customer', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ email: user.email }) 
        });
        const data = await res.json();
        console.log('Stripe customer data:', data); // Debug log
        
        let stripeAddress = null;
        if (data.customer && data.customer.shipping && data.customer.shipping.address) {
          stripeAddress = {
            name: data.customer.shipping.name || data.customer.name || user.displayName || '',
            email: user.email,
            phone: data.customer.phone || '',
            line1: data.customer.shipping.address.line1 || '',
            line2: data.customer.shipping.address.line2 || '',
            city: data.customer.shipping.address.city || '',
            state: data.customer.shipping.address.state || '',
            postal_code: data.customer.shipping.address.postal_code || '',
            country: data.customer.shipping.address.country || 'US',
          };
          console.log('Using Stripe address:', stripeAddress); // Debug log
        } else {
          // No Stripe customer or no shipping address, use basic user info
          stripeAddress = { 
            name: user.displayName || '', 
            email: user.email, 
            phone: '', 
            line1: '', 
            line2: '', 
            city: '', 
            state: '', 
            postal_code: '', 
            country: 'US' 
          };
          console.log('Using basic user info:', stripeAddress); // Debug log
        }
        setPrefillAddress(stripeAddress);
      } catch (error) {
        console.error('Error fetching customer data:', error);
        // Fallback to basic user info
        setPrefillAddress({ 
          name: user.displayName || '', 
          email: user.email, 
          phone: '', 
          line1: '', 
          line2: '', 
          city: '', 
          state: '', 
          postal_code: '', 
          country: 'US' 
        });
      }
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
        body: JSON.stringify({ 
          items: cartItems, 
          address, 
          selectedRate,
          couponId: couponValid ? couponDetails.id : undefined
        })
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
      <CartContent 
        onCheckout={handleOpenModal} 
        cartItems={cartItems} 
        setLoading={setLoading} 
        loading={loading} 
        couponCode={couponCode} 
        setCouponCode={setCouponCode}
        couponValid={couponValid} 
        couponDetails={couponDetails} 
        validatingCoupon={validatingCoupon} 
        couponError={couponError} 
        validateCoupon={() => validateCoupon(couponCode)} 
        removeCoupon={removeCoupon} 
      />
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