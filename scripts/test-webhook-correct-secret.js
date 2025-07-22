require('dotenv').config({ path: '.env.local' });
const crypto = require('crypto');

async function testWebhookCorrectSecret() {
  console.log('🔍 Testing with correct webhook secret\n');

  // Use the commented out secret (which looks like the correct format)
  const correctWebhookSecret = 'whsec_563fe8be59eaacd9e8677f639d556c4e095ed53c2b24b397d7685e45db0eb605';
  
  console.log('🔧 Using webhook secret:', correctWebhookSecret.substring(0, 20) + '...');
  console.log('📋 Secret length:', correctWebhookSecret.length);

  // Create a simple webhook payload
  const webhookPayload = {
    id: 'evt_correct_' + Date.now(),
    object: 'event',
    api_version: '2020-08-27',
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        id: 'cs_correct_' + Date.now(),
        object: 'checkout.session',
        amount_total: 2500,
        currency: 'usd',
        customer_details: {
          name: 'Correct Secret Customer',
          email: 'pearsonrhill2@gmail.com'
        },
        payment_status: 'paid',
        status: 'complete'
      }
    },
    livemode: false,
    pending_webhooks: 1,
    request: {
      id: 'req_correct',
      idempotency_key: null
    },
    type: 'checkout.session.completed'
  };

  // Create signature with correct secret
  const timestamp = Math.floor(Date.now() / 1000);
  const payload = JSON.stringify(webhookPayload);
  const signedPayload = `${timestamp}.${payload}`;
  
  const signature = crypto
    .createHmac('sha256', correctWebhookSecret)
    .update(signedPayload, 'utf8')
    .digest('hex');

  const stripeSignature = `t=${timestamp},v1=${signature}`;
  
  console.log('📋 Signature generated:', signature.substring(0, 20) + '...');

  console.log('\n📤 Sending test webhook with correct secret...');
  
  try {
    const response = await fetch('https://caydiscreations.com/api/stripe-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': stripeSignature
      },
      body: payload
    });

    console.log('\n📋 Response Details:');
    console.log('📋 Status:', response.status);
    console.log('📋 Status Text:', response.statusText);

    const responseText = await response.text();
    console.log('📋 Response Body:', responseText);

    if (response.ok) {
      console.log('\n✅ Webhook test successful with correct secret!');
      console.log('📧 Check emails:');
      console.log('   - Customer: pearsonrhill2@gmail.com');
      console.log('   - Admin: caydiscreations@gmail.com');
    } else {
      console.log('\n❌ Webhook test failed even with correct secret');
    }

  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

testWebhookCorrectSecret(); 