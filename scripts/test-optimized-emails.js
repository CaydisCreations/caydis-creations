require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testOptimizedEmails() {
  console.log('🚀 Testing optimized email system...\n');

  try {
    // Test customer email
    console.log('📤 Sending optimized customer email...');
    const customerResult = await resend.emails.send({
      from: "Caydi's Creations <no-reply@confirmation.caydiscreations.com>",
      to: "pearsonrhill2@gmail.com",
      subject: "🧶 Test - Optimized Customer Email",
      html: `
        <div style="font-size:18px; color:#4A3419; font-family:sans-serif; max-width:600px; margin:0 auto;">
          <div style="text-align:center; margin-bottom:24px;">
            <img src="https://caydiscreations.s3.us-east-2.amazonaws.com/Public/logoCaydisCreation.PNG" alt="Caydi's Creations Logo" style="max-width:120px; width:120px; height:auto; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.08); background:#fff;" />
          </div>
          <p>Hi there,</p>
          <p>This is a test of the optimized email system!</p>
          <p>If you receive this quickly, the optimization worked!</p>
          <p style="margin-top:32px;">
            Warmly,<br/>
            <b>Caydance Hill</b><br/>
            Owner & Maker, Caydi's Creations
          </p>
        </div>
      `
    });
    console.log('✅ Customer email sent! ID:', customerResult?.data?.id);

    // Test admin email
    console.log('📤 Sending optimized admin email...');
    const adminResult = await resend.emails.send({
      from: "Caydi's Creations <no-reply@confirmation.caydiscreations.com>",
      to: "caydiscreations@gmail.com",
      subject: "🛍️ Test - Optimized Admin Email",
      html: `
        <div style="font-size:16px; color:#4A3419; font-family:sans-serif;">
          <h2 style="color:#4A3419;">🎉 Test Admin Email</h2>
          <p>This is a test of the optimized admin email system!</p>
          <p>If you receive this quickly, the optimization worked!</p>
        </div>
      `
    });
    console.log('✅ Admin email sent! ID:', adminResult?.data?.id);

    console.log('\n📧 Check both emails:');
    console.log('  - Customer: pearsonrhill2@gmail.com');
    console.log('  - Admin: caydiscreations@gmail.com');

  } catch (error) {
    console.error('❌ Email test failed:', error.message);
  }
}

testOptimizedEmails(); 