require('dotenv').config({ path: '.env.local' });
const ShipEngine = require('shipengine');

const shipengine = new ShipEngine(process.env.SHIPSTATION_API_KEY);

async function testLabelCreation() {
  try {
    console.log('🧪 Testing Label Creation...\n');

    // First, get a rate
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

    const CARRIER_IDS = [
      'se-3274580', // Stamps.com
      'se-3274584', // UPS
      'se-3274586', // FedEx
      'se-3274585'  // GlobalPost
    ];

    console.log('📦 Getting rates first...');
    const rates = await shipengine.getRatesWithShipmentDetails({
      rateOptions: {
        carrierIds: CARRIER_IDS
      },
      shipment: testShipment
    });

    if (rates.rateResponse?.rates && rates.rateResponse.rates.length > 0) {
      const cheapestRate = rates.rateResponse.rates
        .filter(rate => rate && !rate.errorMessages?.length)
        .sort((a, b) => parseFloat(a.shippingAmount.amount) - parseFloat(b.shippingAmount.amount))[0];

      console.log('✅ Found cheapest rate:', cheapestRate.serviceType, '$' + cheapestRate.shippingAmount.amount);
      console.log('📋 Rate ID:', cheapestRate.rateId);

      // Now try to create a label
      console.log('\n🏷️ Creating label from rate...');
      
      try {
        // Method 1: Try with just rateId
        const label = await shipengine.createLabelFromRate(cheapestRate.rateId, {
          labelLayout: '4x6',
          labelFormat: 'pdf',
          displayScheme: 'label'
        });
        
        console.log('✅ Label created successfully!');
        console.log('📦 Label ID:', label.labelId);
        console.log('📦 Tracking Number:', label.trackingNumber);
        console.log('📦 Carrier:', label.carrierCode);
        console.log('📦 Service:', label.serviceType);
        console.log('💰 Cost:', label.shippingAmount.amount, label.shippingAmount.currency);
        
      } catch (labelError) {
        console.log('❌ Label creation failed:', labelError.message);
        console.log('📊 Error details:', labelError);
      }
      
    } else {
      console.log('❌ No rates found');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('📊 Error details:', error);
  }
}

testLabelCreation();
