const { Resend } = require('resend');

const resend = new Resend('re_hutNTfXN_GxftHSG8R8x7wCe86bdGnnaZ');

async function testWebhookEmails() {
  try {
    console.log('🧪 Testing webhook email sending...');
    
    // Mock session data like the webhook receives
    const mockSession = {
      id: 'cs_test_123456789',
      customer_details: {
        name: 'Pearson Hill',
        email: 'pearsonrhill2@gmail.com',
        address: {
          line1: '26 lattanzi st',
          line2: '',
          city: 'WEST HAVEN',
          state: 'CT',
          postal_code: '06516',
          country: 'US'
        }
      },
      amount_total: 2500 // $25.00
    };

    // Mock line items
    const mockLineItems = {
      data: [
        {
          description: 'Test Product',
          quantity: 1,
          amount_total: 2500
        }
      ]
    };

    // Compose order details (exactly like webhook)
    const itemsHtml = await Promise.all(mockLineItems.data.map(async item => {
      let imageUrl = 'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/logoCaydisCreation.PNG';
      let productName = item.description;
      return `<li style="margin-bottom:16px;display:flex;align-items:center;"><img src="${imageUrl}" alt="${productName}" style="max-width:60px;max-height:60px;margin-right:12px;border-radius:8px;object-fit:contain;" /><b>${item.description}</b> — Qty: ${item.quantity} — $${((item.amount_total || 0) / 100).toFixed(2)}</li>`;
    }));

    // Send customer email (exactly like webhook)
    const customerEmail = mockSession.customer_details?.email;
    if (customerEmail) {
      console.log('📤 Sending customer email to:', customerEmail);
      try {
        const customerEmailResult = await resend.emails.send({
          from: "Caydi's Creations <no-reply@confirmation.caydiscreations.com>",
          to: customerEmail,
          subject: "🧶 Thank You for Your Order! Confirmation Inside",
          html: `
            <div style="font-size:18px; color:#4A3419; font-family:sans-serif; max-width:600px; margin:0 auto;">
              <div style="text-align:center; margin-bottom:24px;">
                <img src="https://caydiscreations.s3.us-east-2.amazonaws.com/Public/logoCaydisCreation.PNG" alt="Caydi's Creations Logo" style="max-width:120px; width:120px; height:auto; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.08); background:#fff;" />
              </div>
              <p>Hi ${mockSession.customer_details?.name?.split(' ')[0] || 'there'},</p>
              <p>Thank you so much for your order — we're thrilled you chose Caydi's Creations for your handmade crochet item!</p>
              <p>We've received your order and are getting it ready just for you. Each piece is carefully handmade with love, and we can't wait for you to receive yours.</p>
              <div style="margin: 24px 0; padding: 16px; background: #FFF5E6; border-radius: 8px;">
                <b>Here are the details of your order:</b>
                <ul style="margin: 12px 0 0 0; padding: 0; list-style: none;">
                  <li><b>Order Number:</b> #${mockSession.id}</li>
                  <li><b>Item(s):</b><ul style="margin: 0; padding-left: 16px;">${itemsHtml.join('')}</ul></li>
                  <li><b>Total:</b> $${((mockSession.amount_total || 0) / 100).toFixed(2)}</li>
                  <li><b>Shipping To:</b> ${mockSession.customer_details?.address?.line1 || ''} ${mockSession.customer_details?.address?.line2 || ''}, ${mockSession.customer_details?.address?.city || ''}, ${mockSession.customer_details?.address?.state || ''} ${mockSession.customer_details?.address?.postal_code || ''}</li>
                </ul>
              </div>
              <p>You'll receive another email with tracking info once your package is on its way.</p>
              <p>If you have any questions or just want to say hi, feel free to reply to this email — I'd love to hear from you!</p>
              <p style="margin-top:32px;">
                Warmly,<br/>
                <b>Caydance Hill</b><br/>
                Owner & Maker, Caydi's Creations<br/>
                <a href="https://caydiscreations.com" style="color:#4A3419; text-decoration:underline;">caydiscreations.com</a> | <a href="mailto:caydiscreations@gmail.com" style="color:#4A3419; text-decoration:underline;">caydiscreations@gmail.com</a> | Insta: @caydiscreations
              </p>
            </div>
          `
        });
        console.log('✅ Customer email sent successfully! Email ID:', customerEmailResult?.data?.id);
        console.log('📋 Full result:', JSON.stringify(customerEmailResult, null, 2));
      } catch (customerEmailError) {
        console.error('❌ Customer email failed:', customerEmailError.message);
        console.error('🔍 Full error:', customerEmailError);
      }
    }

    // Send admin email (exactly like webhook)
    try {
      console.log('📤 Sending admin email to: caydiscreations@gmail.com');
      const adminEmailResult = await resend.emails.send({
        from: "Caydi's Creations <no-reply@confirmation.caydiscreations.com>",
        to: "caydiscreations@gmail.com",
        subject: `🛍️ New Order Received! #${mockSession.id}`,
        html: `
          <div style="font-size:16px; color:#4A3419; font-family:sans-serif;">
            <h2 style="color:#4A3419;">🎉 New Order Alert!</h2>
            <p><strong>Order Number:</strong> #${mockSession.id}</p>
            <p><strong>Customer:</strong> ${mockSession.customer_details?.name || 'N/A'}</p>
            <p><strong>Email:</strong> ${mockSession.customer_details?.email || 'N/A'}</p>
            <p><strong>Total Amount:</strong> $${((mockSession.amount_total || 0) / 100).toFixed(2)}</p>
            
            <h3 style="color:#4A3419; margin-top:24px;">📦 Order Items:</h3>
            <ul style="margin: 12px 0; padding-left: 20px;">
              ${mockLineItems.data.map(item => 
                `<li><strong>${item.description}</strong> — Qty: ${item.quantity} — $${((item.amount_total || 0) / 100).toFixed(2)}</li>`
              ).join('')}
            </ul>
            
            <p style="color: #d32f2f;"><strong>⚠️ Note:</strong> Shipping labels are currently disabled. Please create shipping labels manually.</p>
          </div>
        `
      });
      console.log('✅ Admin email sent successfully! Email ID:', adminEmailResult?.data?.id);
      console.log('📋 Full result:', JSON.stringify(adminEmailResult, null, 2));
    } catch (adminEmailError) {
      console.error('❌ Admin email failed:', adminEmailError.message);
      console.error('🔍 Full error:', adminEmailError);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('🔍 Full error:', error);
  }
}

testWebhookEmails(); 