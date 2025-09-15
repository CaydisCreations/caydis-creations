import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }

  let event: Stripe.Event;
  
  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('Processing completed checkout session:', session.id);

    try {
      // Get line items
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      
      // Update stock for each item
      for (const item of lineItems.data) {
        if (item.price?.product) {
          const productId = typeof item.price.product === 'string' 
            ? item.price.product 
            : item.price.product.id;
          
          try {
            const product = await stripe.products.retrieve(productId);
            const currentStock = parseInt(product.metadata?.stock || '0');
            const newStock = Math.max(0, currentStock - item.quantity!);
            
            await stripe.products.update(productId, {
              metadata: { ...product.metadata, stock: newStock.toString() }
            });
            
            console.log('Stock updated for product:', product.name, 'Old:', currentStock, 'New:', newStock);
          } catch (err: any) {
            console.error('Error updating stock for product:', productId, err.message);
          }
        }
      }

      // Send admin notification email
      const customerName = session.customer_details?.name || 'N/A';
      const customerEmail = session.customer_details?.email || session.customer_email || 'N/A';
      const totalAmount = '$' + ((session.amount_total || 0) / 100).toFixed(2);
      
      const orderItems = lineItems.data.map(item => 
        '<li><strong>' + item.description + '</strong> - Qty: ' + item.quantity + ' - $' + ((item.amount_total || 0) / 100).toFixed(2) + '</li>'
      ).join('');

      const adminHtml = `
        <div style="font-size:16px; color:#4A3419; font-family:sans-serif;">
          <h2 style="color:#4A3419;">New Order Alert!</h2>
          <p><strong>Order Number:</strong> #${session.id}</p>
          <p><strong>Customer:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
          <p><strong>Total:</strong> ${totalAmount}</p>
          
          <h3 style="color:#4A3419; margin-top:24px;">Order Items:</h3>
          <ul style="margin: 12px 0; padding-left: 20px;">
            ${orderItems}
          </ul>
          
          <h3 style="color:#4A3419; margin-top:24px;">Shipping Address:</h3>
          <div style="background: #FFF5E6; padding: 12px; border-radius: 8px; margin: 12px 0;">
            <p style="margin: 4px 0;">${customerName}</p>
            <p style="margin: 4px 0;">Address details provided in Stripe dashboard</p>
          </div>
          
          <div style="margin-top: 24px; padding: 12px; background: #e8f5e8; border-radius: 8px;">
            <p style="margin: 4px 0;"><strong>Action Required:</strong></p>
            <ul style="margin: 8px 0; padding-left: 20px;">
              <li>Prepare the order items</li>
              <li>Print shipping labels from admin dashboard</li>
              <li>Package and ship the order</li>
              <li>Update inventory if needed</li>
            </ul>
          </div>
          
          <p style="margin-top:24px; font-size:14px; color:#666;">
            This email was automatically generated when a new order was placed.
          </p>
        </div>
      `;

      // Send admin email
      try {
        await resend.emails.send({
          from: 'orders@caydiscreations.com',
          to: 'caydiscreations@gmail.com',
          subject: 'New Order Received! #' + session.id,
          html: adminHtml,
        });
        console.log('Admin notification email sent successfully');
      } catch (emailError: any) {
        console.error('Failed to send admin email:', emailError.message);
      }

      // Send customer confirmation email
      const customerHtml = `
        <div style="font-size:16px; font-family:sans-serif;">
          <h2 style="color:#4A3419;">Thank you for your order!</h2>
          <p>Hi ${customerName},</p>
          <p>Your order has been received and is being processed.</p>
          
          <h3>Order Details:</h3>
          <ul style="margin: 12px 0; padding-left: 20px;">
            <li><b>Order Number:</b> #${session.id}</li>
            <li><b>Total:</b> ${totalAmount}</li>
          </ul>
          
          <p>You will receive tracking information once your order ships.</p>
          <p>Thank you for shopping with Caydis Creations!</p>
        </div>
      `;

      if (customerEmail && customerEmail !== 'N/A') {
        try {
          await resend.emails.send({
            from: 'orders@caydiscreations.com',
            to: customerEmail,
            subject: 'Order Confirmation - Caydis Creations',
            html: customerHtml,
          });
          console.log('Customer confirmation email sent to:', customerEmail);
        } catch (emailError: any) {
          console.error('Failed to send customer email:', emailError.message);
        }
      }

    } catch (err: any) {
      console.error('Error processing webhook:', err.message);
    }
  }

  console.log('Webhook processing completed successfully');
  return NextResponse.json({ received: true });
}
