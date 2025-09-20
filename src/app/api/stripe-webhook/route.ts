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

      // Create shipping labels automatically
      let labelData = null;
      try {
        console.log('Creating shipping labels for order:', session.id);
        
        const labelResponse = await fetch(`${req.nextUrl.origin}/api/shipstation-shipping-labels`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: session.id,
            customerDetails: session.customer_details,
            lineItems: lineItems.data.map(item => ({
              name: item.description,
              quantity: item.quantity,
              parcel_weight_oz: '8', // Default weight
              parcel_length: '10',
              parcel_width: '8', 
              parcel_height: '4'
            }))
          }),
        });

        if (labelResponse.ok) {
          labelData = await labelResponse.json();
          console.log('Shipping labels created successfully:', labelData);
        } else {
          const labelError = await labelResponse.json();
          console.error('Shipping label creation failed:', labelError);
        }
      } catch (labelError: any) {
        console.error('Error creating shipping labels:', labelError.message);
      }

      // Create admin HTML with label information
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
            <p style="margin: 4px 0;">${session.customer_details?.address?.line1 || ''}</p>
            <p style="margin: 4px 0;">${session.customer_details?.address?.city || ''}, ${session.customer_details?.address?.state || ''} ${session.customer_details?.address?.postal_code || ''}</p>
            <p style="margin: 4px 0;">${session.customer_details?.address?.country || 'US'}</p>
          </div>
          
          ${labelData && labelData.trackingNumber ? `
            <h3 style="color:#4A3419; margin-top:24px;">Shipping Label Created:</h3>
            <div style="background: #e8f5e8; padding: 12px; border-radius: 8px; margin: 12px 0;">
              <p style="margin: 4px 0;"><strong>Tracking Number:</strong> ${labelData.trackingNumber}</p>
              <p style="margin: 4px 0;"><strong>Carrier:</strong> ${labelData.carrier}</p>
              <p style="margin: 4px 0;"><strong>Service:</strong> ${labelData.service}</p>
              <p style="margin: 4px 0;"><strong>Cost:</strong> $${labelData.cost}</p>
              <p style="margin: 4px 0;"><strong>Label ID:</strong> ${labelData.labelId}</p>
              <p style="margin: 8px 0;"><a href="${labelData.downloadUrl}" style="color: #4A3419; text-decoration: underline;">Download Shipping Label PDF</a></p>
            </div>
          ` : `
            <div style="background: #ffe6e6; padding: 12px; border-radius: 8px; margin: 12px 0;">
              <p style="margin: 4px 0; color: #d32f2f;"><strong>Warning:</strong> Shipping label could not be created automatically.</p>
              <p style="margin: 4px 0;">Please create the shipping label manually in the admin dashboard.</p>
            </div>
          `}
          
          <div style="margin-top: 24px; padding: 12px; background: #e8f5e8; border-radius: 8px;">
            <p style="margin: 4px 0;"><strong>Action Required:</strong></p>
            <ul style="margin: 8px 0; padding-left: 20px;">
              <li>Prepare the order items</li>
              ${labelData && labelData.downloadUrl ? '<li>Print the shipping label (link provided above)</li>' : '<li>Create shipping label in admin dashboard</li>'}
              <li>Package and ship the order</li>
              <li>Update inventory if needed</li>
            </ul>
          </div>
          
          <p style="margin-top:24px; font-size:14px; color:#666;">
            This email was automatically generated when a new order was placed.
          </p>
        </div>
      `;

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
          
          ${labelData && labelData.trackingNumber ? `
            <h3>Tracking Information:</h3>
            <p><b>Tracking Number:</b> ${labelData.trackingNumber}</p>
            <p><b>Carrier:</b> ${labelData.carrier}</p>
            <p>You can track your package using the tracking number above.</p>
          ` : `
            <p>You will receive tracking information once your order ships.</p>
          `}
          
          <p>Thank you for shopping with Caydis Creations!</p>
              </div>
            `;

      if (customerEmail && customerEmail !== 'N/A') {
        try {
          await resend.emails.send({
            from: 'Caydis Creations <orders@caydiscreations.com>',
            to: customerEmail,
            subject: 'Order Confirmation - Caydis Creations',
            html: customerHtml,
            replyTo: 'caydiscreations@gmail.com',
          });
          console.log('Customer confirmation email sent to:', customerEmail);
        } catch (emailError: any) {
          console.error('Failed to send customer email:', emailError.message);
        }
      }

      // Send admin email (after label creation)
      try {
        await resend.emails.send({
          from: 'Caydis Creations <orders@caydiscreations.com>',
          to: 'caydiscreations@gmail.com',
          subject: 'New Order Received! #' + session.id,
          html: adminHtml,
          replyTo: 'caydiscreations@gmail.com',
        });
        console.log('Admin notification email sent successfully');
      } catch (emailError: any) {
        console.error('Failed to send admin email:', emailError.message);
      }

    } catch (err: any) {
      console.error('Error processing webhook:', err.message);
    }
  }

  console.log('Webhook processing completed successfully');
  return NextResponse.json({ received: true });
}
