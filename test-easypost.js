const EasyPost = require('@easypost/api');

// You'll need to replace this with your actual EasyPost API key
const easypost = new EasyPost(process.env.EASYPOST_API_KEY || 'test_key');

async function testEasyPost() {
  try {
    console.log('Testing EasyPost API...');
    
    // Test creating a shipment
    console.log('\n=== Testing Shipment Creation ===');
    const shipment = await easypost.Shipment.create({
      from_address: {
        name: 'Caydi\'s Creations',
        street1: '400 Boston Post Rd',
        city: 'Orange',
        state: 'CT',
        zip: '06477',
        country: 'US',
        phone: '800-463-3339',
        email: 'admin@caydiscreations.com',
      },
      to_address: {
        name: 'Test Customer',
        street1: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'US',
        phone: '555-123-4567',
        email: 'test@example.com',
      },
      parcel: {
        weight: 16,
        length: 10,
        width: 8,
        height: 4,
      },
    });
    
    console.log('✅ Shipment created successfully!');
    console.log('📦 Shipment ID:', shipment.id);
    console.log('📊 Available rates:', shipment.rates?.length || 0);
    
    if (shipment.rates && shipment.rates.length > 0) {
      console.log('\n📋 Available shipping rates:');
      shipment.rates.forEach((rate, index) => {
        console.log(`${index + 1}. ${rate.carrier} ${rate.service}: $${rate.rate}`);
      });
      
      // Test buying the cheapest rate
      console.log('\n=== Testing Label Purchase ===');
      const cheapestRate = shipment.rates.sort((a, b) => parseFloat(a.rate) - parseFloat(b.rate))[0];
      console.log(`💰 Buying cheapest rate: ${cheapestRate.carrier} ${cheapestRate.service} for $${cheapestRate.rate}`);
      
      const boughtShipment = await easypost.Shipment.buy(shipment.id, cheapestRate);
      
      console.log('✅ Label purchased successfully!');
      console.log('📋 Tracking number:', boughtShipment.tracking_code);
      console.log('📦 Carrier:', boughtShipment.selected_rate.carrier);
      console.log('🏷️ Label URL:', boughtShipment.postage_label?.label_url || 'Not available');
      
    } else {
      console.log('❌ No shipping rates available');
    }
    
  } catch (error) {
    console.error('❌ Error testing EasyPost:', error);
    if (error.message) {
      console.error('Error message:', error.message);
    }
  }
}

// Only run if API key is provided
if (process.env.EASYPOST_API_KEY) {
  testEasyPost();
} else {
  console.log('⚠️  EASYPOST_API_KEY not found in environment variables');
  console.log('💡 Set your EasyPost API key to test the integration:');
  console.log('   export EASYPOST_API_KEY=your_api_key_here');
  console.log('   or add it to your .env.local file');
} 