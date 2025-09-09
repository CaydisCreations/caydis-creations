import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.EASYPOST_API_KEY) {
      throw new Error('EASYPOST_API_KEY environment variable is not set');
    }
    
    const getEasyPost = (await import('../../../../lib/easypost-client.js')).default;
    const easypost = getEasyPost(process.env.EASYPOST_API_KEY);
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    const { orderId, customerDetails, lineItems } = await req.json();
    console.log('easypost-shipping-labels: Creating labels for order:', orderId);
    console.log('easypost-shipping-labels: Customer details:', customerDetails);
    console.log('easypost-shipping-labels: Line items:', lineItems);

    const shippingLabels = [];
    const trackingInfo = [];

    // Get product details from Stripe
    for (const item of lineItems) {
      try {
        const product = await stripe.products.retrieve(item.priceId);
        console.log('easypost-shipping-labels: Processing product:', product.name);

        // Get parcel dimensions from product metadata
        const parcel = {
          weight: parseFloat(product.metadata?.parcel_weight_oz || '8'),
          length: parseFloat(product.metadata?.parcel_length || '10'),
          width: parseFloat(product.metadata?.parcel_width || '8'),
          height: parseFloat(product.metadata?.parcel_height || '4'),
        };

        // Use the first warehouse address for now
        const fromAddress = {
          name: 'Caydi\'s Creations',
          street1: '400 Boston Post Rd',
          city: 'Orange',
          state: 'CT',
          zip: '06477',
          country: 'US',
          phone: '800-463-3339',
          email: 'admin@caydiscreations.com',
        };

        // Clean and validate customer address
        const cleanStreet1 = customerDetails.address.line1?.trim() || '';
        const cleanCity = customerDetails.address.city?.trim() || '';
        const cleanState = customerDetails.address.state?.trim() || '';
        const cleanZip = customerDetails.address.postal_code?.trim() || '';
        
        // Validate required address fields
        if (!cleanStreet1 || !cleanCity || !cleanState || !cleanZip) {
          console.warn('easypost-shipping-labels: Incomplete address for product:', product.name);
          console.warn('easypost-shipping-labels: Address:', customerDetails.address);
          continue; // Skip this product if address is incomplete
        }

        const toAddress = {
          name: customerDetails.name || 'Customer',
          street1: cleanStreet1,
          street2: customerDetails.address.line2?.trim() || '',
          city: cleanCity,
          state: cleanState,
          zip: cleanZip,
          country: customerDetails.address.country || 'US',
          phone: customerDetails.phone || '',
          email: customerDetails.email || '',
        };

        console.log('easypost-shipping-labels: Creating label for product:', product.name);
        console.log('easypost-shipping-labels: Parcel:', parcel);
        console.log('easypost-shipping-labels: To address:', toAddress);

        // Create shipment
        const shipment = await easypost.Shipment.create({
          from_address: fromAddress,
          to_address: toAddress,
          parcel: parcel,
        });

        // Get the cheapest rate
        const rates = shipment.rates || [];
        if (rates.length === 0) {
          throw new Error('No shipping rates available for this product');
        }

        const selectedRate = rates.sort((a, b) => parseFloat(a.rate) - parseFloat(b.rate))[0];

        // Buy the shipment (create the actual label)
        const boughtShipment = await easypost.Shipment.buy(shipment.id, selectedRate);

        // Store minimal label info for metadata (under 500 chars)
        const labelInfo = {
          p: product.name.substring(0, 20), // Short product name
          t: boughtShipment.tracking_code,
          c: selectedRate.carrier,
          u: boughtShipment.id, // Shipment ID for label URL construction
        };

        shippingLabels.push(labelInfo);
        trackingInfo.push({
          productName: product.name,
          trackingNumber: boughtShipment.tracking_code,
          carrier: selectedRate.carrier,
        });

        console.log('easypost-shipping-labels: Label created successfully for:', product.name);
        console.log('easypost-shipping-labels: Tracking number:', boughtShipment.tracking_code);

      } catch (err) {
        console.error('easypost-shipping-labels: Error creating label for product:', item.priceId, err);
        throw new Error(`Failed to create label for product: ${err.message}`);
      }
    }

    // Update Stripe order metadata with tracking info
    await stripe.checkout.sessions.update(orderId, {
      metadata: {
        shipping_labels: JSON.stringify(shippingLabels),
        tracking_info: JSON.stringify(trackingInfo),
        shipping_status: 'labels_created',
        labels_created_at: new Date().toISOString(),
      }
    });

    console.log('easypost-shipping-labels: All labels created successfully');
    console.log('easypost-shipping-labels: Tracking info:', trackingInfo);

    return NextResponse.json({ 
      success: true, 
      labels: shippingLabels,
      trackingInfo: trackingInfo
    });

  } catch (err) {
    console.error('easypost-shipping-labels: error:', err);
    return NextResponse.json({ 
      error: err.message, 
      details: err?.response?.body || err.stack 
    }, { status: 500 });
  }
} 