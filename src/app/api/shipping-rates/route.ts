import { NextRequest, NextResponse } from 'next/server';

// Address validation function - simplified for better compatibility
async function validateAddress(address) {
  const errors = [];
  const suggestions = [];
  
  // Clean and validate required fields
  const cleanStreet1 = address.line1?.trim() || '';
  const cleanCity = address.city?.trim() || '';
  const cleanState = address.state?.trim() || '';
  const cleanZip = address.postal_code?.trim() || '';
  const cleanName = address.name?.trim() || '';
  
  // Only check for absolutely required fields
  if (!cleanStreet1) {
    errors.push('Street address is required');
  }
  
  if (!cleanCity) {
    errors.push('City is required');
  }
  
  if (!cleanState) {
    errors.push('State is required');
  }
  
  if (!cleanZip) {
    errors.push('ZIP code is required');
  }
  
  if (!cleanName) {
    errors.push('Recipient name is required');
  }
  
  // Very basic validation - let Shippo handle the rest
  if (cleanStreet1.length < 3) {
    errors.push('Street address seems too short');
  }
  
  if (cleanCity.length < 2) {
    errors.push('City name seems too short');
  }
  
  // If we have errors, return validation result
  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      suggestions
    };
  }
  
  // If we get here, the address passes basic validation
  return {
    isValid: true,
    errors: [],
    suggestions: []
  };
}

// Optional: Add USPS address validation for more accuracy
async function validateAddressWithUSPS(address) {
  try {
    // This would require a USPS API key, but for now we'll use basic validation
    // In production, you could integrate with USPS Address Validation API
    return {
      isValid: true,
      errors: [],
      suggestions: []
    };
  } catch (error) {
    console.error('USPS validation error:', error);
    return {
      isValid: true, // Fallback to basic validation
      errors: [],
      suggestions: []
    };
  }
}

function getParcelFromCart(cartItems) {
  const item = cartItems[0];
  return {
    length: item.parcel_length.toString(),
    width: item.parcel_width.toString(),
    height: item.parcel_height.toString(),
    distanceUnit: 'in',
    weight: item.parcel_weight_oz.toString(),
    massUnit: 'oz',
  };
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.SHIPPO_API_KEY) {
      throw new Error('SHIPPO_API_KEY environment variable is not set');
    }
    
    const getShippo = (await import('../../../../lib/shippo-client.cjs')).default;
    const shippo = getShippo(process.env.SHIPPO_API_KEY);

    const { address, cartItems } = await req.json();
    console.log('shipping-rates: incoming address:', address);
    console.log('shipping-rates: incoming cartItems:', cartItems);
    
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
    console.log('shipping-rates: parcel:', parcel);
    
    const toAddress = {
      name: address.name,
      street1: address.line1,
      street2: address.line2 || '',
      city: address.city,
      state: address.state,
      zip: address.postal_code,
      country: address.country,
      phone: address.phone || '',
      email: address.email || '',
    };
    console.log('shipping-rates: toAddress:', toAddress);
    
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
        carrier: 'fedex',
      },
      {
        name: 'Caydi\'s Creations',
        street1: '355 Campbell Ave',
        city: 'West Haven',
        state: 'CT',
        zip: '06516',
        country: 'US',
        phone: '800-742-5877',
        email: 'admin@caydiscreations.com',
        carrier: 'ups',
      },
      {
        name: 'Caydi\'s Creations',
        street1: '400 Boston Post Rd',
        city: 'Orange',
        state: 'CT',
        zip: '06477',
        country: 'US',
        phone: '800-463-3339',
        email: 'admin@caydiscreations.com',
        carrier: 'usps',
      },
    ];
    
    const shipments = await Promise.all(FROM_ADDRESSES.map(async (fromAddress, index) => {
      try {
        console.log(`shipping-rates: Creating shipment ${index + 1} with from address:`, fromAddress);
        
        const shipment = await shippo.shipments.create({
          addressFrom: fromAddress,
          addressTo: toAddress,
          parcels: [parcel as any],
          async: false,
          carrierAccounts: [], // Use default test accounts for all carriers
        });
        
        console.log(`shipping-rates: Shippo shipment ${index + 1} response:`, shipment);
        
        // Check for errors in the response
        if (shipment.messages && shipment.messages.length > 0) {
          console.log(`shipping-rates: Shipment ${index + 1} messages:`, shipment.messages);
          const errorMessage = shipment.messages.find(msg => msg.code === 'ERROR')?.text;
          if (errorMessage) {
            console.error(`shipping-rates: Shipment ${index + 1} error:`, errorMessage);
            return { rates: [], error: errorMessage };
          }
        }
        
        return shipment;
      } catch (err) {
        console.error(`shipping-rates: Shippo shipment ${index + 1} error:`, err);
        if (err.response?.body) {
          console.error(`shipping-rates: Error response body for shipment ${index + 1}:`, err.response.body);
        }
        // Don't throw here, just log the error and continue with other carriers
        return { rates: [], error: err.message };
      }
    }));
    
    console.log('shipping-rates: Shippo shipments:', shipments);
    
    const allRates = shipments.flatMap(s => s.rates || []);
    console.log('shipping-rates: allRates:', allRates);
    
    // Filter out rates with errors and sort by price
    const validRates = allRates
      .filter(rate => !rate.messages || rate.messages.length === 0)
      .sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
    
    console.log('shipping-rates: validRates:', validRates);
    
    // Log information about available carriers
    const availableCarriers = [...new Set(validRates.map(rate => rate.provider))];
    console.log('shipping-rates: Available carriers:', availableCarriers);
    
    // If no valid rates found, provide helpful error message
    if (validRates.length === 0) {
      const errors = shipments
        .filter(s => (s as any).error)
        .map(s => (s as any).error);
      
      console.log('shipping-rates: No valid rates found. Errors:', errors);
      
      return NextResponse.json({ 
        error: 'No shipping rates found for this address',
        details: 'The shipping API is currently unavailable. This may be due to API key issues or service limitations.',
        suggestions: [
          'Please try again later',
          'Contact support if the issue persists',
          'Shipping rates will be calculated at checkout'
        ],
        rates: []
      }, { status: 400 });
    }
    
    return NextResponse.json({ rates: validRates });
  } catch (err) {
    console.error('shipping-rates: error:', err);
    return NextResponse.json({ 
      error: err.message, 
      details: err?.response?.body || err.stack 
    }, { status: 500 });
  }
} 