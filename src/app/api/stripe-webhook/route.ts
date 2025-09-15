import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'

// Rate limiting helper
let lastEmailTime = 0;
const EMAIL_RATE_LIMIT = 1000; // 1 second between emails

async function waitForRateLimit() {
  const now = Date.now();
  const timeSinceLastEmail = now - lastEmailTime;
  if (timeSinceLastEmail < EMAIL_RATE_LIMIT) {
    const waitTime = EMAIL_RATE_LIMIT - timeSinceLastEmail;
    console.log(`⏳ Rate limiting: waiting ${waitTime}ms before next email`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  lastEmailTime = Date.now();
}

export async function POST(req: NextRequest) {
  console.log('🔍 WEBHOOK DEBUG: Request received');
  console.log('🔍 WEBHOOK DEBUG: Headers:', Object.fromEntries(req.headers.entries()));
  
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {})
  const resend = new Resend(process.env.RESEND_API_KEY)
  
  const sig = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  let event

  console.log('🔍 WEBHOOK DEBUG: Signature present:', !!sig);
  console.log('🔍 WEBHOOK DEBUG: Webhook secret present:', !!webhookSecret);

  try {
    const body = await req.text()
    console.log('🔍 WEBHOOK DEBUG: Body length:', body.length);
    console.log('🔍 WEBHOOK DEBUG: Body preview:', body.substring(0, 200));
    
    if (!sig || !webhookSecret) throw new Error('Missing Stripe webhook secret or signature')
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    console.log('🔍 WEBHOOK DEBUG: Event constructed successfully');
  } catch (err: any) {
    console.log('🔍 WEBHOOK DEBUG: Error constructing event:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    console.log('🎉 Webhook received: checkout.session.completed');
    const session = event.data.object as Stripe.Checkout.Session
    console.log('📦 Session details:', {
      id: session.id,
      customer_email: session.customer_email,
      customer_details: session.customer_details,
      amount_total: session.amount_total
    });

    // Update inventory
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
          console.log(`📦 Updating stock for product: ${productId}`);
          const product = await stripe.products.retrieve(productId);
          const currentStock = product.metadata && product.metadata.stock ? Number(product.metadata.stock) : null;
          const currentTotalSold = product.metadata && product.metadata.total_sold ? Number(product.metadata.total_sold) : 0;
          const quantity = item.quantity || 1;
          
          console.log(`📊 Current stock: ${currentStock}, Quantity purchased: ${quantity}`);
          
          if (currentStock !== null && !isNaN(currentStock)) {
            const newStock = Math.max(0, currentStock - quantity);
            const newTotalSold = currentTotalSold + quantity;
            const currentDate = new Date().toISOString();
            
            console.log(`📊 Updating stock from ${currentStock} to ${newStock}`);
            
            const updateResult = await stripe.products.update(productId, {
              metadata: { 
                ...product.metadata, 
                stock: String(newStock),
                total_sold: String(newTotalSold),
                last_purchase_date: currentDate
              }
            });
            
            console.log(`✅ Stock updated successfully for ${product.name}: ${currentStock} → ${newStock}`);
          } else {
            console.log(`⚠️ Product ${productId} has no stock metadata or invalid stock value: ${currentStock}`);
          }
        } catch (err) {
          console.error(`❌ Failed to update stock for product ${productId}:`, err.message);
          console.error(`🔍 Product update error details:`, err);
        }
      } else {
        console.log(`⚠️ No product ID found for line item:`, item);
      }    }

    // Create shipping labels automatically
    try {
      console.log('🚚 Creating shipping labels...');
      
      // Prepare data for shipping label creation
      const lineItemsForLabels = lineItems.data.map(item => ({
        priceId: item.price?.id,
        quantity: item.quantity || 1,
      })).filter(item => item.priceId);

      if (lineItemsForLabels.length > 0) {
        const labelResponse = await fetch(`${req.nextUrl.origin}/api/shipstation-shipping-labels`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: session.id,
            customerDetails: session.customer_details,
            lineItems: lineItemsForLabels,
          }),
        });

        if (labelResponse.ok) {
          const labelData = await labelResponse.json();
          console.log("✅ Shipping labels created successfully:", labelData);
          
          // Store both tracking info and label data for use in emails
          const shipstationLabelData = {
            trackingNumber: labelData.trackingNumber,
            carrier: labelData.carrier,
            service: labelData.service,
            cost: labelData.cost,
            downloadUrl: labelData.downloadUrl,
            labelDownloadPdf: labelData.labelDownloadPdf,
            productName: lineItems.data[0]?.description || "Product"
          };
          
          session.metadata = {
            ...session.metadata,
            tracking_info: JSON.stringify(labelData.tracking || []),
            shipping_labels: JSON.stringify([shipstationLabelData])
          };        } else {
          const labelError = await labelResponse.json();
          console.error('❌ Shipping label creation failed:', labelError);
          
          // Send error notification to admin
          const errorHtml = `
            <div style="font-size:16px; color:#d32f2f; font-family:sans-serif;">
              <h2 style="color:#d32f2f;">⚠️ Shipping Label Creation Failed</h2>
              <p><strong>Order Number:</strong> #${session.id}</p>
              <p><strong>Customer:</strong> ${session.customer_details?.name || 'N/A'}</p>
              <p><strong>Error:</strong> ${labelError.error}</p>
              
              <div style="margin-top: 24px; padding: 12px; background: #fff3cd; border-radius: 8px;">
                <p style="margin: 4px 0;"><strong>Action Required:</strong></p>
                <ul style="margin: 8px 0; padding-left: 20px;">
                  <li>Create shipping labels manually</li>
                  <li>Check Shippo API configuration</li>
                  <li>Verify product metadata</li>
                </ul>
              </div>
            </div>
          `;
          
          await sendEmailWithFallback("caydiscreations@gmail.com", `⚠️ Shipping Label Creation Failed - Order #${session.id}`, errorHtml, "error");
        }
      }

      console.log('📧 Starting email composition...');
      
      // Compose order details
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
        return `<li style="margin-bottom:16px;display:flex;align-items:center;"><img src="${imageUrl}" alt="${productName}" style="max-width:60px;max-height:60px;margin-right:12px;border-radius:8px;object-fit:contain;" /><b>${item.description}</b> — Qty: ${item.quantity} — $${((item.amount_total || 0) / 100).toFixed(2)}</li>`;
      }));

      // Helper function to send email with improved fallback
      async function sendEmailWithFallback(to: string, subject: string, html: string, emailType: string, attachments?: any[]) {
        // Wait for rate limiting
        await waitForRateLimit();
        
        // Try custom domain first (confirmation.caydiscreations.com)
        try {
          console.log(`📤 Sending ${emailType} email to: ${to}`);
          console.log(`📧 ${emailType} email details:`, {
            from: "Caydi's Creations <no-reply@confirmation.caydiscreations.com>",
            to: to,
            subject: subject,
            attachments: attachments ? `${attachments.length} files` : 'none'
          });
          
          const emailData: any = {
            from: "Caydi's Creations <no-reply@confirmation.caydiscreations.com>",
            to: to,
            subject: subject,
            html: html
          };
          
          if (attachments && attachments.length > 0) {
            emailData.attachments = attachments;
          }
          
          const result = await resend.emails.send(emailData);
          
          console.log(`📋 ${emailType} email result:`, JSON.stringify(result, null, 2));
          
          if (result?.data?.id) {
            console.log(`✅ ${emailType} email sent successfully! Email ID:`, result.data.id);
            return true;
          } else {
            console.error(`⚠️ Warning: ${emailType} email sent but no ID returned`);
            console.error(`📋 Full ${emailType} email result:`, result);
            throw new Error('No email ID returned');
          }
        } catch (error: any) {
          console.error(`❌ ${emailType} email failed with custom domain:`, error.message);
          
          // Fallback to verified domain (onboarding@resend.dev) - only for admin emails
          if (to === 'caydiscreations@gmail.com') {
            try {
              console.log(`🔄 Trying fallback for ${emailType} email...`);
              await waitForRateLimit(); // Rate limit for fallback email
              
              const fallbackEmailData: any = {
                from: "Caydi's Creations <onboarding@resend.dev>",
                to: to,
                subject: subject,
                html: html
              };
              
              if (attachments && attachments.length > 0) {
                fallbackEmailData.attachments = attachments;
              }
              
              const fallbackResult = await resend.emails.send(fallbackEmailData);
              
              console.log(`📋 ${emailType} fallback result:`, JSON.stringify(fallbackResult, null, 2));
              
              if (fallbackResult?.data?.id) {
                console.log(`✅ ${emailType} email sent successfully with fallback! Email ID:`, fallbackResult.data.id);
                return true;
              } else {
                console.error(`❌ ${emailType} fallback also failed`);
                return false;
              }
            } catch (fallbackError: any) {
              console.error(`❌ ${emailType} fallback failed:`, fallbackError.message);
              return false;
            }
          } else {
            // For customer emails, send notification to admin instead
            console.log(`📤 Sending customer notification to admin instead...`);
            try {
              await waitForRateLimit(); // Rate limit for notification email
              const notificationResult = await resend.emails.send({
                from: "Caydi's Creations <onboarding@resend.dev>",
                to: "caydiscreations@gmail.com",
                subject: `📧 Customer Email Failed - Manual Contact Needed`,
                html: `
                  <div style="font-size:16px; color:#4A3419; font-family:sans-serif;">
                    <h2 style="color:#d32f2f;">⚠️ Customer Email Failed</h2>
                    <p><strong>Customer Email:</strong> ${to}</p>
                    <p><strong>Customer Name:</strong> ${session.customer_details?.name || 'N/A'}</p>
                    <p><strong>Order Number:</strong> #${session.id}</p>
                    <p><strong>Error:</strong> ${error.message}</p>
                    
                    <div style="margin-top: 24px; padding: 12px; background: #fff3cd; border-radius: 8px;">
                      <p style="margin: 4px 0;"><strong>Action Required:</strong></p>
                      <ul style="margin: 8px 0; padding-left: 20px;">
                        <li>Manually send order confirmation to: ${to}</li>
                        <li>Include order details and tracking information</li>
                        <li>Domain verification issue detected</li>
                      </ul>
                    </div>
                  </div>
                `
              });
              console.log('✅ Customer notification sent to admin! Email ID:', notificationResult?.data?.id);
              return true;
            } catch (notificationError: any) {
              console.error('❌ Customer notification failed:', notificationError.message);
              return false;
            }
          }
        }
      }

      // Send customer email
      const customerEmail = session.customer_details?.email || session.customer_email;
      if (customerEmail) {
        // Get tracking information from session metadata (updated after label creation)
        let trackingInfo = [];
        try {
          if (session.metadata?.tracking_info) {
            trackingInfo = JSON.parse(session.metadata.tracking_info);
            console.log('📦 Tracking info for customer email:', trackingInfo);
          }
        } catch (e) {
          console.log('❌ Error parsing tracking info:', e);
        }

        // Generate tracking section HTML (CUSTOMER ONLY GETS TRACKING NUMBERS)
        let trackingHtml = '';
        
        if (trackingInfo.length > 0) {
          trackingHtml = `
            <div style="margin: 24px 0; padding: 16px; background: #e8f5e8; border-radius: 8px; border-left: 4px solid #4caf50;">
              <h3 style="color:#4A3419; margin: 0 0 12px 0;">📦 Tracking Information</h3>
              ${trackingInfo.map(track => `
                <div style="margin-bottom: 12px; padding: 8px; background: white; border-radius: 4px;">
                  <p style="margin: 4px 0;"><strong>${track.productName}</strong></p>
                  <p style="margin: 4px 0; color: #666;">Carrier: ${track.carrier}</p>
                  ${track.trackingNumber ? `<p style="margin: 4px 0; color: #4caf50;"><strong>Tracking Number:</strong> ${track.trackingNumber}</p>` : ''}
                </div>
              `).join('')}
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
                You'll receive updates as your packages make their way to you!
              </p>
            </div>
          `;
        }

        const customerHtml = `
          <div style="font-size:18px; color:#4A3419; font-family:sans-serif; max-width:600px; margin:0 auto;">
            <div style="text-align:center; margin-bottom:24px;">
              <img src="https://caydiscreations.s3.us-east-2.amazonaws.com/Public/logoCaydisCreation.PNG" alt="Caydi's Creations Logo" style="max-width:120px; width:120px; height:auto; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.08); background:#fff;" />
            </div>
            <p>Hi ${session.customer_details?.name?.split(' ')[0] || 'there'},</p>
            <p>Thank you so much for your order — we're thrilled you chose Caydi's Creations for your handmade crochet item!</p>
            <p>We've received your order and are getting it ready just for you. Each piece is carefully handmade with love, and we can't wait for you to receive yours.</p>
            <div style="margin: 24px 0; padding: 16px; background: #FFF5E6; border-radius: 8px;">
              <b>Here are the details of your order:</b>
              <ul style="margin: 12px 0 0 0; padding: 0; list-style: none;">
                <li><b>Order Number:</b> #${session.id}</li>
                <li><b>Item(s):</b><ul style="margin: 0; padding-left: 16px;">${itemsHtml.join('')}</ul></li>
                <li><b>Total:</b> $${((session.amount_total || 0) / 100).toFixed(2)}</li>
                <li><b>Shipping To:</b> ${session.customer_details?.address?.line1 || ''} ${session.customer_details?.address?.line2 || ''}, ${session.customer_details?.address?.city || ''}, ${session.customer_details?.address?.state || ''} ${session.customer_details?.address?.postal_code || ''}</li>
              </ul>
            </div>
            ${trackingHtml}
            <p>Your packages will be shipped soon. You'll receive tracking updates as your packages make their way to you.</p>
            <p>If you have any questions or just want to say hi, feel free to reply to this email — I'd love to hear from you!</p>
            <p style="margin-top:32px;">
              Warmly,<br/>
              <b>Caydance Hill</b><br/>
              Owner & Maker, Caydi's Creations<br/>
              <a href="https://caydiscreations.com" style="color:#4A3419; text-decoration:underline;">caydiscreations.com</a> | <a href="mailto:caydiscreations@gmail.com" style="color:#4A3419; text-decoration:underline;">caydiscreations@gmail.com</a> | Insta: @caydiscreations
            </p>
          </div>
        `;
        
        await sendEmailWithFallback(customerEmail, "🧶 Thank You for Your Order! Confirmation Inside", customerHtml, "customer");
      } else {
        console.error('❌ No customer email found in session');
      }

      // Send admin notification email
      // Get tracking information from session metadata (updated after label creation)
      let adminTrackingInfo = [];
      let shippingLabels = [];
      try {
        if (session.metadata?.tracking_info) {
          adminTrackingInfo = JSON.parse(session.metadata.tracking_info);
          console.log('📦 Tracking info for admin email:', adminTrackingInfo);
        }
        if (session.metadata?.shipping_labels) {
          shippingLabels = JSON.parse(session.metadata.shipping_labels);
          console.log('📋 Shipping labels for admin email:', shippingLabels);
        }
      } catch (e) {
        console.log('❌ Error parsing tracking/shipping info for admin email:', e);
      }

      // Generate admin tracking section HTML
      let adminTrackingHtml = '';
      if (adminTrackingInfo.length > 0) {
        adminTrackingHtml = `
          <h3 style="color:#4A3419; margin-top:24px;">📦 Tracking Information:</h3>
          <div style="background: #e8f5e8; padding: 12px; border-radius: 8px; margin: 12px 0;">
            ${adminTrackingInfo.map(track => `
              <div style="margin-bottom: 8px; padding: 8px; background: white; border-radius: 4px;">
                <p style="margin: 4px 0;"><strong>${track.productName}</strong></p>
                <p style="margin: 4px 0; color: #666;">Carrier: ${track.carrier}</p>
                ${track.trackingNumber ? `<p style="margin: 4px 0; color: #4caf50;"><strong>Tracking Number:</strong> ${track.trackingNumber}</p>` : ''}
              </div>
            `).join('')}
          </div>
        `;
      }

      // Generate shipping labels section HTML
      let adminShippingLabelsHtml = '';
      let pdfAttachmentNote = '';
      
      if (shippingLabels.length > 0) {
        adminShippingLabelsHtml = `
          <h3 style="color:#4A3419; margin-top:24px;">📋 Shipping Labels:</h3>
          <div style="background: #fff3cd; padding: 12px; border-radius: 8px; margin: 12px 0;">
            <p style="margin: 8px 0; color: #666; font-size: 14px;">
              Shipping labels have been created and are attached below.
            </p>
            ${shippingLabels.map((label, index) => `
              <div style="margin-bottom: 8px; padding: 8px; background: white; border-radius: 4px;">
                <p style="margin: 4px 0;"><strong>${label.productName || "Product"}</strong></p>
                <p style="margin: 4px 0; color: #666;">Carrier: ${label.carrier || "Unknown"}</p>
                <p style="margin: 4px 0; color: #666;">Service: ${label.service || "Standard"}</p>
                <p style="margin: 4px 0; color: #666;">Cost: $${label.cost || "N/A"}</p>
                ${label.trackingNumber ? `<p style="margin: 4px 0; color: #4caf50;"><strong>Tracking Number:</strong> ${label.trackingNumber}</p>` : ""}
                <p style="margin: 4px 0; font-size: 12px; color: #666;">Label #${index + 1} attached as PDF</p>
              </div>
            `).join("")}
          </div>              </div>
            `).join('')}
          </div>
        `;
      }

      const adminHtml = `
        <div style="font-size:16px; color:#4A3419; font-family:sans-serif;">
          <h2 style="color:#4A3419;">🎉 New Order Alert!</h2>
          <p><strong>Order Number:</strong> #${session.id}</p>
          <p><strong>Customer:</strong> ${session.customer_details?.name || 'N/A'}</p>
          <p><strong>Email:</strong> ${session.customer_details?.email || session.customer_email || 'N/A'}</p>
          <p><strong>Phone:</strong> ${session.customer_details?.phone || 'N/A'}</p>
          <p><strong>Total Amount:</strong> $${((session.amount_total || 0) / 100).toFixed(2)}</p>
          
          <h3 style="color:#4A3419; margin-top:24px;">📦 Order Items:</h3>
          <ul style="margin: 12px 0; padding-left: 20px;">
            ${lineItems.data.map(item => 
              `<li><strong>${item.description}</strong> — Qty: ${item.quantity} — $${((item.amount_total || 0) / 100).toFixed(2)}</li>`
            ).join('')}
          </ul>
          
          <h3 style="color:#4A3419; margin-top:24px;">📍 Shipping Address:</h3>
          <div style="background: #FFF5E6; padding: 12px; border-radius: 8px; margin: 12px 0;">
            <p style="margin: 4px 0;">${session.customer_details?.name || 'N/A'}</p>
            <p style="margin: 4px 0;">${session.customer_details?.address?.line1 || 'N/A'}</p>
            ${session.customer_details?.address?.line2 ? `<p style="margin: 4px 0;">${session.customer_details.address.line2}</p>` : ''}
            <p style="margin: 4px 0;">${session.customer_details?.address?.city || 'N/A'}, ${session.customer_details?.address?.state || 'N/A'} ${session.customer_details?.address?.postal_code || 'N/A'}</p>
            <p style="margin: 4px 0;">${session.customer_details?.address?.country || 'N/A'}</p>
          </div>
          
          ${adminTrackingHtml}
          ${adminShippingLabelsHtml}
          
          <p style="color: #4caf50;"><strong>✅ Note:</strong> Shipping labels have been automatically created and tracking numbers are included above.</p>
          ${pdfAttachmentNote}
          
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
            This email was automatically generated when a new order was placed on your website.
        try {
          // Fetch PDF labels from ShipStation URLs
          for (let i = 0; i < shippingLabels.length; i++) {
            const label = shippingLabels[i];
            const labelUrl = label.labelDownloadPdf || label.downloadUrl;
            
            if (labelUrl) {
              try {
                console.log(`📎 Fetching PDF for ${label.productName || "Product"}...`);
                console.log(`📎 PDF URL: ${labelUrl}`);
                
                const pdfResponse = await fetch(labelUrl, {
                  headers: {
                    "Authorization": `Bearer ${process.env.SHIPSTATION_API_KEY}`,
                    "Content-Type": "application/json"
                  }
                });
                
                if (pdfResponse.ok) {
                  const pdfBuffer = await pdfResponse.arrayBuffer();
                  const pdfBase64 = Buffer.from(pdfBuffer).toString("base64");
                  
                  adminAttachments.push({
                    filename: `shipping-label-${(label.productName || "Product").replace(/[^a-zA-Z0-9]/g, "-")}-${i + 1}.pdf`,
                    content: pdfBase64,
                    contentType: "application/pdf"
                  });
                  
                  console.log(`✅ PDF attachment prepared for ${label.productName || "Product"}`);
                } else {
                  console.warn(`⚠️ Failed to fetch PDF for ${label.productName || "Product"}: ${pdfResponse.status} - ${pdfResponse.statusText}`);
                }
              } catch (pdfError) {
                console.error(`❌ Error fetching PDF for ${label.productName || "Product"}:`, pdfError);
              }
            } else {
              console.warn(`⚠️ No PDF URL found for ${label.productName || "Product"}`);
            }
          
          console.log(`📎 Prepared ${adminAttachments.length} PDF attachments`);
          
          // Add note about PDF availability
          if (adminAttachments.length === 0 && shippingLabels.length > 0) {
            pdfAttachmentNote = `
              <div style="margin-top: 16px; padding: 12px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
                <p style="margin: 4px 0; color: #856404;"><strong>📋 Note:</strong> Shipping labels are available for download from the admin dashboard.</p>
                <p style="margin: 4px 0; color: #856404; font-size: 14px;">In test mode, PDF labels may not be automatically attached to emails due to Shippo's test environment limitations.</p>
              </div>
            `;
          }
        } catch (attachmentError) {
          console.error('❌ Error preparing PDF attachments:', attachmentError);
        }
      }
      
      await sendEmailWithFallback("caydiscreations@gmail.com", `🛍️ New Order Received! #${session.id}`, adminHtml, "admin", adminAttachments);

    } catch (err: any) {
      console.error('❌ Email sending failed:', err.message);
      console.error('🔍 Full email error:', err);
    }
  }

  console.log('✅ Webhook processing completed successfully');
  return NextResponse.json({ received: true })
}
