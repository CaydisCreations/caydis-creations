require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function testWebhookDebug() {
  console.log('🔍 Testing webhook debugging...\n');

  try {
    // Get the most recent checkout session
    const sessions = await stripe.checkout.sessions.list({ limit: 1 });
    const latestSession = sessions.data[0];
    
    console.log('📦 Latest checkout session:');
    console.log('  ID:', latestSession.id);
    console.log('  Status:', latestSession.status);
    console.log('  Amount:', latestSession.amount_total);
    console.log('  Customer Email:', latestSession.customer_email);
    console.log('  Customer Details:', latestSession.customer_details);
    
    // Get line items
    const lineItems = await stripe.checkout.sessions.listLineItems(latestSession.id);
    console.log('\n📋 Line Items:');
    lineItems.data.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.description} - Qty: ${item.quantity} - Amount: $${((item.amount_total || 0) / 100).toFixed(2)}`);
    });

    // Check if webhook was triggered
    const events = await stripe.events.list({ 
      type: 'checkout.session.completed',
      limit: 1 
    });
    
    if (events.data.length > 0) {
      const latestEvent = events.data[0];
      console.log('\n🎉 Latest webhook event:');
      console.log('  Event ID:', latestEvent.id);
      console.log('  Session ID:', latestEvent.data.object.id);
      console.log('  Created:', new Date(latestEvent.created * 1000).toLocaleString());
      console.log('  Amount:', latestEvent.data.object.amount_total);
    }

    // Test email sending directly
    console.log('\n📧 Testing direct email sending...');
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const testResult = await resend.emails.send({
      from: "Caydi's Creations <no-reply@confirmation.caydiscreations.com>",
      to: "pearsonrhill2@gmail.com",
      subject: "🧶 Test - Webhook Debug",
      html: `
        <div style="font-size:18px; color:#4A3419; font-family:sans-serif;">
          <h2>🔍 Webhook Debug Test</h2>
          <p>This is a test to verify email sending is working.</p>
          <p>If you receive this, the email system is functional.</p>
          <p>Latest session: ${latestSession.id}</p>
        </div>
      `
    });
    
    console.log('✅ Test email sent! ID:', testResult?.data?.id);

  } catch (error) {
    console.error('❌ Debug test failed:', error.message);
  }
}

testWebhookDebug(); 