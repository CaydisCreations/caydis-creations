import { NextRequest, NextResponse } from 'next/server';

// Address validation function (same as your existing one)
async function validateAddress(address) {
  const errors = [];
  const suggestions = [];

  // Basic validation
  if (!address.line1?.trim()) {
    errors.push('Street address is required');
  }
  if (!address.city?.trim()) {
    errors.push('City is required');
  }
  if (!address.state?.trim()) {
    errors.push('State is required');
  }
  if (!address.postal_code?.trim()) {
    errors.push('Postal code is required');
  }

  // US postal code validation
  if (address.postal_code && !/^\d{5}(-\d{4})?$/.test(address.postal_code.replace(/\s/g, ''))) {
    errors.push('Invalid US postal code format');
    suggestions.push('Enter a valid 5-digit or 9-digit postal code');
  }

  return {
    isValid: errors.length === 0,
    errors,
    suggestions
  };
}

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

export async function POST(req: NextRequest) {
  try {
    if (!process.env.EASYPOST_API_KEY) {
      throw new Error('EASYPOST_API_KEY environment variable is not set');
    }
    
    const getEasyPost = (await import('../../../../lib/easypost-client.js')).default;
    const easypost = getEasyPost(process.env.EASYPOST_API_KEY);

    const { address, cartItems } = await req.json();
    console.log('easypost-shipping-rates: incoming address:', address);
    console.log('easypost-shipping-rates: incoming cartItems:', cartItems);
    
    if (!cartItems || cartItems.length === 0) {
      throw new Error('No cart items provided');
    }

    // Validate address before proceeding
    const addressValidation = await validateAddress(address);
    if (!addressValidation.isValid) {
      return NextResponse.json({ 
        error: 'Invalid address',
        details: addressValidation.errors,
        suggestions: addressValidation.suggestions
      }, { status: 400 });
    }
    
    const parcel = getParcelFromCart(cartItems);
    console.log('easypost-shipping-rates: parcel:', parcel);
    
    const toAddress = {
      name: address.name,
      street1: address.line1,
      street2: address.line2 || '',
      city: address.city,
      state: address.state,
      zip: address.postal_code,
      country: address.country || 'US',
      phone: address.phone || '',
      email: address.email || '',
    };
    console.log('easypost-shipping-rates: toAddress:', toAddress);
    
    const FROM_ADDRESSES = [
      {
        name: 'Caydi\'s Creations',
        street1: '400 Boston Post Rd',
        city: 'Orange',
        state: 'CT',
        zip: '06477',
        country: 'US',
        phone: '800-463-3339',
        email: 'admin@caydiscreations.com',
      },
      {
        name: 'Caydi\'s Creations',
        street1: '167 Cherry St',
        city: 'Milford',
        state: 'CT',
        zip: '06460',
        country: 'US',
        phone: '800-742-5877',
        email: 'admin@caydiscreations.com',
      }
    ];
    
    const shipments = await Promise.all(FROM_ADDRESSES.map(async (fromAddress, index) => {
      try {
        console.log(`easypost-shipping-rates: Creating shipment ${index + 1} with from address:`, fromAddress);
        
        // Create shipment with EasyPost
        const shipment = await easypost.Shipment.create({
          from_address: fromAddress,
          to_address: toAddress,
          parcel: {
            weight: parcel.weight,
            length: parcel.length,
            width: parcel.width,
            height: parcel.height,
          },
        });
        
        console.log(`easypost-shipping-rates: EasyPost shipment ${index + 1} response:`, shipment);
        
        return shipment;
      } catch (err) {
        console.error(`easypost-shipping-rates: EasyPost shipment ${index + 1} error:`, err);
        // Don't throw here, just log the error and continue with other addresses
        return { rates: [], error: err.message };
      }
    }));
    
    console.log('easypost-shipping-rates: EasyPost shipments:', shipments);
    
    const allRates = shipments.flatMap(s => s.rates || []);
    console.log('easypost-shipping-rates: allRates:', allRates);
    
    // Filter out rates with errors and sort by price
    const validRates = allRates
      .filter(rate => rate && !rate.error)
      .sort((a, b) => parseFloat(a.rate) - parseFloat(b.rate));
    
    console.log('easypost-shipping-rates: validRates:', validRates);
    
    // Transform EasyPost rates to match your existing format
    const transformedRates = validRates.map(rate => ({
      object_id: rate.id,
      provider: rate.carrier,
      servicelevel: {
        name: rate.service,
        token: rate.service,
        days: rate.delivery_days || 3,
      },
      amount: rate.rate,
      currency: rate.currency || 'USD',
      delivery_days: rate.delivery_days || 3,
      delivery_date: rate.delivery_date,
      delivery_date_guaranteed: rate.delivery_date_guaranteed || false,
    }));

    return NextResponse.json({ 
      success: true, 
      rates: transformedRates,
      shipment_count: shipments.length,
      valid_rates_count: transformedRates.length
    });

  } catch (err) {
    console.error('easypost-shipping-rates: error:', err);
    return NextResponse.json({ 
      error: err.message, 
      details: err?.response?.body || err.stack 
    }, { status: 500 });
  }
} 