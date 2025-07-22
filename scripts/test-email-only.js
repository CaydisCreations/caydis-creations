require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmailOnly() {
  console.log('🧪 Testing Email Functionality Only\n');

  // Test customer email
  console.log('📧 Testing customer email...');
  try {
    const customerResult = await resend.emails.send({
      from: "Caydi's Creations <no-reply@confirmation.caydiscreations.com>",
      to: "pearsonrhill2@gmail.com",
      subject: "🧶 Test - Production Email System",
      html: `
        <div style="font-size:18px; color:#4A3419; font-family:sans-serif;">
          <h2>🧶 Test Order Confirmation</h2>
          <p>This is a test of the production email system.</p>
          <p><strong>Order ID:</strong> cs_test_production_${Date.now()}</p>
          <p><strong>Customer:</strong> Test Customer</p>
          <p><strong>Amount:</strong> $25.00</p>
          <p>✅ If you receive this, the custom domain is working in production!</p>
        </div>
      `
    });
    console.log('✅ Customer email sent! ID:', customerResult?.data?.id);
  } catch (error) {
    console.error('❌ Customer email failed:', error.message);
  }

  // Wait 1 second for rate limiting
  console.log('⏳ Waiting 1 second for rate limiting...');
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test admin email
  console.log('📧 Testing admin email...');
  try {
    const adminResult = await resend.emails.send({
      from: "Caydi's Creations <no-reply@confirmation.caydiscreations.com>",
      to: "caydiscreations@gmail.com",
      subject: "🛍️ Test - Production Admin Notification",
      html: `
        <div style="font-size:18px; color:#4A3419; font-family:sans-serif;">
          <h2>🛍️ Test Order Notification</h2>
          <p>This is a test of the production admin email system.</p>
          <p><strong>Order ID:</strong> cs_test_production_${Date.now()}</p>
          <p><strong>Customer:</strong> Test Customer (pearsonrhill2@gmail.com)</p>
          <p><strong>Amount:</strong> $25.00</p>
          <p>✅ If you receive this, the custom domain is working in production!</p>
        </div>
      `
    });
    console.log('✅ Admin email sent! ID:', adminResult?.data?.id);
  } catch (error) {
    console.error('❌ Admin email failed:', error.message);
  }

  console.log('\n📧 Email test completed!');
  console.log('📧 Check emails:');
  console.log('   - Customer: pearsonrhill2@gmail.com');
  console.log('   - Admin: caydiscreations@gmail.com');
}

testEmailOnly(); 