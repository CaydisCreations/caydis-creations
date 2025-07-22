const { Resend } = require('resend');

const resend = new Resend('re_hutNTfXN_GxftHSG8R8x7wCe86bdGnnaZ');

async function testDefaultDomain() {
  try {
    console.log('🧪 Testing default Resend domain...');
    
    // Test with default domain to your email
    console.log('📧 Sending test email with default domain...');
    const result = await resend.emails.send({
      from: "Caydi's Creations <onboarding@resend.dev>",
      to: "caydiscreations@gmail.com",
      subject: "🧪 Test Email with Default Domain",
      html: "<p>This is a test email using the default Resend domain.</p>"
    });
    
    console.log('✅ Email sent successfully!');
    console.log('📋 Result:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('🔍 Full error:', error);
  }
}

testDefaultDomain(); 