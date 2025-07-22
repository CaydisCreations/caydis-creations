require('dotenv').config({ path: '.env.local' });
const crypto = require('crypto');

async function testWebhookWithSignature() {
  console.log('🧪 Testing webhook with proper Stripe signature...\n');

  // Mock webhook payload (similar to what Stripe sends)
  const payload = {
    id: 'evt_test_webhook',
    object: 'event',
    api_version: '2025-04-30.basil',
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        id: 'cs_test_webhook_123',
        object: 'checkout.session',
        amount_total: 2500,
        customer_email: 'test@example.com',
        customer_details: {
          name: 'Test Customer',
          email: 'test@example.com',
          address: {
            line1: '123 Test St',
            city: 'Test City',
            state: 'TS',
            postal_code: '12345',
            country: 'US'
          }
        }
      }
    },
    type: 'checkout.session.completed'
  };

  const body = JSON.stringify(payload);
  const timestamp = Math.floor(Date.now() / 1000);
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  // Create signature like Stripe does
  const signedPayload = `${timestamp}.${body}`;
  const signature = crypto
    .createHmac('sha256', webhookSecret)
    .update(signedPayload, 'utf8')
    .digest('hex');

  console.log('📋 Test Details:');
  console.log('   Webhook URL: https://caydiscreations.com/api/stripe-webhook');
  console.log('   Payload size:', body.length, 'bytes');
  console.log('   Timestamp:', timestamp);
  console.log('   Signature:', signature.substring(0, 20) + '...');

  // Make the request
  const https = require('https');
  const postData = body;

  const options = {
    hostname: 'caydiscreations.com',
    port: 443,
    path: '/api/stripe-webhook',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'stripe-signature': `t=${timestamp},v1=${signature}`
    }
  };

  console.log('\n📤 Sending webhook request...');
  
  const req = https.request(options, (res) => {
    console.log('📥 Response Status:', res.statusCode);
    console.log('📥 Response Headers:', res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('📥 Response Body:', data);
      console.log('\n✅ Webhook test completed!');
      console.log('💡 Check your Vercel logs to see the debug output.');
    });
  });

  req.on('error', (e) => {
    console.error('❌ Request error:', e.message);
  });

  req.write(postData);
  req.end();
}

testWebhookWithSignature(); 