require('dotenv').config({ path: '.env.local' });

async function testWebhookEndpoint() {
  console.log('🔍 Testing webhook endpoint accessibility...\n');

  try {
    // Test if the webhook endpoint is reachable
    const response = await fetch('https://caydiscreations.com/api/stripe-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'test-signature'
      },
      body: JSON.stringify({ test: 'webhook-endpoint-test' })
    });

    console.log('📡 Webhook endpoint response:');
    console.log('  Status:', response.status);
    console.log('  Status Text:', response.statusText);
    
    const responseText = await response.text();
    console.log('  Response:', responseText);

  } catch (error) {
    console.error('❌ Webhook endpoint test failed:', error.message);
  }
}

testWebhookEndpoint(); 