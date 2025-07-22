require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function checkWebhookConfig() {
  console.log('🔍 Checking webhook configuration...\n');

  try {
    // Check webhook endpoints
    console.log('1. Webhook Endpoints:');
    const webhooks = await stripe.webhookEndpoints.list({ limit: 10 });
    
    if (webhooks.data.length === 0) {
      console.log('❌ No webhook endpoints found!');
      console.log('💡 You need to create a webhook endpoint in your Stripe dashboard.');
      console.log('   Go to: https://dashboard.stripe.com/webhooks');
      console.log('   Add endpoint: https://caydiscreations.com/api/stripe-webhook');
      console.log('   Select event: checkout.session.completed');
      return;
    }

    for (const webhook of webhooks.data) {
      console.log(`   - ${webhook.url} (${webhook.status})`);
      console.log(`     Events: ${webhook.enabled_events.join(', ')}`);
      
      if (webhook.status === 'enabled' && webhook.enabled_events.includes('checkout.session.completed')) {
        console.log(`     ✅ This webhook should receive checkout.session.completed events`);
      } else {
        console.log(`     ⚠️  Missing checkout.session.completed event`);
      }
    }

    // Check recent webhook events
    console.log('\n2. Recent Webhook Events:');
    const events = await stripe.events.list({ 
      limit: 5,
      types: ['checkout.session.completed']
    });

    if (events.data.length === 0) {
      console.log('   No recent checkout.session.completed events found');
    } else {
      console.log(`   Found ${events.data.length} recent checkout.session.completed events:`);
      for (const event of events.data) {
        const session = event.data.object;
        console.log(`   - ${event.id} (${new Date(event.created * 1000).toLocaleString()})`);
        console.log(`     Session: ${session.id}`);
        console.log(`     Customer: ${session.customer_details?.email || 'N/A'}`);
        console.log(`     Amount: $${((session.amount_total || 0) / 100).toFixed(2)}`);
        console.log(`     Status: ${event.delivery_attempts?.[0]?.status || 'Unknown'}`);
      }
    }

    // Check recent checkout sessions
    console.log('\n3. Recent Checkout Sessions:');
    const sessions = await stripe.checkout.sessions.list({ limit: 5 });
    
    if (sessions.data.length === 0) {
      console.log('   No recent checkout sessions found');
    } else {
      console.log(`   Found ${sessions.data.length} recent checkout sessions:`);
      for (const session of sessions.data) {
        console.log(`   - ${session.id} (${session.status})`);
        console.log(`     Customer: ${session.customer_details?.email || 'N/A'}`);
        console.log(`     Amount: $${((session.amount_total || 0) / 100).toFixed(2)}`);
        console.log(`     Created: ${new Date(session.created * 1000).toLocaleString()}`);
      }
    }

    console.log('\n📧 Email Configuration:');
    console.log('   - Customer emails: Sent via Resend to customer email');
    console.log('   - Admin emails: Sent via Resend to caydiscreations@gmail.com');
    console.log('   - Stripe notifications: Enabled in dashboard (basic payment info)');

  } catch (error) {
    console.error('❌ Error checking webhook config:', error.message);
  }
}

checkWebhookConfig(); 