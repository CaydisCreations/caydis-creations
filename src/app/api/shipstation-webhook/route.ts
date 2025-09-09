import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const body = await req.text();
    console.log('shipstation-webhook: Received webhook:', body);
    
    // Parse the webhook data
    const webhookData = JSON.parse(body);
    
    // Handle different webhook types
    if (webhookData.resource_type === 'API_TRACK') {
      const track = webhookData.data;
      console.log('shipstation-webhook: Track updated:', track);
      
      // Find matching order in Stripe
      const sessions = await stripe.checkout.sessions.list({
        limit: 100,
      });
      
      for (const session of sessions.data) {
        if (session.metadata?.tracking_info) {
          try {
            const trackingInfo = JSON.parse(session.metadata.tracking_info);
            const matchingTrack = trackingInfo.find((info: any) => 
              info.trackingNumber === track.tracking_number
            );
            
            if (matchingTrack) {
              console.log('shipstation-webhook: Found matching order:', session.id);
              
              // Update the tracking status in Stripe metadata
              const updatedTrackingInfo = trackingInfo.map((info: any) => {
                if (info.trackingNumber === track.tracking_number) {
                  return {
                    ...info,
                    status: track.status_code || info.status,
                    lastUpdate: new Date().toISOString(),
                  };
                }
                return info;
              });
              
              // Update shipping status based on tracking
              let shippingStatus = session.metadata?.shipping_status || 'labels_created';
              if (track.status_code === 'DE') { // Delivered
                shippingStatus = 'delivered';
              } else if (track.status_code === 'IT') { // In Transit
                shippingStatus = 'shipped';
              }
              
              await stripe.checkout.sessions.update(session.id, {
                metadata: {
                  ...session.metadata,
                  tracking_info: JSON.stringify(updatedTrackingInfo),
                  shipping_status: shippingStatus,
                  last_tracking_update: new Date().toISOString(),
                }
              });
              
              // Send customer notification if package is delivered
              if (track.status_code === 'DE' && track.actual_delivery_date) {
                const customerEmail = session.customer_details?.email || session.customer_email;
                if (customerEmail) {
                  const deliveryHtml = `
                    <div style="font-size:18px; color:#4A3419; font-family:sans-serif; max-width:600px; margin:0 auto;">
                      <div style="text-align:center; margin-bottom:24px;">
                        <img src="https://caydiscreations.s3.us-east-2.amazonaws.com/Public/logoCaydisCreation.PNG" alt="Caydi's Creations Logo" style="max-width:120px; width:120px; height:auto; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.08); background:#fff;" />
                      </div>
                      <p>Hi ${session.customer_details?.name || 'there'},</p>
                      <p>Great news! Your package has been delivered! 🎉</p>
                      <div style="margin: 24px 0; padding: 16px; background: #e8f5e8; border-radius: 8px; border-left: 4px solid #4caf50;">
                        <h3 style="color:#4A3419; margin: 0 0 12px 0;">📦 Delivery Confirmation</h3>
                        <ul style="margin: 0; padding-left: 20px;">
                          <li><b>Tracking Number:</b> ${track.tracking_number}</li>
                          <li><b>Carrier:</b> ${track.carrier_code || 'Unknown'}</li>
                          <li><b>Status:</b> Delivered</li>
                          <li><b>Delivered:</b> ${new Date(track.actual_delivery_date).toLocaleDateString()}</li>
                        </ul>
                      </div>
                      <p>We hope you love your handmade item! If you have any questions or just want to share your experience, feel free to reply to this email.</p>
                      <p style="margin-top:32px;">
                        Warmly,<br/>
                        <b>Caydance Hill</b><br/>
                        Owner & Maker, Caydi's Creations<br/>
                        <a href="https://caydiscreations.com" style="color:#4A3419; text-decoration:underline;">caydiscreations.com</a> | <a href="mailto:caydiscreations@gmail.com" style="color:#4A3419; text-decoration:underline;">caydiscreations@gmail.com</a> | Insta: @caydiscreations
                      </p>
                    </div>
                  `;
                  
                  try {
                    await resend.emails.send({
                      from: "Caydi's Creations <no-reply@confirmation.caydiscreations.com>",
                      to: customerEmail,
                      subject: "🎉 Your Package Has Been Delivered!",
                      html: deliveryHtml
                    });
                    console.log('shipstation-webhook: Delivery notification sent to:', customerEmail);
                  } catch (emailError) {
                    console.error('shipstation-webhook: Failed to send delivery notification:', emailError);
                  }
                }
              }
              
              break; // Found the matching order, no need to continue
            }
          } catch (parseError) {
            console.error('shipstation-webhook: Error parsing tracking info:', parseError);
          }
        }
      }
    }
    
    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('shipstation-webhook: error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
