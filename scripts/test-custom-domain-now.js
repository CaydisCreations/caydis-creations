require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testCustomDomain() {
  try {
    console.log('🧪 Testing custom domain now...');
    
    // Test with custom domain
    console.log('📧 Sending test email with custom domain...');
    const result = await resend.emails.send({
      from: "Caydi's Creations <no-reply@confirmation.caydiscreations.com>",
      to: "caydiscreations@gmail.com",
      subject: "🧪 Test Email with Custom Domain",
      html: "<p>This is a test email using the custom domain.</p>"
    });
    
    console.log('✅ Email sent successfully!');
    console.log('📋 Result:', JSON.stringify(result, null, 2));
    
    // Test customer email
    console.log('\n📧 Testing customer email with custom domain...');
    const customerResult = await resend.emails.send({
      from: "Caydi's Creations <no-reply@confirmation.caydiscreations.com>",
      to: "pearsonrhill2@gmail.com",
      subject: "🧪 Test Customer Email with Custom Domain",
      html: "<p>This is a test customer email using the custom domain.</p>"
    });
    
    console.log('✅ Customer email sent successfully!');
    console.log('📋 Customer result:', JSON.stringify(customerResult, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('🔍 Full error:', error);
  }
}

testCustomDomain(); 