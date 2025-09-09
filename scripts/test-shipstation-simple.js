require('dotenv').config({ path: '.env.local' });
const ShipEngine = require('shipengine');

const shipengine = new ShipEngine(process.env.SHIPSTATION_API_KEY);

async function testSimpleShipStation() {
  try {
    console.log('🧪 Testing ShipStation API with simple request...\n');

    // Test 1: List carriers
    console.log('=== Test 1: List Carriers ===');
    const carriers = await shipengine.listCarriers();
    console.log('Available carriers:', carriers.carriers?.length || 0);
    
    if (carriers.carriers && carriers.carriers.length > 0) {
      carriers.carriers.forEach(carrier => {
        console.log(`  - ${carrier.carrierCode}: ${carrier.friendlyName} (Balance: $${carrier.balance || 'N/A'})`);
      });
    } else {
      console.log('❌ No carriers available - this is likely why no rates are returned');
      console.log('💡 You may need to connect carriers in your ShipStation dashboard');
    }

    // Test 2: Try to get rates with a simple request
    console.log('\n=== Test 2: Get Rates ===');
    try {
      const rates = await shipengine.getRatesWithShipmentDetails({
        rateOptions: {
          carrierIds: [] // Get all available carriers
        },
        shipment: {
          validateAddress: 'no_validation',
          shipFrom: {
            name: 'Caydi\'s Creations',
            addressLine1: '400 Boston Post Rd',
            cityLocality: 'Orange',
            stateProvince: 'CT',
            postalCode: '06477',
            countryCode: 'US',
            phone: '800-463-3339',
            email: 'admin@caydiscreations.com',
          },
          shipTo: {
            name: 'Test Customer',
            addressLine1: '123 Main St',
            cityLocality: 'New York',
            stateProvince: 'NY',
            postalCode: '10001',
            countryCode: 'US',
            phone: '123-456-7890',
            email: 'test@example.com',
          },
          packages: [{
            packageCode: 'package',
            weight: {
              value: 8,
              unit: 'ounce'
            }
          }]
        }
      });

      console.log('Rates response:', JSON.stringify(rates, null, 2));
      
      if (rates.rateResponse?.rates && rates.rateResponse.rates.length > 0) {
        console.log('✅ SUCCESS: Found rates!');
        rates.rateResponse.rates.forEach(rate => {
          console.log(`  - ${rate.serviceType}: $${rate.shippingAmount.amount} (${rate.deliveryDays} days)`);
        });
      } else {
        console.log('❌ No rates returned');
      }

    } catch (rateError) {
      console.log('❌ Error getting rates:', rateError.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSimpleShipStation();
