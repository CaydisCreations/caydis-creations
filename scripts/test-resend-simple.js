const { Resend } = require('resend');

const resend = new Resend('re_hutNTfXN_GxftHSG8R8x7wCe86bdGnnaZ');

async function testResend() {
  try {
    console.log('🧪 Testing Resend API...');
    
    // Test 1: Simple email
    console.log('📧 Sending test email...');
    const result = await resend.emails.send({
      from: "Caydi's Creations <no-reply@confirmation.caydiscreations.com>",
      to: "pearsonrhill2@gmail.com",
      subject: "🧪 Test Email from Resend",
      html: "<p>This is a test email to verify Resend is working.</p>"
    });
    
    console.log('✅ Email sent successfully!');
    console.log('📋 Result:', JSON.stringify(result, null, 2));
    
    // Test 2: Check if domain is verified
    console.log('\n🔍 Checking domain verification...');
    const domains = await resend.domains.list();
    console.log('📋 Domains:', JSON.stringify(domains, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('🔍 Full error:', error);
  }
}

testResend(); 