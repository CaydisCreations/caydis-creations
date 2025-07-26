'use client';

import { useState, useEffect } from 'react';
import { FaTruck, FaDownload, FaEye, FaRedo, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  shipping: {
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
  amount_total: number;
  status: string;
  payment_status: string;
  created: number;
  metadata: {
    shipping_status?: string;
    tracking_info?: string;
    shipping_labels?: string;
    labels_created_at?: string;
  };
  line_items: {
    data: Array<{
      description: string;
      quantity: number;
      amount_total: number;
    }>;
  };
}

interface TrackingInfo {
  productName: string;
  trackingNumber: string;
  carrier: string;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [recreatingLabels, setRecreatingLabels] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'shipped' | 'delivered'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (retryCount = 0) => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      
      if (response.ok && data.orders) {
        setOrders(data.orders);
        if (data.message) {
          console.log('Admin API message:', data.message);
        }
      } else {
        console.error('Failed to fetch orders:', data.error || 'Unknown error');
        // Retry once if it's a rate limit error
        if (data.message?.includes('rate limit') && retryCount < 1) {
          console.log('Rate limit hit, retrying in 2 seconds...');
          setTimeout(() => {
            fetchOrders(retryCount + 1);
          }, 2000);
          return;
        }
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const recreateLabels = async (orderId: string) => {
    try {
      setRecreatingLabels(orderId);
      const response = await fetch('/api/admin/recreate-labels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      if (response.ok) {
        // Refresh orders to get updated data
        await fetchOrders();
        alert('Labels recreated successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to recreate labels: ${error.error}`);
      }
    } catch (error) {
      console.error('Error recreating labels:', error);
      alert('Failed to recreate labels');
    } finally {
      setRecreatingLabels(null);
    }
  };

  const getShippingStatus = (order: Order) => {
    if (!order.metadata?.shipping_status) return 'pending';
    return order.metadata.shipping_status;
  };

  const getTrackingInfo = (order: Order): TrackingInfo[] => {
    if (!order.metadata?.tracking_info) return [];
    try {
      return JSON.parse(order.metadata.tracking_info);
    } catch {
      return [];
    }
  };

  const getShippingLabels = (order: Order) => {
    if (!order.metadata?.shipping_labels) return [];
    try {
      return JSON.parse(order.metadata.shipping_labels);
    } catch {
      return [];
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'labels_created':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'labels_created':
        return <FaTruck className="text-blue-600" />;
      case 'shipped':
        return <FaTruck className="text-yellow-600" />;
      case 'delivered':
        return <FaCheck className="text-green-600" />;
      default:
        return <FaSpinner className="text-gray-600" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || getShippingStatus(order) === filter;
    const matchesSearch = 
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5E6] flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#4A3419] mx-auto mb-4" />
          <p className="text-[#4A3419]">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5E6]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-[#E8C39E]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#4A3419] mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage orders, shipping, and customer information</p>
            </div>
            <button
              onClick={() => fetchOrders()}
              className="bg-[#4A3419] text-white px-4 py-2 rounded-lg hover:bg-[#6B4B26] transition-colors duration-300 flex items-center space-x-2"
            >
              <FaRedo className="text-sm" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Status Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#4A3419] mb-2">Filter by Status</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A3419]"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="labels_created">Labels Created</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#4A3419] mb-2">Search Orders</label>
              <input
                type="text"
                placeholder="Search by customer name, email, or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A3419]"
              />
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-500 text-lg">No orders found matching your criteria.</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const shippingStatus = getShippingStatus(order);
              const trackingInfo = getTrackingInfo(order);
              const shippingLabels = getShippingLabels(order);

              return (
                <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#4A3419]">Order #{order.id}</h3>
                      <p className="text-sm text-gray-600">{formatDate(order.created)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(shippingStatus)}`}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(shippingStatus)}
                          <span className="capitalize">{shippingStatus.replace('_', ' ')}</span>
                        </div>
                      </span>
                      <span className="text-lg font-bold text-[#4A3419]">{formatCurrency(order.amount_total)}</span>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h4 className="font-semibold text-[#4A3419] mb-2">Customer Information</h4>
                      <div className="space-y-1 text-sm">
                        <p><strong>Name:</strong> {order.customer.name}</p>
                        <p><strong>Email:</strong> {order.customer.email}</p>
                        {order.customer.phone && <p><strong>Phone:</strong> {order.customer.phone}</p>}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#4A3419] mb-2">Shipping Address</h4>
                      <div className="space-y-1 text-sm">
                        <p>{order.shipping.address.line1}</p>
                        {order.shipping.address.line2 && <p>{order.shipping.address.line2}</p>}
                        <p>{order.shipping.address.city}, {order.shipping.address.state} {order.shipping.address.postal_code}</p>
                        <p>{order.shipping.address.country}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-[#4A3419] mb-2">Order Items</h4>
                    <div className="space-y-2">
                      {order.line_items.data.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.description} (Qty: {item.quantity})</span>
                          <span>{formatCurrency(item.amount_total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Information */}
                  {trackingInfo.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-[#4A3419] mb-2">Tracking Information</h4>
                      <div className="space-y-2">
                        {trackingInfo.map((tracking, index) => (
                          <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                            <div>
                              <span className="font-medium">{tracking.productName}</span>
                              <br />
                              <span className="text-gray-600">{tracking.carrier} - {tracking.trackingNumber}</span>
                            </div>
                            <a
                              href={`https://www.google.com/search?q=${tracking.carrier}+tracking+${tracking.trackingNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-xs"
                            >
                              Track Package
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      {shippingLabels.length > 0 && (
                        <button
                          onClick={() => {
                            shippingLabels.forEach((label: any) => {
                              if (label.labelUrl) {
                                window.open(label.labelUrl, '_blank');
                              }
                            });
                          }}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-1"
                        >
                          <FaDownload className="text-xs" />
                          <span>Download Labels</span>
                        </button>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {shippingStatus === 'pending' && (
                                                 <button
                           onClick={() => recreateLabels(order.id)}
                           disabled={recreatingLabels === order.id}
                           className="bg-[#4A3419] text-white px-3 py-1 rounded text-sm hover:bg-[#6B4B26] transition-colors duration-300 flex items-center space-x-1 disabled:opacity-50"
                         >
                           {recreatingLabels === order.id ? (
                             <FaSpinner className="animate-spin text-xs" />
                           ) : (
                             <FaRedo className="text-xs" />
                           )}
                           <span>Create Labels</span>
                         </button>
                      )}
                      {shippingStatus === 'labels_created' && (
                                                 <button
                           onClick={() => recreateLabels(order.id)}
                           disabled={recreatingLabels === order.id}
                           className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors duration-300 flex items-center space-x-1 disabled:opacity-50"
                         >
                           {recreatingLabels === order.id ? (
                             <FaSpinner className="animate-spin text-xs" />
                           ) : (
                             <FaRedo className="text-xs" />
                           )}
                           <span>Recreate Labels</span>
                         </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
} 