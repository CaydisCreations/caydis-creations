require('dotenv').config({ path: '.env.local' });
const ShipEngine = require('shipengine');

const shipengine = new ShipEngine(process.env.SHIPSTATION_API_KEY);

async function testCarriersDirect() {
  try {
    console.log('🚀 Testing Carriers with Direct IDs...\n');

    // Your carrier IDs from the dashboard
    const carrierIds = [
      'se-3274580', // Stamps.com
      'se-3274584', // UPS
      'se-3274586', // FedEx
      'se-3274585'  // GlobalPost
    ];

    console.log('📋 Testing with your carrier IDs:', carrierIds);

    // Test 1: Check each carrier individually
    console.log('\n=== Test 1: Check Individual Carriers ===');
    for (const carrierId of carrierIds) {
      try {
        const carrier = await shipengine.getCarrierById(carrierId);
        console.log(`✅ ${carrierId}: ${carrier.friendlyName} - Active: ${carrier.active}`);
      } catch (err) {
        console.log(`❌ ${carrierId}: ${err.message}`);
      }
    }

    // Test 2: Get rates using specific carrier IDs
    console.log('\n=== Test 2: Get Rates with Specific Carriers ===');
    const testShipment = {
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
        },
        dimensions: {
          unit: 'inch',
          length: 10,
          width: 8,
          height: 4
        }
      }]
    };

    try {
      const rates = await shipengine.getRatesWithShipmentDetails({
        rateOptions: {
          carrierIds: carrierIds // Use your specific carrier IDs
        },
        shipment: testShipment
      });

      console.log('✅ Shipment created successfully');
      
      if (rates.rateResponse?.rates && rates.rateResponse.rates.length > 0) {
        console.log('🎉 SUCCESS: Found real production rates!');
        rates.rateResponse.rates.forEach(rate => {
          console.log(`  📦 ${rate.serviceType} (${rate.carrierCode}): $${rate.shippingAmount.amount} (${rate.deliveryDays} days)`);
        });
      } else {
        console.log('❌ No rates returned');
      }

    } catch (rateError) {
      console.log('❌ Rate calculation failed:', rateError.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCarriersDirect();
