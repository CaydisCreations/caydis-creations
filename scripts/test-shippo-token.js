require('dotenv').config({ path: '.env.local' });
const { Shippo } = require('shippo');

async function testShippoToken() {
  console.log('🧪 Testing Current Shippo API Token...\n');
  
  const apiKey = process.env.SHIPPO_API_KEY;
  console.log('🔑 API Key present:', !!apiKey);
  console.log('🔑 API Key starts with:', apiKey?.substring(0, 15) + '...');
  
  if (!apiKey) {
    console.error('❌ No SHIPPO_API_KEY found in .env.local');
    return;
  }
  
  const shippo = new Shippo({ apiKeyHeader: apiKey });
  
  try {
    console.log('📦 Testing API token with a simple shipment...');
    
    const shipment = await shippo.shipments.create({
      addressFrom: {
        name: 'Test Sender',
        street1: '123 Test St',
        city: 'Test City',
        state: 'CA',
        zip: '90210',
        country: 'US',
      },
      addressTo: {
        name: 'Test Receiver',
        street1: '456 Test Ave',
        city: 'Test Town',
        state: 'NY',
        zip: '10001',
        country: 'US',
      },
      parcels: [{
        length: '5',
        width: '5',
        height: '5',
        distanceUnit: 'in',
        weight: '10',
        massUnit: 'oz',
      }],
      async: false,
    });
    
    console.log('✅ API token is valid!');
    console.log('📋 Shipment created:', shipment.objectId);
    console.log('📋 Rates count:', shipment.rates?.length || 0);
    
    if (shipment.rates && shipment.rates.length > 0) {
      console.log('📦 Available rates:');
      shipment.rates.forEach((rate, index) => {
        console.log(`  ${index + 1}. ${rate.provider} - $${rate.amount}`);
      });
    }
    
  } catch (error) {
    console.error('❌ API token test failed:', error.message);
    console.error('❌ Status:', error.statusCode);
    console.error('❌ Body:', error.body);
    
    if (error.message.includes('Token does not exist')) {
      console.log('\n💡 SOLUTION: The API key is invalid or expired');
      console.log('💡 ACTION: Get a new API key from Shippo dashboard');
      console.log('💡 STEPS:');
      console.log('  1. Go to https://app.goshippo.com/');
      console.log('  2. Sign in to your account');
      console.log('  3. Go to Settings → API Keys');
      console.log('  4. Generate a new test API key');
      console.log('  5. Replace the old key in .env.local');
    } else if (error.message.includes('Authentication')) {
      console.log('\n💡 SOLUTION: Authentication failed');
      console.log('💡 ACTION: Check API key format and permissions');
    } else {
      console.log('\n💡 SOLUTION: Unknown error - check Shippo account status');
    }
  }
}

// Run the test
testShippoToken(); 