const ShipEngine = require('shipengine');

// You'll need to replace this with your actual ShipStation API key
const shipstation = new ShipEngine(process.env.SHIPSTATION_API_KEY || 'test_key');

async function testShipStation() {
  try {
    console.log('Testing ShipStation API...');
    
    // Test getting carriers
    console.log('\n=== Testing Carrier List ===');
    const carriers = await shipstation.listCarriers();
    console.log('Available carriers:', carriers.map(c => ({ 
      carrierCode: c.carrierCode, 
      friendlyName: c.friendlyName,
      balance: c.balance,
      carrierId: c.carrierId
    })));
    
    // Test creating a shipment with correct format
    console.log('\n=== Testing Shipment Creation ===');
    const shipment = await shipstation.getRatesWithShipmentDetails({
      rateOptions: {
        carrierIds: carriers.map(c => c.carrierId)
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
          phone: '555-123-4567',
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
    
    console.log('Full shipment response:', JSON.stringify(shipment, null, 2));
    
    if (shipment.rates && shipment.rates.length > 0) {
      console.log('Shipment rates:', shipment.rates.map(r => ({
        rateId: r.rateId,
        carrierCode: r.carrierCode,
        serviceType: r.serviceType,
        shippingAmount: r.shippingAmount,
        estimatedDeliveryDays: r.estimatedDeliveryDays
      })));
      
      console.log('\n=== Testing Label Creation (DRY RUN) ===');
      const bestRate = shipment.rates.sort((a, b) => 
        parseFloat(a.shippingAmount.amount) - parseFloat(b.shippingAmount.amount)
      )[0];
      
      console.log('Best rate:', {
        rateId: bestRate.rateId,
        carrierCode: bestRate.carrierCode,
        serviceType: bestRate.serviceType,
        shippingAmount: bestRate.shippingAmount,
        estimatedDeliveryDays: bestRate.estimatedDeliveryDays
      });
      
      console.log('✅ Would create label with rate:', bestRate.rateId);
    } else {
      console.log('No rates returned. Response structure:', Object.keys(shipment));
    }
    
    console.log('\n✅ ShipStation API test completed successfully!');
    console.log('🎉 Your API key is working and you can get shipping rates!');
    
  } catch (error) {
    console.error('❌ ShipStation API test failed:', error);
    
    if (error.message.includes('API key')) {
      console.log('\n💡 Make sure to set your SHIPSTATION_API_KEY environment variable');
      console.log('   Example: export SHIPSTATION_API_KEY=TEST_92iot2fjpcj1aIqZaIzEWVykUGWazlDN8VIvXRK+Jwc');
    }
  }
}

// Run the test
testShipStation();
