import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {})
const resend = new Resend(process.env.RESEND_API_KEY)

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
    // Retrieve line items
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 })
    console.log('Stripe webhook: checkout.session.completed', { sessionId: session.id, lineItems: lineItems.data });
    // Decrease stock for each product
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
          console.log('[DEBUG] Fetched product:', product);
          const currentStock = product.metadata && product.metadata.stock ? Number(product.metadata.stock) : null;
          console.log(`[DEBUG] Current stock for ${productId}:`, currentStock);
          if (currentStock !== null && !isNaN(currentStock)) {
            const newStock = Math.max(0, currentStock - (item.quantity || 1));
            const updatedProduct = await stripe.products.update(productId, {
              metadata: { ...product.metadata, stock: String(newStock) }
            });
            console.log(`[DEBUG] Updated stock for product ${productId}: ${currentStock} -> ${newStock}`);
            console.log('[DEBUG] Updated product metadata:', updatedProduct.metadata);
          } else {
            console.log(`[DEBUG] No stock metadata for product ${productId}`);
          }
        } catch (err) {
          console.error(`[DEBUG] Error updating stock for product ${productId}:`, err);
        }
      } else {
        console.log('[DEBUG] Could not determine productId for line item', item);
      }
    }
    // Compose order details
    const itemsHtml = lineItems.data.map(item => {
      // Use the product image from metadata if available, otherwise fallback to logo
      let imageUrl = 'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/logoCaydisCreation.PNG';
      if (
        item.price &&
        item.price.product &&
        typeof item.price.product === 'object' &&
        'metadata' in item.price.product &&
        item.price.product.metadata &&
        typeof item.price.product.metadata === 'object' &&
        item.price.product.metadata.image
      ) {
        imageUrl = item.price.product.metadata.image;
      }
      return `<li style=\"margin-bottom:16px;display:flex;align-items:center;\">\n<img src=\"${imageUrl}\" alt=\"${item.description}\" style=\"max-width:60px;max-height:60px;margin-right:12px;border-radius:8px;object-fit:contain;\" />\n<b>${item.description}</b> — Qty: ${item.quantity} — $${((item.amount_total || 0) / 100).toFixed(2)}</li>`;
    }).join('');
    // Send email
    try {
      await resend.emails.send({
        from: "Caydi's Creations <no-reply@confirmations.caydiscreations.com>",
        to: session.customer_details?.email || session.customer_email || 'admin@caydiscreations.com',
        subject: "🧶 Thank You for Your Order! Confirmation Inside",
        html: `
          <div style="display:flex; align-items:center; justify-content:flex-end; min-height:120px; margin-bottom:24px;">
            <img src="https://caydiscreations.s3.us-east-2.amazonaws.com/Public/logoCaydisCreation.PNG" alt="Caydi's Creations Logo" style="max-width:120px; width:120px; height:auto; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.08); background:#fff; margin-top:32px;" />
          </div>
          <div style="font-size:18px; color:#4A3419; font-family:sans-serif;">
            <p>Hi ${session.customer_details?.name?.split(' ')[0] || 'there'},</p>
            <p>Thank you so much for your order — we're thrilled you chose Caydi's Creations for your handmade crochet item!</p>
            <p>We've received your order and are getting it ready just for you. Each piece is carefully handmade with love, and we can't wait for you to receive yours.</p>
            <div style="margin: 24px 0; padding: 16px; background: #FFF5E6; border-radius: 8px;">
              <b>Here are the details of your order:</b>
              <ul style="margin: 12px 0 0 0; padding: 0; list-style: none;">
                <li><b>Order Number:</b> #${session.id}</li>
                <li><b>Item(s):</b><ul style="margin: 0; padding-left: 16px;">${lineItems.data.map(item => `<li>${item.description} — Qty: ${item.quantity} — $${((item.amount_total || 0) / 100).toFixed(2)}</li>`).join('')}</ul></li>
                <li><b>Total:</b> $${((session.amount_total || 0) / 100).toFixed(2)}</li>
                <li><b>Shipping To:</b> ${session.customer_details?.address?.line1 || ''} ${session.customer_details?.address?.line2 || ''}, ${session.customer_details?.address?.city || ''}, ${session.customer_details?.address?.state || ''} ${session.customer_details?.address?.postal_code || ''}, ${session.customer_details?.address?.country || ''}</li>
              </ul>
            </div>
            <p>You'll receive another email with tracking info once your package is on its way.</p>
            <p>If you have any questions or just want to say hi, feel free to reply to this email — I'd love to hear from you!</p>
            <p style="margin-top:32px;">Warmly,<br/>
            <b>Caydance Hill</b><br/>
            Owner & Maker, Caydi's Creations<br/>
            <a href="https://caydiscreations.com" style="color:#4A3419; text-decoration:underline;">caydiscreations.com</a> | <a href="mailto:caydiscreations@gmail.com" style="color:#4A3419; text-decoration:underline;">caydiscreations@gmail.com</a> | Insta: @caydiscreations
            </p>
          </div>
        `
      })
    } catch (err: any) {
      return NextResponse.json({ error: `Email Error: ${err.message}` }, { status: 500 })
    }
  }
  return NextResponse.json({ received: true })
} 