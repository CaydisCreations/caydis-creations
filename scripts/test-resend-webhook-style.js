// Simulate the webhook environment
const { Resend } = require('resend');

const resend = new Resend('re_hutNTfXN_GxftHSG8R8x7wCe86bdGnnaZ');

async function testWebhookStyle() {
  try {
    console.log('🧪 Testing webhook-style email sending...');
    
    // Test customer email (exactly like webhook)
    console.log('📤 Sending customer email to: pearsonrhill2@gmail.com');
    try {
      console.log('📧 Customer email details:', {
        from: "Caydi's Creations <no-reply@confirmation.caydiscreations.com>",
        to: "pearsonrhill2@gmail.com",
        subject: "🧶 Thank You for Your Order! Confirmation Inside"
      });
      
      const customerEmailResult = await resend.emails.send({
        from: "Caydi's Creations <no-reply@confirmation.caydiscreations.com>",
        to: "pearsonrhill2@gmail.com",
        subject: "🧶 Thank You for Your Order! Confirmation Inside",
        html: "<p>Test email from webhook-style code</p>"
      });
      
      console.log('📋 Customer email result:', JSON.stringify(customerEmailResult, null, 2));
      console.log('✅ Customer email sent successfully! Email ID:', customerEmailResult?.data?.id);
      
      if (!customerEmailResult?.data?.id) {
        console.error('⚠️ Warning: Customer email sent but no ID returned');
      }
      
    } catch (customerEmailError) {
      console.error('❌ Customer email failed:', customerEmailError.message);
      console.error('🔍 Customer email error details:', customerEmailError);
    }

    // Test admin email (exactly like webhook)
    try {
      console.log('📤 Sending admin email to: caydiscreations@gmail.com');
      console.log('📧 Admin email details:', {
        from: "Caydi's Creations <no-reply@confirmation.caydiscreations.com>",
        to: "caydiscreations@gmail.com",
        subject: "🛍️ New Order Received! #test123"
      });
      
      const adminEmailResult = await resend.emails.send({
        from: "Caydi's Creations <no-reply@confirmation.caydiscreations.com>",
        to: "caydiscreations@gmail.com",
        subject: "🛍️ New Order Received! #test123",
        html: "<p>Test admin email from webhook-style code</p>"
      });
      
      console.log('📋 Admin email result:', JSON.stringify(adminEmailResult, null, 2));
      console.log('✅ Admin email sent successfully! Email ID:', adminEmailResult?.data?.id);
      
      if (!adminEmailResult?.data?.id) {
        console.error('⚠️ Warning: Admin email sent but no ID returned');
      }
      
    } catch (adminEmailError) {
      console.error('❌ Admin email failed:', adminEmailError.message);
      console.error('🔍 Admin email error details:', adminEmailError);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('🔍 Full error:', error);
  }
}

testWebhookStyle(); 