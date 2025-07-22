'use client';

import { useState, useEffect } from 'react';
import { useFirebaseAuth } from '../../context/FirebaseAuthContext';

interface Coupon {
  id: string;
  name: string;
  percent_off?: number;
  amount_off?: number;
  currency?: string;
  duration: string;
  max_redemptions?: number;
  times_redeemed: number;
  redeem_by?: number;
  valid: boolean;
}

export default function CouponsAdminPage() {
  const { user } = useFirebaseAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    id: '',
    name: '',
    percent_off: '',
    amount_off: '',
    currency: 'usd',
    duration: 'once',
    max_redemptions: '',
    redeem_by: '',
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/admin/coupons');
      const data = await response.json();
      if (data.coupons) {
        setCoupons(data.coupons);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
    setLoading(false);
  };

  const createCoupon = async () => {
    if (!newCoupon.id || !newCoupon.name) {
      alert('Please fill in all required fields');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCoupon),
      });
      
      const data = await response.json();
      if (data.success) {
        setNewCoupon({
          id: '',
          name: '',
          percent_off: '',
          amount_off: '',
          currency: 'usd',
          duration: 'once',
          max_redemptions: '',
          redeem_by: '',
        });
        fetchCoupons();
      } else {
        alert(data.error || 'Failed to create coupon');
      }
    } catch (error) {
      alert('Error creating coupon');
    }
    setCreating(false);
  };

  const deleteCoupon = async (couponId: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const response = await fetch(`/api/admin/coupons/${couponId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.success) {
        fetchCoupons();
      } else {
        alert(data.error || 'Failed to delete coupon');
      }
    } catch (error) {
      alert('Error deleting coupon');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF5E6]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#4A3419] mb-4">Access Denied</h1>
          <p className="text-[#4A3419]">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5E6] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#4A3419] mb-8">Coupon Management</h1>
        
        {/* Create New Coupon */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-[#4A3419] mb-4">Create New Coupon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Coupon ID (e.g., SAVE10)"
              value={newCoupon.id}
              onChange={(e) => setNewCoupon({ ...newCoupon, id: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Coupon Name"
              value={newCoupon.name}
              onChange={(e) => setNewCoupon({ ...newCoupon, name: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Percent Off (e.g., 10)"
              value={newCoupon.percent_off}
              onChange={(e) => setNewCoupon({ ...newCoupon, percent_off: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Amount Off in cents (e.g., 500 for $5)"
              value={newCoupon.amount_off}
              onChange={(e) => setNewCoupon({ ...newCoupon, amount_off: e.target.value })}
              className="border p-2 rounded"
            />
            <select
              value={newCoupon.currency}
              onChange={(e) => setNewCoupon({ ...newCoupon, currency: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
              <option value="gbp">GBP</option>
            </select>
            <select
              value={newCoupon.duration}
              onChange={(e) => setNewCoupon({ ...newCoupon, duration: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="once">Once</option>
              <option value="repeating">Repeating</option>
              <option value="forever">Forever</option>
            </select>
            <input
              type="number"
              placeholder="Max Redemptions"
              value={newCoupon.max_redemptions}
              onChange={(e) => setNewCoupon({ ...newCoupon, max_redemptions: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="date"
              placeholder="Expiry Date"
              value={newCoupon.redeem_by}
              onChange={(e) => setNewCoupon({ ...newCoupon, redeem_by: e.target.value })}
              className="border p-2 rounded"
            />
          </div>
          <button
            onClick={createCoupon}
            disabled={creating}
            className="mt-4 px-6 py-2 bg-[#4A3419] text-white rounded-lg hover:bg-[#6B4B26] disabled:opacity-50"
          >
            {creating ? 'Creating...' : 'Create Coupon'}
          </button>
        </div>

        {/* Coupons List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#4A3419] mb-4">Existing Coupons</h2>
          {loading ? (
            <div className="text-center py-8">Loading coupons...</div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No coupons found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">ID</th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Discount</th>
                    <th className="text-left p-2">Duration</th>
                    <th className="text-left p-2">Usage</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-mono">{coupon.id}</td>
                      <td className="p-2">{coupon.name}</td>
                      <td className="p-2">
                        {coupon.percent_off ? `${coupon.percent_off}%` : `$${(coupon.amount_off! / 100).toFixed(2)}`}
                      </td>
                      <td className="p-2 capitalize">{coupon.duration}</td>
                      <td className="p-2">
                        {coupon.times_redeemed}
                        {coupon.max_redemptions && ` / ${coupon.max_redemptions}`}
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          coupon.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {coupon.valid ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-2">
                        <button
                          onClick={() => deleteCoupon(coupon.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 