import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.SHIPPO_API_KEY) {
      throw new Error('SHIPPO_API_KEY environment variable is not set');
    }
    
    const getShippo = (await import('../../../../../lib/shippo-client.cjs')).default;
    const shippo = getShippo(process.env.SHIPPO_API_KEY);
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    const { orderId } = await req.json();
    console.log('recreate-labels: Recreating labels for order:', orderId);
    
    if (!orderId) {
      throw new Error('Missing orderId parameter');
    }

    // Get order details from Stripe
    const session = await stripe.checkout.sessions.retrieve(orderId, {
      expand: ['line_items.data.price.product']
    });

    if (!session) {
      throw new Error('Order not found');
    }

    // Get line items
    const lineItems = await stripe.checkout.sessions.listLineItems(orderId, { limit: 100 });
    
    const shippingLabels = [];
    const trackingInfo = [];

    // Create separate label for each product
    for (const item of lineItems.data) {
      try {
        // Get product details
        let productId = null;
        if (item.price && item.price.product) {
          if (typeof item.price.product === 'string') {
            productId = item.price.product;
          } else if (typeof item.price.product === 'object' && item.price.product.id) {
            productId = item.price.product.id;
          }
        }

        if (!productId) {
          console.warn('recreate-labels: No product ID found for item:', item.description);
          continue;
        }

        const product = await stripe.products.retrieve(productId);
        
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

        const toAddress = {
          name: session.customer_details?.name || 'N/A',
          street1: session.customer_details?.address?.line1 || '',
          street2: session.customer_details?.address?.line2 || '',
          city: session.customer_details?.address?.city || '',
          state: session.customer_details?.address?.state || '',
          zip: session.customer_details?.address?.postal_code || '',
          country: session.customer_details?.address?.country || 'US',
          phone: session.customer_details?.phone || '',
          email: session.customer_details?.email || session.customer_email || '',
        };

        console.log('recreate-labels: Creating label for product:', product.name);
        console.log('recreate-labels: Parcel:', parcel);
        console.log('recreate-labels: To address:', toAddress);

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

        if (transaction.messages && transaction.messages.length > 0) {
          const errorMessage = transaction.messages.find(msg => msg.code === 'ERROR')?.text;
          if (errorMessage) {
            throw new Error(`Shippo transaction error: ${errorMessage}`);
          }
        }

        // Store label info
        const labelInfo = {
          productId: product.id,
          productName: product.name,
          quantity: item.quantity || 1,
          rate: selectedRate,
          labelUrl: transaction.labelUrl,
          trackingNumber: transaction.trackingNumber,
          carrier: selectedRate.provider,
          status: 'created',
          createdAt: new Date().toISOString(),
        };

        shippingLabels.push(labelInfo);
        trackingInfo.push({
          productName: product.name,
          trackingNumber: transaction.trackingNumber,
          carrier: selectedRate.provider,
        });

        console.log('recreate-labels: Label created successfully for:', product.name);
        console.log('recreate-labels: Tracking number:', transaction.trackingNumber);

      } catch (err) {
        console.error('recreate-labels: Error creating label for product:', item.description, err);
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

    console.log('recreate-labels: All labels recreated successfully');
    console.log('recreate-labels: Tracking info:', trackingInfo);

    return NextResponse.json({ 
      success: true, 
      labels: shippingLabels,
      trackingInfo: trackingInfo
    });

  } catch (err) {
    console.error('recreate-labels: error:', err);
    return NextResponse.json({ 
      error: err.message, 
      details: err?.response?.body || err.stack 
    }, { status: 500 });
  }
} 