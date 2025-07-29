require('dotenv').config({ path: '.env.local' });
const { Shippo } = require('shippo');

async function testShippoDateFix() {
  console.log('🧪 Testing Shippo Date Fix...\n');
  
  const apiKey = process.env.SHIPPO_API_KEY;
  console.log('🔑 API Key:', apiKey?.substring(0, 15) + '...');
  
  const shippo = new Shippo({ apiKeyHeader: apiKey });
  
  try {
    console.log('📦 Creating shipment with valid date...');
    
    const shipment = await shippo.shipments.create({
      addressFrom: {
        name: 'Caydi\'s Creations',
        street1: '400 Boston Post Rd',
        city: 'Orange',
        state: 'CT',
        zip: '06477',
        country: 'US',
        phone: '800-463-3339',
        email: 'admin@caydiscreations.com',
      },
      addressTo: {
        name: 'Pearson Hill',
        street1: '26 lattanzi st',
          city: 'MILFORD',
  state: 'CT',
  zip: '06460',
        country: 'US',
        phone: '+12037100568',
        email: 'pearsonrhill2@gmail.com',
      },
      parcels: [{
        length: '10',
        width: '8',
        height: '4',
        distanceUnit: 'in',
        weight: '16',
        massUnit: 'oz',
      }],
      async: false,
      shipmentDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    });
    
    console.log('✅ Shipment created successfully!');
    console.log('📋 Shipment ID:', shipment.objectId);
    console.log('📋 Rates count:', shipment.rates?.length || 0);
    
    if (shipment.rates && shipment.rates.length > 0) {
      console.log('📦 Available rates:');
      shipment.rates.forEach((rate, index) => {
        console.log(`  ${index + 1}. ${rate.provider} ${rate.servicelevel?.name || 'Unknown'} - $${rate.amount}`);
      });
      
      console.log('\n📦 Creating transaction (label)...');
      
      // Get the cheapest rate
      const selectedRate = shipment.rates.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount))[0];
      console.log('📋 Selected rate:', selectedRate.provider, selectedRate.servicelevel?.name, `$${selectedRate.amount}`);
      
      const transaction = await shippo.transactions.create({
        rate: selectedRate.objectId,
        labelFileType: 'PDF',
        async: false,
      });
      
      console.log('✅ Transaction created successfully!');
      console.log('📋 Transaction ID:', transaction.objectId);
      console.log('📋 Tracking Number:', transaction.trackingNumber);
      console.log('📋 Label URL:', transaction.labelUrl);
      
      if (transaction.messages && transaction.messages.length > 0) {
        console.log('⚠️ Transaction messages:');
        transaction.messages.forEach((msg, index) => {
          console.log(`  ${index + 1}. ${msg.code}: ${msg.text}`);
        });
      }
      
    } else {
      console.log('❌ No rates available for transaction creation');
    }
    
  } catch (error) {
    console.error('❌ Date fix test failed:', error.message);
    console.error('❌ Status:', error.statusCode);
    console.error('❌ Body:', error.body);
  }
}

// Run the test
testShippoDateFix(); 