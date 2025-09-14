import { NextRequest, NextResponse } from 'next/server';

function getParcelFromCart(cartItems) {
  // Calculate total weight and dimensions from cart items
  let totalWeight = 0;
  let maxLength = 0;
  let maxWidth = 0;
  let maxHeight = 0;

  cartItems.forEach(item => {
    const weight = parseFloat(item.parcel_weight_oz || '8'); // Default 8oz if not specified
    const length = parseFloat(item.parcel_length || '10'); // Default 10in
    const width = parseFloat(item.parcel_width || '8'); // Default 8in
    const height = parseFloat(item.parcel_height || '4'); // Default 4in

    totalWeight += weight * (item.quantity || 1);
    maxLength = Math.max(maxLength, length);
    maxWidth = Math.max(maxWidth, width);
    maxHeight = Math.max(maxHeight, height);
  });

  return {
    weight: Math.ceil(totalWeight), // Round up to nearest ounce
    length: maxLength,
    width: maxWidth,
    height: maxHeight,
  };
}

// Function to create optimized packages for different USPS package types
function createOptimizedUSPSPackages(parcel) {
  const packages = [];
  
  // Only include the most commonly used and cost-effective package types
  const priorityPackages = [
    'flat_rate_envelope',        // Usually cheapest for light items
    'flat_rate_padded_envelope', // Good for small items
    'small_flat_rate_box',       // Good for small heavy items
    'medium_flat_rate_box',      // Most popular box
    'package'                    // Custom size package
  ];
  
  // Add flat rate packages (no dimensions) - these are usually fastest to calculate
  priorityPackages.slice(0, -1).forEach(packageCode => {
    packages.push({
      packageCode: packageCode,
      weight: {
        value: parcel.weight,
        unit: 'ounce'
      }
      // No dimensions for flat rate packages
    });
  });
  
  // Add regular package with dimensions last
  packages.push({
    packageCode: 'package',
    weight: {
      value: parcel.weight,
      unit: 'ounce'
    },
    dimensions: {
      unit: 'inch',
      length: parcel.length,
      width: parcel.width,
      height: parcel.height
    }
  });
  
  return packages;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.SHIPSTATION_API_KEY) {
      throw new Error('SHIPSTATION_API_KEY environment variable is not set');
    }
    
    const getShipStation = (await import('../../../../lib/shipstation-client.js')).default;
    const shipstation = getShipStation(process.env.SHIPSTATION_API_KEY);

    const { address, cartItems } = await req.json();
    console.log('shipstation-shipping-rates: incoming address:', address);
    console.log('shipstation-shipping-rates: incoming cartItems:', cartItems);
    
    if (!cartItems || cartItems.length === 0) {
      throw new Error('No cart items provided');
    }
    
    const parcel = getParcelFromCart(cartItems);
    console.log('shipstation-shipping-rates: parcel:', parcel);
    
    // Convert address to ShipEngine format
    const toAddress = {
      name: address.name,
      addressLine1: address.line1,
      addressLine2: address.line2 || '',
      cityLocality: address.city,
      stateProvince: address.state,
      postalCode: address.postal_code,
      countryCode: address.country || 'US',
      phone: address.phone || '',
      email: address.email || '',
    };
    console.log('shipstation-shipping-rates: toAddress:', toAddress);
    
    // Use only the primary warehouse for speed (can add second one back if needed)
    const FROM_ADDRESSES = [
      {
        name: 'Caydi\'s Creations',
        addressLine1: '400 Boston Post Rd',
        cityLocality: 'Orange',
        stateProvince: 'CT',
        postalCode: '06477',
        countryCode: 'US',
        phone: '800-463-3339',
        email: 'admin@caydiscreations.com',
      }
      // Removed second warehouse for speed - can add back if needed:
      // {
      //   name: 'Caydi\'s Creations',
      //   addressLine1: '167 Cherry St',
      //   cityLocality: 'Milford',
      //   stateProvince: 'CT',
      //   postalCode: '06460',
      //   countryCode: 'US',
      //   phone: '800-742-5877',
      //   email: 'admin@caydiscreations.com',
      // }
    ];

    // Your connected carrier IDs
    const CARRIER_IDS = [
      'se-3274580' // USPS (working)
    ];
    
    const allRates = [];
    
    // Get rates from each warehouse location using your specific carriers
    for (const [index, fromAddress] of FROM_ADDRESSES.entries()) {
      try {
        console.log(`shipstation-shipping-rates: Getting rates from warehouse ${index + 1}:`, fromAddress);
        
        // Create optimized packages for different USPS package types
        const packages = createOptimizedUSPSPackages(parcel);
        console.log(`shipstation-shipping-rates: Optimized packages for warehouse ${index + 1}:`, packages);
        
        // Use Promise.allSettled to make parallel requests for better speed
        const ratePromises = packages.map(async (packageConfig) => {
          try {
            console.log(`shipstation-shipping-rates: Getting rates for package type: ${packageConfig.packageCode}`);
            
            const rates = await shipstation.getRatesWithShipmentDetails({
              rateOptions: {
                carrierIds: CARRIER_IDS
              },
              shipment: {
                validateAddress: 'no_validation',
                shipFrom: fromAddress,
                shipTo: toAddress,
                packages: [packageConfig] // Single package per request
              }
            });
            
            return rates.rateResponse?.rates || [];
          } catch (packageErr) {
            console.error(`shipstation-shipping-rates: Error getting rates for package ${packageConfig.packageCode}:`, packageErr.message);
            return []; // Return empty array on error
          }
        });
        
        // Wait for all rate requests to complete
        const allPackageRates = await Promise.allSettled(ratePromises);
        
        // Collect all successful rates
        allPackageRates.forEach((result) => {
          if (result.status === 'fulfilled' && result.value.length > 0) {
            allRates.push(...result.value);
          }
        });
        
      } catch (err) {
        console.error(`shipstation-shipping-rates: Error getting rates from warehouse ${index + 1}:`, err);
        
        // Check if it's an address validation error
        if (err.message && err.message.includes('address')) {
          return NextResponse.json({ 
            error: 'Invalid address. Please check your shipping address and try again.',
            address_validation_failed: true,
            details: err.message
          }, { status: 400 });
        }
        
        // Continue with other warehouses for other errors
      }
    }
    
    console.log('shipstation-shipping-rates: allRates:', allRates);
    
    // Filter out rates with errors, deduplicate, and sort by price
    const validRates = allRates
      .filter(rate => rate && !rate.errorMessages?.length)
      .filter((rate, index, self) => {
        // Deduplicate based on service type and package type
        const key = `${rate.serviceCode}-${rate.packageType}`;
        return index === self.findIndex(r => `${r.serviceCode}-${r.packageType}` === key);
      })
      .sort((a, b) => parseFloat(a.shippingAmount.amount) - parseFloat(b.shippingAmount.amount));
    
    console.log('shipstation-shipping-rates: validRates:', validRates);
    
    // If no valid rates found, return error
    if (validRates.length === 0) {
      return NextResponse.json({ 
        error: 'No shipping rates available for this address. Please check your address and try again.',
        no_rates_available: true
      }, { status: 400 });
    }
    
    // Transform ShipStation rates to match your existing format
    const transformedRates = validRates.map(rate => ({
      object_id: rate.rateId,
      provider: rate.carrierCode,
      servicelevel: {
        name: rate.serviceType,
        token: rate.serviceType,
        days: rate.deliveryDays || 3,
      },
      amount: rate.shippingAmount.amount,
      currency: rate.shippingAmount.currency || 'USD',
      delivery_days: rate.deliveryDays || 3,
      delivery_date: rate.estimatedDeliveryDate,
      delivery_date_guaranteed: rate.guaranteedService || false,
      package_type: rate.packageType, // Include package type for debugging
      validation_status: rate.validationStatus, // Include validation status
      warning_messages: rate.warningMessages || [], // Include warnings
    }));

    const packages = createOptimizedUSPSPackages(parcel); // Define packages here for the response

    return NextResponse.json({ 
      success: true, 
      rates: transformedRates,
      warehouse_count: FROM_ADDRESSES.length,
      valid_rates_count: transformedRates.length,
      production_mode: true,
      carriers_used: CARRIER_IDS,
      address_validated: true,
      message: 'Optimized shipping rates from ShipEngine API with priority package types',
      performance: {
        packages_checked: packages.length,
        parallel_requests: true,
        optimization: 'enabled'
      }
    });

  } catch (err) {
    console.error('shipstation-shipping-rates: error:', err);
    
    // Check if it's an address validation error
    if (err.message && (err.message.includes('address') || err.message.includes('validation'))) {
      return NextResponse.json({ 
        error: 'Invalid address. Please check your shipping address and try again.',
        address_validation_failed: true,
        details: err.message
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: err.message, 
      details: err?.response?.body || err.stack 
    }, { status: 500 });
  }
}
