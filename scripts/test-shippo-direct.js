require('dotenv').config({ path: '.env.local' });
const { Shippo } = require('shippo');

async function testShippoDirect() {
  console.log('🧪 Testing Shippo API Directly...\n');
  
  const shippo = new Shippo(process.env.SHIPPO_API_KEY);
  
  const testAddress = {
    name: 'Pearson Hill',
    street1: '26 lattanzi st',
    street2: '',
      city: 'MILFORD',
  state: 'CT',
  zip: '06460',
    country: 'US',
    phone: '+12037100568',
    email: 'pearsonrhill2@gmail.com'
  };

  const fromAddress = {
    name: 'Caydi\'s Creations',
    street1: '400 Boston Post Rd',
    city: 'Orange',
    state: 'CT',
    zip: '06477',
    country: 'US',
    phone: '800-463-3339',
    email: 'admin@caydiscreations.com',
  };

  const parcel = {
    length: '10',
    width: '8',
    height: '4',
    distanceUnit: 'in',
    weight: '16',
    massUnit: 'oz',
  };

  try {
    console.log('📦 Creating shipment...');
    console.log('📍 From:', fromAddress);
    console.log('📍 To:', testAddress);
    console.log('📦 Parcel:', parcel);
    
    const shipment = await shippo.shipments.create({
      addressFrom: fromAddress,
      addressTo: testAddress,
      parcels: [parcel],
      async: false,
    });
    
    console.log('✅ Shipment created successfully!');
    console.log('📋 Shipment ID:', shipment.objectId);
    console.log('📋 Rates count:', shipment.rates?.length || 0);
    
    if (shipment.messages && shipment.messages.length > 0) {
      console.log('⚠️ Shipment messages:');
      shipment.messages.forEach((msg, index) => {
        console.log(`  ${index + 1}. ${msg.code}: ${msg.text}`);
      });
    }
    
    if (shipment.rates && shipment.rates.length > 0) {
      console.log('📦 Available rates:');
      shipment.rates.forEach((rate, index) => {
        console.log(`  ${index + 1}. ${rate.provider} ${rate.servicelevel?.name || 'Unknown'} - $${rate.amount}`);
      });
    } else {
      console.log('❌ No rates available');
    }
    
  } catch (error) {
    console.error('❌ Shippo API error:', error);
    if (error.response?.body) {
      console.error('❌ Error response body:', error.response.body);
    }
  }
}

// Run the test
testShippoDirect(); 