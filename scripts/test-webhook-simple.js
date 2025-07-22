require('dotenv').config({ path: '.env.local' });

async function testWebhookSimple() {
  console.log('🧪 Simple Webhook Test\n');

  // Test 1: Check if endpoint is accessible
  console.log('📡 Testing endpoint accessibility...');
  try {
    const response = await fetch('https://caydiscreations.com/api/stripe-webhook', {
      method: 'GET'
    });
    console.log('✅ Endpoint is accessible');
    console.log('📋 Status:', response.status);
  } catch (error) {
    console.error('❌ Endpoint not accessible:', error.message);
  }

  // Test 2: Check test-webhook-version endpoint
  console.log('\n📡 Testing version endpoint...');
  try {
    const versionResponse = await fetch('https://caydiscreations.com/api/test-webhook-version');
    const versionText = await versionResponse.text();
    console.log('✅ Version endpoint working');
    console.log('📋 Response:', versionText);
  } catch (error) {
    console.error('❌ Version endpoint failed:', error.message);
  }

  // Test 3: Simple POST without signature
  console.log('\n📡 Testing simple POST...');
  try {
    const postResponse = await fetch('https://caydiscreations.com/api/stripe-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ test: true })
    });
    console.log('✅ POST request sent');
    console.log('📋 Status:', postResponse.status);
    const postText = await postResponse.text();
    console.log('📋 Response:', postText);
  } catch (error) {
    console.error('❌ POST request failed:', error.message);
  }
}

testWebhookSimple(); 