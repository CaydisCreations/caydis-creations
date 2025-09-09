require('dotenv').config({ path: '.env.local' });
const ShipEngine = require('shipengine');

const shipengine = new ShipEngine(process.env.SHIPSTATION_API_KEY);

async function testSimpleRates() {
  try {
    console.log('🧪 Testing Simple Rate Request...\n');

    const testShipment = {
      validateAddress: 'no_validation', // Disable validation for testing
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
        },
        dimensions: {
          unit: 'inch',
          length: 10,
          width: 8,
          height: 4
        }
      }]
    };

    const CARRIER_IDS = [
      'se-3274580', // Stamps.com
      'se-3274584', // UPS
      'se-3274586', // FedEx
      'se-3274585'  // GlobalPost
    ];

    console.log('📦 Testing with carriers:', CARRIER_IDS);

    const rates = await shipengine.getRatesWithShipmentDetails({
      rateOptions: {
        carrierIds: CARRIER_IDS
      },
      shipment: testShipment
    });

    console.log('✅ Shipment created successfully');
    console.log('📊 Raw response:', JSON.stringify(rates, null, 2));
    
    if (rates.rateResponse?.rates && rates.rateResponse.rates.length > 0) {
      console.log('🎉 SUCCESS: Found rates!');
      rates.rateResponse.rates.forEach(rate => {
        console.log(`  📦 ${rate.serviceType} (${rate.carrierCode}): $${rate.shippingAmount.amount} (${rate.deliveryDays} days)`);
      });
    } else {
      console.log('❌ No rates returned');
      console.log('📊 Rate response:', rates.rateResponse);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('📊 Error details:', error);
  }
}

testSimpleRates();
