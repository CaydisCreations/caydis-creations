require('dotenv').config({ path: '.env.local' });
const crypto = require('crypto');

async function testProductionWebhook() {
  console.log('🧪 Testing Production Webhook at caydiscreations.com\n');

  // Create a realistic Stripe webhook payload
  const webhookPayload = {
    id: 'evt_test_production_' + Date.now(),
    object: 'event',
    api_version: '2020-08-27',
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        id: 'cs_test_production_' + Date.now(),
        object: 'checkout.session',
        amount_total: 2500,
        currency: 'usd',
        customer_details: {
          name: 'Test Customer',
          email: 'pearsonrhill2@gmail.com'
        },
        line_items: {
          data: [
            {
              id: 'li_test_production',
              object: 'line_item',
              amount_total: 2500,
              currency: 'usd',
              description: 'Test Product',
              quantity: 1
            }
          ]
        },
        payment_status: 'paid',
        status: 'complete',
        total_details: {
          amount_discount: 0,
          amount_shipping: 0,
          amount_tax: 0
        }
      }
    },
    livemode: false,
    pending_webhooks: 1,
    request: {
      id: 'req_test_production',
      idempotency_key: null
    },
    type: 'checkout.session.completed'
  };

  // Create the signature (simulating Stripe's signature)
  const timestamp = Math.floor(Date.now() / 1000);
  const payload = JSON.stringify(webhookPayload);
  const signedPayload = `${timestamp}.${payload}`;
  const signature = crypto
    .createHmac('sha256', process.env.STRIPE_WEBHOOK_SECRET)
    .update(signedPayload, 'utf8')
    .digest('hex');

  const stripeSignature = `t=${timestamp},v1=${signature}`;

  console.log('📤 Sending webhook to production...');
  console.log('🌐 URL: https://caydiscreations.com/api/stripe-webhook');
  console.log('📧 Customer Email: pearsonrhill2@gmail.com');
  console.log('📧 Admin Email: caydiscreations@gmail.com');
  console.log('💰 Amount: $25.00');
  console.log('🆔 Session ID:', webhookPayload.data.object.id);

  try {
    const response = await fetch('https://caydiscreations.com/api/stripe-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': stripeSignature,
        'User-Agent': 'Stripe/v1 WebhookSimulator'
      },
      body: payload
    });

    console.log('\n📋 Response Status:', response.status);
    console.log('📋 Response Headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('📋 Response Body:', responseText);

    if (response.ok) {
      console.log('\n✅ Production webhook test successful!');
      console.log('📧 Check emails:');
      console.log('   - Customer: pearsonrhill2@gmail.com');
      console.log('   - Admin: caydiscreations@gmail.com');
    } else {
      console.log('\n❌ Production webhook test failed');
      console.log('🔍 Check the response above for error details');
    }

  } catch (error) {
    console.error('❌ Error testing production webhook:', error.message);
  }
}

testProductionWebhook(); 