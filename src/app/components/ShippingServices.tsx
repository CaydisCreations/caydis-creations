'use client';

import { useState } from 'react';
import { FaTruck, FaPlane, FaShip, FaCheck, FaInfoCircle } from 'react-icons/fa';

interface ShippingService {
  id: string;
  provider: string;
  name: string;
  description: string;
  deliveryTime: string;
  type: 'domestic' | 'international';
  category: 'express' | 'standard' | 'economy';
  icon: 'truck' | 'plane' | 'ship';
}

const SHIPPING_SERVICES: ShippingService[] = [
  // USPS Services
  {
    id: 'usps-priority',
    provider: 'USPS',
    name: 'Priority Mail',
    description: 'Domestic – 1–3 day delivery with tracking and insurance.',
    deliveryTime: '1-3 days',
    type: 'domestic',
    category: 'express',
    icon: 'truck'
  },
  {
    id: 'usps-priority-international',
    provider: 'USPS',
    name: 'Priority Mail International',
    description: 'International – 6–10 day delivery, cost-effective.',
    deliveryTime: '6-10 days',
    type: 'international',
    category: 'standard',
    icon: 'plane'
  },
  {
    id: 'usps-priority-express-international',
    provider: 'USPS',
    name: 'Priority Mail Express International',
    description: 'International – 3–5 day premium service.',
    deliveryTime: '3-5 days',
    type: 'international',
    category: 'express',
    icon: 'plane'
  },
  {
    id: 'usps-priority-express',
    provider: 'USPS',
    name: 'Priority Mail Express',
    description: 'Domestic – Overnight delivery with tracking and insurance.',
    deliveryTime: '1 day',
    type: 'domestic',
    category: 'express',
    icon: 'truck'
  },

  // UPS Services
  {
    id: 'ups-3-day-select',
    provider: 'UPS',
    name: '3 Day Select®',
    description: 'Domestic – Budget-friendly 3-day delivery.',
    deliveryTime: '3 days',
    type: 'domestic',
    category: 'standard',
    icon: 'truck'
  },
  {
    id: 'ups-ground',
    provider: 'UPS',
    name: 'Ground',
    description: 'Domestic – Standard cost-effective ground shipping.',
    deliveryTime: '1-5 days',
    type: 'domestic',
    category: 'standard',
    icon: 'truck'
  },
  {
    id: 'ups-ground-saver',
    provider: 'UPS',
    name: 'Ground Saver',
    description: 'Domestic – Slower than Ground, lowest-cost option.',
    deliveryTime: '3-7 days',
    type: 'domestic',
    category: 'economy',
    icon: 'truck'
  },
  {
    id: 'ups-surepost',
    provider: 'UPS',
    name: 'Surepost',
    description: 'Domestic – Low-cost hybrid UPS + USPS final delivery.',
    deliveryTime: '3-7 days',
    type: 'domestic',
    category: 'economy',
    icon: 'truck'
  },
  {
    id: 'ups-worldwide-expedited',
    provider: 'UPS',
    name: 'Worldwide Expedited®',
    description: 'International – Reliable, budget-friendly option.',
    deliveryTime: '2-5 days',
    type: 'international',
    category: 'standard',
    icon: 'plane'
  },
  {
    id: 'ups-worldwide-express-saver',
    provider: 'UPS',
    name: 'Worldwide Express Saver®',
    description: 'International – Faster international shipping (1–3 days).',
    deliveryTime: '1-3 days',
    type: 'international',
    category: 'express',
    icon: 'plane'
  },

  // FedEx Services
  {
    id: 'fedex-ground',
    provider: 'FedEx',
    name: 'Ground',
    description: 'Domestic – Basic ground service to businesses.',
    deliveryTime: '1-5 days',
    type: 'domestic',
    category: 'standard',
    icon: 'truck'
  },
  {
    id: 'fedex-home-delivery',
    provider: 'FedEx',
    name: 'Home Delivery®',
    description: 'Domestic – Residential ground delivery (Tue–Sat).',
    deliveryTime: '1-5 days',
    type: 'domestic',
    category: 'standard',
    icon: 'truck'
  },
  {
    id: 'fedex-express-saver',
    provider: 'FedEx',
    name: 'Express Saver®',
    description: 'Domestic – 3-day shipping (guaranteed by end of day).',
    deliveryTime: '3 days',
    type: 'domestic',
    category: 'express',
    icon: 'truck'
  },
  {
    id: 'fedex-international-priority',
    provider: 'FedEx',
    name: 'International Priority®',
    description: 'International – 1–3 day express service.',
    deliveryTime: '1-3 days',
    type: 'international',
    category: 'express',
    icon: 'plane'
  },
  {
    id: 'fedex-ground-economy',
    provider: 'FedEx',
    name: 'Ground® Economy',
    description: 'Domestic – Slowest but cheapest (FedEx + USPS hybrid).',
    deliveryTime: '2-7 days',
    type: 'domestic',
    category: 'economy',
    icon: 'truck'
  }
];

interface ShippingServicesProps {
  onServiceSelect?: (service: ShippingService) => void;
  selectedService?: string;
  showPricing?: boolean;
}

export default function ShippingServices({ onServiceSelect, selectedService, showPricing = false }: ShippingServicesProps) {
  const [filter, setFilter] = useState<'all' | 'domestic' | 'international'>('all');
  const [providerFilter, setProviderFilter] = useState<'all' | 'USPS' | 'UPS' | 'FedEx'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'express' | 'standard' | 'economy'>('all');

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'truck': return <FaTruck className="text-blue-600" />;
      case 'plane': return <FaPlane className="text-green-600" />;
      case 'ship': return <FaShip className="text-purple-600" />;
      default: return <FaTruck className="text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'express': return 'bg-red-100 text-red-800 border-red-200';
      case 'standard': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'economy': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'USPS': return 'bg-blue-50 border-blue-200';
      case 'UPS': return 'bg-brown-50 border-brown-200';
      case 'FedEx': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const filteredServices = SHIPPING_SERVICES.filter(service => {
    if (filter !== 'all' && service.type !== filter) return false;
    if (providerFilter !== 'all' && service.provider !== providerFilter) return false;
    if (categoryFilter !== 'all' && service.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#4A3419] mb-4">Available Shipping Services</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose from our comprehensive selection of reliable shipping options. 
          We partner with USPS, UPS, and FedEx to provide you with the best rates and delivery times.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4 justify-center">
          {/* Type Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-[#4A3419]">Type:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A3419]"
            >
              <option value="all">All Types</option>
              <option value="domestic">Domestic</option>
              <option value="international">International</option>
            </select>
          </div>

          {/* Provider Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-[#4A3419]">Provider:</label>
            <select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A3419]"
            >
              <option value="all">All Providers</option>
              <option value="USPS">USPS</option>
              <option value="UPS">UPS</option>
              <option value="FedEx">FedEx</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-[#4A3419]">Speed:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A3419]"
            >
              <option value="all">All Speeds</option>
              <option value="express">Express</option>
              <option value="standard">Standard</option>
              <option value="economy">Economy</option>
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 justify-center text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
            <span>Express</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
            <span>Standard</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
            <span>Economy</span>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedService === service.id 
                ? 'border-[#4A3419] bg-[#FFF5E6] shadow-md' 
                : 'border-gray-200 hover:border-[#E8C39E]'
            } ${getProviderColor(service.provider)}`}
            onClick={() => onServiceSelect?.(service)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getIcon(service.icon)}
                <div>
                  <h3 className="font-bold text-[#4A3419]">{service.provider}</h3>
                  <p className="text-sm font-medium text-gray-700">{service.name}</p>
                </div>
              </div>
              {selectedService === service.id && (
                <FaCheck className="text-[#4A3419] text-lg" />
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
              {service.description}
            </p>

            {/* Details */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Delivery Time:</span>
                <span className="text-sm font-medium text-[#4A3419]">{service.deliveryTime}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Type:</span>
                <span className="text-xs font-medium capitalize text-gray-600">
                  {service.type}
                </span>
              </div>

              {/* Category Badge */}
              <div className="flex justify-end">
                <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryColor(service.category)}`}>
                  {service.category}
                </span>
              </div>
            </div>

            {/* Pricing Placeholder */}
            {showPricing && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-center">
                  <span className="text-sm text-gray-500">Price calculated at checkout</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <FaInfoCircle className="text-gray-400 text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No services found</h3>
          <p className="text-gray-500">Try adjusting your filters to see available shipping options.</p>
        </div>
      )}

      {/* Summary */}
      <div className="mt-8 text-center">
        <div className="bg-[#FFF5E6] rounded-lg p-6 border border-[#E8C39E]">
          <h3 className="text-lg font-bold text-[#4A3419] mb-2">Shipping Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-[#4A3419]">📦 USPS:</span>
              <p className="text-gray-600">4 services available</p>
            </div>
            <div>
              <span className="font-medium text-[#4A3419]">🚚 UPS:</span>
              <p className="text-gray-600">6 services available</p>
            </div>
            <div>
              <span className="font-medium text-[#4A3419]">✈️ FedEx:</span>
              <p className="text-gray-600">5 services available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 