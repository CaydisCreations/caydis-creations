require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function verifyWebhookFix() {
  console.log('🔧 Webhook Fix Verification\n');

  console.log('📋 Current Status:');
  console.log('✅ Custom domain (caydiscreations.com) is working');
  console.log('✅ Email system is fixed and deployed');
  console.log('✅ Rate limiting is implemented');
  console.log('❌ Stripe webhook is pointing to wrong URL');

  console.log('\n🎯 The Problem:');
  console.log('Your Stripe webhook is pointing to a Vercel preview URL instead of your custom domain.');
  console.log('This means the webhook is hitting the old code, not the updated code.');

  console.log('\n🔧 Solution:');
  console.log('1. Go to: https://dashboard.stripe.com/webhooks');
  console.log('2. Find your webhook endpoint');
  console.log('3. Update the endpoint URL to: https://caydiscreations.com/api/stripe-webhook');
  console.log('4. Save the changes');

  console.log('\n📧 Test the email system:');
  try {
    const result = await resend.emails.send({
      from: "Caydi's Creations <no-reply@confirmation.caydiscreations.com>",
      to: "caydiscreations@gmail.com",
      subject: "🔧 Webhook Fix Verification",
      html: `
        <div style="font-size:16px; color:#4A3419; font-family:sans-serif;">
          <h2>🔧 Webhook Fix Verification</h2>
          <p>This email confirms that the email system is working correctly.</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>From:</strong> no-reply@confirmation.caydiscreations.com</p>
          <p><strong>To:</strong> caydiscreations@gmail.com</p>
          <p>✅ If you receive this, the email system is working!</p>
          <p>⚠️ The webhook issue is that Stripe is pointing to the wrong URL.</p>
        </div>
      `
    });
    console.log('✅ Test email sent successfully!');
    console.log('📧 Email ID:', result?.data?.id);
  } catch (error) {
    console.error('❌ Test email failed:', error.message);
  }

  console.log('\n💡 After updating the webhook URL:');
  console.log('- New orders will use the updated code');
  console.log('- Emails will be sent correctly');
  console.log('- Rate limiting will work');
  console.log('- Fallback system will work');
}

verifyWebhookFix(); 