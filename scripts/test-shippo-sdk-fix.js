require('dotenv').config({ path: '.env.local' });
const { Shippo } = require('shippo');

async function testShippoSdkFix() {
  console.log('🧪 Testing Different Shippo SDK Initialization Methods...\n');
  
  const apiKey = process.env.SHIPPO_API_KEY;
  console.log('🔑 API Key:', apiKey?.substring(0, 15) + '...');
  
  // Method 1: Direct initialization
  console.log('\n📦 Method 1: Direct initialization');
  try {
    const shippo1 = new Shippo(apiKey);
    const shipment1 = await shippo1.shipments.create({
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
    console.log('✅ Method 1 successful! Rates:', shipment1.rates?.length || 0);
  } catch (error) {
    console.log('❌ Method 1 failed:', error.message);
  }
  
  // Method 2: With apiKeyHeader
  console.log('\n📦 Method 2: With apiKeyHeader');
  try {
    const shippo2 = new Shippo({ apiKeyHeader: apiKey });
    const shipment2 = await shippo2.shipments.create({
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
    console.log('✅ Method 2 successful! Rates:', shipment2.rates?.length || 0);
  } catch (error) {
    console.log('❌ Method 2 failed:', error.message);
  }
  
  // Method 3: With token
  console.log('\n📦 Method 3: With token');
  try {
    const shippo3 = new Shippo({ token: apiKey });
    const shipment3 = await shippo3.shipments.create({
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
    console.log('✅ Method 3 successful! Rates:', shipment3.rates?.length || 0);
  } catch (error) {
    console.log('❌ Method 3 failed:', error.message);
  }
}

// Run the test
testShippoSdkFix(); 