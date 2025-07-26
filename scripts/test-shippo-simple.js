require('dotenv').config({ path: '.env.local' });
const { Shippo } = require('shippo');

async function testShippoSimple() {
  console.log('🧪 Testing Shippo API with Simple Request...\n');
  
  console.log('🔑 API Key:', process.env.SHIPPO_API_KEY?.substring(0, 15) + '...');
  
  const shippo = new Shippo(process.env.SHIPPO_API_KEY);
  
  try {
    // Try to create a simple shipment with minimal data
    console.log('📦 Creating minimal shipment...');
    
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
    
    console.log('✅ Simple shipment created!');
    console.log('📋 Shipment ID:', shipment.objectId);
    console.log('📋 Rates count:', shipment.rates?.length || 0);
    
    if (shipment.rates && shipment.rates.length > 0) {
      console.log('📦 Available rates:');
      shipment.rates.forEach((rate, index) => {
        console.log(`  ${index + 1}. ${rate.provider} - $${rate.amount}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Shippo API error:', error.message);
    console.error('❌ Status:', error.statusCode);
    console.error('❌ Body:', error.body);
    
    if (error.message.includes('Authentication')) {
      console.log('💡 Authentication failed - API key may be invalid');
    } else if (error.message.includes('401')) {
      console.log('💡 Unauthorized - check API key');
    } else {
      console.log('💡 Other error - check Shippo account status');
    }
  }
}

// Run the test
testShippoSimple(); 