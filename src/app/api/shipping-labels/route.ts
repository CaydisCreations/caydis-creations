import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.SHIPPO_API_KEY) {
      throw new Error('SHIPPO_API_KEY environment variable is not set');
    }
    
    const getShippo = (await import('../../../../lib/shippo-client.cjs')).default;
    const shippo = getShippo(process.env.SHIPPO_API_KEY);
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    const { orderId, customerDetails, lineItems } = await req.json();
    console.log('shipping-labels: Creating labels for order:', orderId);
    
    if (!orderId || !customerDetails || !lineItems) {
      throw new Error('Missing required parameters: orderId, customerDetails, lineItems');
    }

    // Get order details from Stripe
    const session = await stripe.checkout.sessions.retrieve(orderId, {
      expand: ['line_items.data.price.product']
    });

    if (!session) {
      throw new Error('Order not found');
    }

    const shippingLabels = [];
    const trackingInfo = [];

    // Create separate label for each product
    for (const item of lineItems) {
      try {
        // Get product details from the price
        let productId = null;
        if (item.priceId) {
          const price = await stripe.prices.retrieve(item.priceId);
          productId = typeof price.product === 'string' ? price.product : price.product.id;
        }
        
        if (!productId) {
          console.warn('shipping-labels: No product ID found for item:', item.priceId);
          continue;
        }
        
        const product = await stripe.products.retrieve(productId);
        
        // Skip shipping line items (they don't need labels)
        if (product.name.toLowerCase().includes('shipping') || 
            product.name.toLowerCase().includes('delivery') ||
            product.name.toLowerCase().includes('postage')) {
          console.log('shipping-labels: Skipping shipping line item:', product.name);
          continue;
        }
        
        // Create parcel from product metadata
        const parcel = {
          length: product.metadata?.parcel_length || '10',
          width: product.metadata?.parcel_width || '8', 
          height: product.metadata?.parcel_height || '4',
          distanceUnit: 'in' as const,
          weight: product.metadata?.parcel_weight_oz || '16',
          massUnit: 'oz' as const,
        };

        // Determine from address based on carrier (default to USPS)
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

        // Clean and validate address
        const cleanStreet1 = customerDetails.address.line1?.trim() || '';
        const cleanCity = customerDetails.address.city?.trim() || '';
        const cleanState = customerDetails.address.state?.trim() || '';
        const cleanZip = customerDetails.address.postal_code?.trim() || '';
        
        // Validate required address fields
        if (!cleanStreet1 || !cleanCity || !cleanState || !cleanZip) {
          console.warn('shipping-labels: Incomplete address for product:', product.name);
          console.warn('shipping-labels: Address:', customerDetails.address);
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

        console.log('shipping-labels: Creating label for product:', product.name);
        console.log('shipping-labels: Parcel:', parcel);
        console.log('shipping-labels: To address:', toAddress);

        // Create shipment
        const shipment = await shippo.shipments.create({
          addressFrom: fromAddress,
          addressTo: toAddress,
          parcels: [parcel],
          async: false,
        });

        if (shipment.messages && shipment.messages.length > 0) {
          const errorMessage = shipment.messages.find(msg => msg.code === 'ERROR')?.text;
          if (errorMessage) {
            throw new Error(`Shippo shipment error: ${errorMessage}`);
          }
        }

        // Get the cheapest rate
        const rates = shipment.rates || [];
        if (rates.length === 0) {
          throw new Error('No shipping rates available for this product');
        }

        const selectedRate = rates.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount))[0];

        // Create transaction (actual label)
        const transaction = await shippo.transactions.create({
          rate: selectedRate.objectId,
          labelFileType: 'PDF',
          async: false,
        });

        // Check for transaction errors
        if (transaction.messages && transaction.messages.length > 0) {
          console.warn('shipping-labels: Transaction messages:', transaction.messages);
          
          // Check for specific error types
          const addressError = transaction.messages.find(msg => msg.code === 'failed_address_validation');
          const invoiceError = transaction.messages.find(msg => msg.code === 'usps_label_expired');
          
          if (addressError) {
            console.warn('shipping-labels: Address validation failed for product:', product.name);
            console.warn('shipping-labels: Address error:', addressError.text);
            continue; // Skip this product but continue with others
          }
          
          if (invoiceError) {
            console.warn('shipping-labels: Invoice expired error for product:', product.name);
            console.warn('shipping-labels: Invoice error:', invoiceError.text);
            // For test mode, we'll continue but log the issue
            console.warn('shipping-labels: This is expected in test mode with expired invoices');
          }
          
          // Only throw for other types of errors
          const otherErrors = transaction.messages.filter(msg => 
            msg.code !== 'failed_address_validation' && 
            msg.code !== 'usps_label_expired' &&
            msg.code !== '121943' // Invalid Date warning (expected in test mode)
          );
          
          if (otherErrors.length > 0) {
            const errorMessage = otherErrors[0]?.text || 'Unknown transaction error';
            throw new Error(`Shippo transaction error: ${errorMessage}`);
          }
        }

        // Store minimal label info for metadata (under 500 chars)
        const labelInfo = {
          p: product.name.substring(0, 20), // Short product name
          t: transaction.trackingNumber,
          c: selectedRate.provider,
          u: transaction.objectId, // Transaction ID for label URL construction
        };

        shippingLabels.push(labelInfo);
        trackingInfo.push({
          productName: product.name,
          trackingNumber: transaction.trackingNumber,
          carrier: selectedRate.provider,
        });

        console.log('shipping-labels: Label created successfully for:', product.name);
        console.log('shipping-labels: Tracking number:', transaction.trackingNumber);

      } catch (err) {
        console.error('shipping-labels: Error creating label for product:', item.priceId, err);
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

    console.log('shipping-labels: All labels created successfully');
    console.log('shipping-labels: Tracking info:', trackingInfo);

    return NextResponse.json({ 
      success: true, 
      labels: shippingLabels,
      trackingInfo: trackingInfo
    });

  } catch (err) {
    console.error('shipping-labels: error:', err);
    return NextResponse.json({ 
      error: err.message, 
      details: err?.response?.body || err.stack 
    }, { status: 500 });
  }
} 