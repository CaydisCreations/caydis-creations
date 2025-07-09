import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'
// Shippo CommonJS import/initialization
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Shippo } = require('shippo');
const shippo = new Shippo({ apiKeyHeader: process.env.SHIPPO_API_KEY });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {})
const resend = new Resend(process.env.RESEND_API_KEY)

// Define from addresses for each carrier
const FROM_ADDRESSES = {
  fedex: {
    name: 'Caydi\'s Creations',
    street1: '400 Boston Post Rd',
    city: 'Orange',
    state: 'CT',
    zip: '06477',
    country: 'US',
    phone: '800-463-3339',
    email: 'admin@caydiscreations.com',
  },
  ups: {
    name: 'Caydi\'s Creations',
    street1: '355 Campbell Ave',
    city: 'West Haven',
    state: 'CT',
    zip: '06516',
    country: 'US',
    phone: '800-742-5877',
    email: 'admin@caydiscreations.com',
  },
  usps: {
    name: 'Caydi\'s Creations',
    street1: '400 Boston Post Rd',
    city: 'Orange',
    state: 'CT',
    zip: '06477',
    country: 'US',
    phone: '800-463-3339',
    email: 'admin@caydiscreations.com',
  },
};

async function createShippoLabel({ toAddress, parcel, orderId }) {
  // Get rates from all three carriers
  const shipments = await Promise.all([
    shippo.shipments.create({
      addressFrom: FROM_ADDRESSES.fedex,
      addressTo: toAddress,
      parcels: [parcel],
      async: false,
      carrierAccounts: [], // Use default test accounts
    }),
    shippo.shipments.create({
      addressFrom: FROM_ADDRESSES.ups,
      addressTo: toAddress,
      parcels: [parcel],
      async: false,
      carrierAccounts: [],
    }),
    shippo.shipments.create({
      addressFrom: FROM_ADDRESSES.usps,
      addressTo: toAddress,
      parcels: [parcel],
      async: false,
      carrierAccounts: [],
    }),
  ]);
  // Collect all rates
  const allRates = shipments.flatMap(s => s.rates || []);
  if (!allRates.length) throw new Error('No shipping rates found');
  // Find the cheapest
  const cheapest = allRates.reduce((min, r) => (parseFloat(r.amount) < parseFloat(min.amount) ? r : min), allRates[0]);
  // Buy the label
  const transaction = await shippo.transactions.create({ rate: cheapest.object_id, label_file_type: 'PDF', async: false });
  if (transaction.status !== 'SUCCESS') throw new Error('Failed to purchase shipping label');
  return { labelUrl: transaction.label_url, trackingNumber: transaction.tracking_number, carrier: cheapest.provider, amount: cheapest.amount };
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  let event

  try {
    const body = await req.text()
    if (!sig || !webhookSecret) throw new Error('Missing Stripe webhook secret or signature')
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 })
    for (const item of lineItems.data) {
      let productId = null;
      if (item.price && item.price.product) {
        if (typeof item.price.product === 'string') {
          productId = item.price.product;
        } else if (typeof item.price.product === 'object' && item.price.product.id) {
          productId = item.price.product.id;
        }
      }
      if (productId) {
        try {
          const product = await stripe.products.retrieve(productId);
          const currentStock = product.metadata && product.metadata.stock ? Number(product.metadata.stock) : null;
          const currentTotalSold = product.metadata && product.metadata.total_sold ? Number(product.metadata.total_sold) : 0;
          const quantity = item.quantity || 1;
          if (currentStock !== null && !isNaN(currentStock)) {
            const newStock = Math.max(0, currentStock - quantity);
            const newTotalSold = currentTotalSold + quantity;
            const currentDate = new Date().toISOString();
            await stripe.products.update(productId, {
              metadata: { 
                ...product.metadata, 
                stock: String(newStock),
                total_sold: String(newTotalSold),
                last_purchase_date: currentDate
              }
            });
          }
        } catch (err) {
          // Silently fail for product update errors
        }
      }
    }
    let labelInfo = null;
    try {
      const shipping = session.customer_details?.address;
      if (shipping) {
        // Use the first product for parcel info (or loop for multi-item orders)
        const firstItem = lineItems.data[0];
        let productId = null;
        if (firstItem.price && firstItem.price.product) {
          productId = typeof firstItem.price.product === 'string' ? firstItem.price.product : firstItem.price.product.id;
        }
        if (productId) {
          const product = await stripe.products.retrieve(productId);
          const parcel = {
            length: product.metadata?.parcel_length?.toString(),
            width: product.metadata?.parcel_width?.toString(),
            height: product.metadata?.parcel_height?.toString(),
            distanceUnit: 'in',
            weight: product.metadata?.parcel_weight_oz?.toString(),
            massUnit: 'oz',
          };
          // Build toAddress from shipping
          const toAddress = {
            name: session.customer_details?.name || '',
            street1: shipping.line1,
            street2: shipping.line2,
            city: shipping.city,
            state: shipping.state,
            zip: shipping.postal_code,
            country: shipping.country,
            phone: session.customer_details?.phone || '',
            email: session.customer_details?.email || session.customer_email || '',
          };
          // Create label
          labelInfo = await createShippoLabel({ toAddress, parcel, orderId: session.id });
          console.log('Shippo label created:', labelInfo);
        }
      }
    } catch (err) {
      console.error('Shippo error:', err);
    }
    try {
      // Compose order details with correct product images
      const itemsHtml = await Promise.all(lineItems.data.map(async item => {
        let imageUrl = 'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/logoCaydisCreation.PNG';
        let productName = item.description;
        if (item.price && item.price.product) {
          let productId = typeof item.price.product === 'string' ? item.price.product : item.price.product.id;
          try {
            const product = await stripe.products.retrieve(productId);
            if (product.images && product.images.length > 0) {
              imageUrl = product.images[0];
            } else if (product.metadata && product.metadata.image) {
              imageUrl = product.metadata.image;
            }
            productName = product.name;
          } catch {}
        }
        return `<li style=\"margin-bottom:16px;display:flex;align-items:center;\">\n<img src=\"${imageUrl}\" alt=\"${productName}\" style=\"max-width:60px;max-height:60px;margin-right:12px;border-radius:8px;object-fit:contain;\" />\n<b>${item.description}</b> — Qty: ${item.quantity} — $${((item.amount_total || 0) / 100).toFixed(2)}</li>`;
      }));
      await resend.emails.send({
        from: "Caydi's Creations <no-reply@confirmations.caydiscreations.com>",
        to: session.customer_details?.email || session.customer_email || 'admin@caydiscreations.com',
        subject: "🧶 Thank You for Your Order! Confirmation Inside",
        html: `
          <div style=\"display:flex; align-items:center; justify-content:flex-end; min-height:120px; margin-bottom:24px;\">\n            <img src=\"https://caydiscreations.s3.us-east-2.amazonaws.com/Public/logoCaydisCreation.PNG\" alt=\"Caydi's Creations Logo\" style=\"max-width:120px; width:120px; height:auto; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.08); background:#fff; margin-top:32px;\" />\n          </div>\n          <div style=\"font-size:18px; color:#4A3419; font-family:sans-serif;\">\n            <p>Hi ${session.customer_details?.name?.split(' ')[0] || 'there'},</p>\n            <p>Thank you so much for your order — we're thrilled you chose Caydi's Creations for your handmade crochet item!</p>\n            <p>We've received your order and are getting it ready just for you. Each piece is carefully handmade with love, and we can't wait for you to receive yours.</p>\n            <div style=\"margin: 24px 0; padding: 16px; background: #FFF5E6; border-radius: 8px;\">\n              <b>Here are the details of your order:</b>\n              <ul style=\"margin: 12px 0 0 0; padding: 0; list-style: none;\">\n                <li><b>Order Number:</b> #${session.id}</li>\n                <li><b>Item(s):</b><ul style=\"margin: 0; padding-left: 16px;\">${itemsHtml.join('')}</ul></li>\n                <li><b>Total:</b> $${((session.amount_total || 0) / 100).toFixed(2)}</li>\n                <li><b>Shipping To:</b> ${session.customer_details?.address?.line1 || ''} ${session.customer_details?.address?.line2 || ''}, ${session.customer_details?.address?.city || ''}, ${session.customer_details?.address?.state || ''} ${session.customer_details?.address?.postal_code || ''}</li>
                ${labelInfo ? `<li><b>Tracking Number:</b> ${labelInfo.trackingNumber}</li>` : ''}
              </ul>\n            </div>\n            <p>You'll receive another email with tracking info once your package is on its way.</p>\n            <p>If you have any questions or just want to say hi, feel free to reply to this email — I'd love to hear from you!</p>\n            <p style=\"margin-top:32px;\">Warmly,<br/>\n            <b>Caydance Hill</b><br/>\n            Owner & Maker, Caydi's Creations<br/>\n            <a href=\"https://caydiscreations.com\" style=\"color:#4A3419; text-decoration:underline;\">caydiscreations.com</a> | <a href=\"mailto:caydiscreations@gmail.com\" style=\"color:#4A3419; text-decoration:underline;\">caydiscreations@gmail.com</a> | Insta: @caydiscreations\n            </p>\n          </div>\n        `
      })
    } catch (err: any) {
      return NextResponse.json({ error: `Email Error: ${err.message}` }, { status: 500 })
    }
  }
  return NextResponse.json({ received: true })
} 