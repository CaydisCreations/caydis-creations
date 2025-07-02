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
    // Compose order details
    const itemsHtml = lineItems.data.map(item =>
      `<li><b>${item.description}</b> — Qty: ${item.quantity} — $${((item.amount_total || 0) / 100).toFixed(2)}</li>`
    ).join('')
    // Send email
    try {
      await resend.emails.send({
        from: 'Caydi\'s Creations <no-reply@caydiscreations.com>',
        to: session.customer_details?.email || session.customer_email || 'admin@caydiscreations.com',
        subject: 'Your Caydi\'s Creations Order Confirmation',
        html: `
          <h2>Thank you for your purchase!</h2>
          <p>Hi ${session.customer_details?.name || 'there'},</p>
          <p>Your order was successful. Here are your order details:</p>
          <ul>${itemsHtml}</ul>
          <p><b>Total Paid:</b> $${((session.amount_total || 0) / 100).toFixed(2)}</p>
          <p><b>Shipping to:</b><br/>
            ${session.customer_details?.address?.line1 || ''}<br/>
            ${session.customer_details?.address?.line2 || ''}<br/>
            ${session.customer_details?.address?.city || ''}, ${session.customer_details?.address?.state || ''} ${session.customer_details?.address?.postal_code || ''}<br/>
            ${session.customer_details?.address?.country || ''}
          </p>
          <p>If you have any questions, reply to this email or contact us at caydicreations@gmail.com.</p>
          <p>Thank you for supporting handmade!</p>
        `
      })
    } catch (err: any) {
      return NextResponse.json({ error: `Email Error: ${err.message}` }, { status: 500 })
    }
  }
  return NextResponse.json({ received: true })
} 