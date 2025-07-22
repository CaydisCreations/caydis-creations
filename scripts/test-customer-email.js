require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testCustomerEmail() {
  console.log('🧪 Testing customer email specifically...\n');

  try {
    console.log('📤 Sending test customer email to: pearsonrhill2@gmail.com');
    
    const result = await resend.emails.send({
      from: "Caydi's Creations <no-reply@confirmation.caydiscreations.com>",
      to: "pearsonrhill2@gmail.com",
      subject: "🧶 Test Customer Email - Order Confirmation",
      html: `
        <div style="font-size:18px; color:#4A3419; font-family:sans-serif;">
          <h2>🧶 Test Customer Email</h2>
          <p>Hi there,</p>
          <p>This is a test customer email to verify the email system is working.</p>
          <p>If you receive this, the customer email system is working!</p>
          <p style="margin-top:32px;">
            Warmly,<br/>
            <b>Caydance Hill</b><br/>
            Owner & Maker, Caydi's Creations
          </p>
        </div>
      `
    });

    console.log('✅ Customer email sent successfully!');
    console.log('📧 Email ID:', result.id);
    console.log('📧 Check pearsonrhill2@gmail.com for the test email');

  } catch (error) {
    console.error('❌ Failed to send customer email:', error.message);
    console.error('🔍 Full error:', error);
  }
}

testCustomerEmail(); 