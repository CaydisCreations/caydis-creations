const { Resend } = require('resend');

const resend = new Resend('re_hutNTfXN_GxftHSG8R8x7wCe86bdGnnaZ');

async function testBothEmails() {
  try {
    console.log('🧪 Testing both customer and admin emails with custom domain...');
    
    // Test customer email
    console.log('📧 Sending customer email...');
    const customerResult = await resend.emails.send({
      from: "Caydi's Creations <no-reply@confirmation.caydiscreations.com>",
      to: "pearsonrhill2@gmail.com",
      subject: "🧶 Test Customer Email",
      html: "<p>This is a test customer email using the custom domain.</p>"
    });
    
    console.log('✅ Customer email sent successfully!');
    console.log('📋 Customer result:', JSON.stringify(customerResult, null, 2));
    
    // Test admin email
    console.log('📧 Sending admin email...');
    const adminResult = await resend.emails.send({
      from: "Caydi's Creations <no-reply@confirmation.caydiscreations.com>",
      to: "caydiscreations@gmail.com",
      subject: "🛍️ Test Admin Email",
      html: "<p>This is a test admin email using the custom domain.</p>"
    });
    
    console.log('✅ Admin email sent successfully!');
    console.log('📋 Admin result:', JSON.stringify(adminResult, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('🔍 Full error:', error);
  }
}

testBothEmails(); 