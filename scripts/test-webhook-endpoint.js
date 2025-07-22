require('dotenv').config({ path: '.env.local' });
const https = require('https');

async function testWebhookEndpoint() {
  try {
    console.log('🧪 Testing webhook endpoint directly...');
    
    // Create a mock Stripe event
    const mockEvent = {
      id: 'evt_test_123',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_123456789',
          customer_details: {
            name: 'Pearson Hill',
            email: 'pearsonrhill2@gmail.com',
            address: {
              line1: '26 lattanzi st',
              line2: '',
              city: 'WEST HAVEN',
              state: 'CT',
              postal_code: '06516',
              country: 'US'
            }
          },
          amount_total: 2500
        }
      }
    };

    const postData = JSON.stringify(mockEvent);
    
    const options = {
      hostname: 'caydiscreations.com',
      port: 443,
      path: '/api/stripe-webhook',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'stripe-signature': 'test_signature' // This will fail validation but we can see the response
      }
    };

    const req = https.request(options, (res) => {
      console.log(`📋 Status: ${res.statusCode}`);
      console.log(`📋 Headers:`, res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('📋 Response body:', data);
      });
    });

    req.on('error', (e) => {
      console.error('❌ Error:', e.message);
    });

    req.write(postData);
    req.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testWebhookEndpoint(); 