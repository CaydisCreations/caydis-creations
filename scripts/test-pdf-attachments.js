require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');
const { Resend } = require('resend');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

async function testPdfAttachments() {
  try {
    console.log('🔍 Testing PDF attachment functionality...\n');

    // Get recent orders with shipping labels
    const sessions = await stripe.checkout.sessions.list({
      limit: 3,
      status: 'complete'
    });

    console.log(`📦 Found ${sessions.data.length} recent orders\n`);

    for (const session of sessions.data) {
      console.log(`📋 Order: ${session.id}`);
      console.log(`📅 Created: ${new Date(session.created * 1000).toLocaleString()}`);
      
      if (session.metadata?.shipping_labels) {
        try {
          const shippingLabels = JSON.parse(session.metadata.shipping_labels);
          console.log(`📦 Shipping Labels (${shippingLabels.length}):`);
          
          let adminAttachments = [];
          
          for (let i = 0; i < shippingLabels.length; i++) {
            const label = shippingLabels[i];
            console.log(`  Label ${i + 1}:`);
            console.log(`    Product: ${label.p || 'Unknown'}`);
            console.log(`    Carrier: ${label.c || 'Unknown'}`);
            console.log(`    Tracking: ${label.t || 'None'}`);
            console.log(`    Transaction ID: ${label.u || 'None'}`);
            
            if (label.u) {
              const labelUrl = `https://api.goshippo.com/transactions/${label.u}/label.pdf`;
              console.log(`    Label URL: ${labelUrl}`);
              
              try {
                console.log(`    📎 Fetching PDF...`);
                const pdfResponse = await fetch(labelUrl, {
                  headers: {
                    'Authorization': `ShippoToken ${process.env.SHIPPO_API_KEY}`,
                    'Content-Type': 'application/json'
                  }
                });
                
                if (pdfResponse.ok) {
                  const pdfBuffer = await pdfResponse.arrayBuffer();
                  const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');
                  
                  adminAttachments.push({
                    filename: `shipping-label-${(label.p || 'Product').replace(/[^a-zA-Z0-9]/g, '-')}-${i + 1}.pdf`,
                    content: pdfBase64,
                    contentType: 'application/pdf'
                  });
                  
                  console.log(`    ✅ PDF fetched successfully (${pdfBuffer.byteLength} bytes)`);
                } else {
                  console.log(`    ❌ Failed to fetch PDF: ${pdfResponse.status} - ${pdfResponse.statusText}`);
                }
              } catch (pdfError) {
                console.log(`    ❌ Error fetching PDF:`, pdfError.message);
              }
            }
          }
          
          console.log(`\n📎 Total PDF attachments prepared: ${adminAttachments.length}`);
          
          if (adminAttachments.length > 0) {
            console.log('📧 Testing email with PDF attachments...');
            
            const testHtml = `
              <div style="font-size:16px; color:#4A3419; font-family:sans-serif;">
                <h2 style="color:#4A3419;">🧪 PDF Attachment Test</h2>
                <p>This is a test email to verify PDF attachments are working.</p>
                <p><strong>Order:</strong> ${session.id}</p>
                <p><strong>PDFs attached:</strong> ${adminAttachments.length}</p>
              </div>
            `;
            
            try {
              const emailResult = await resend.emails.send({
                from: "Caydi's Creations <onboarding@resend.dev>",
                to: "caydiscreations@gmail.com",
                subject: `🧪 PDF Attachment Test - Order #${session.id}`,
                html: testHtml,
                attachments: adminAttachments
              });
              
              if (emailResult?.data?.id) {
                console.log(`✅ Test email sent successfully! Email ID: ${emailResult.data.id}`);
              } else {
                console.log(`❌ Test email failed:`, emailResult);
              }
            } catch (emailError) {
              console.log(`❌ Test email error:`, emailError.message);
            }
          }
          
        } catch (e) {
          console.log(`❌ Error parsing shipping labels: ${e.message}`);
        }
      } else {
        console.log('❌ No shipping labels found');
      }
      
      console.log('---\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testPdfAttachments(); 