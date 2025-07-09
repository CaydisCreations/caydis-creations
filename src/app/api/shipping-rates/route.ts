import { NextRequest, NextResponse } from 'next/server';

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
    
    const shipments = await Promise.all(FROM_ADDRESSES.map(async (fromAddress) => {
      try {
        console.log('shipping-rates: Creating shipment with from address:', fromAddress);
        
        const shipment = await shippo.shipments.create({
          addressFrom: fromAddress,
          addressTo: toAddress,
          parcels: [parcel as any],
          async: false,
          carrierAccounts: [], // Use default test accounts for all carriers
        });
        
        console.log('shipping-rates: Shippo shipment response:', shipment);
        
        // Check for errors in the response
        if (shipment.messages && shipment.messages.length > 0) {
          const errorMessage = shipment.messages.find(msg => msg.code === 'ERROR')?.text;
          if (errorMessage) {
            throw new Error(`Shippo error: ${errorMessage}`);
          }
        }
        
        return shipment;
      } catch (err) {
        console.error('shipping-rates: Shippo shipment error:', err);
        if (err.response?.body) {
          console.error('shipping-rates: Error response body:', err.response.body);
        }
        // Don't throw here, just log the error and continue with other carriers
        return { rates: [] };
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
    
    return NextResponse.json({ rates: validRates });
  } catch (err) {
    console.error('shipping-rates: error:', err);
    return NextResponse.json({ 
      error: err.message, 
      details: err?.response?.body || err.stack 
    }, { status: 500 });
  }
} 