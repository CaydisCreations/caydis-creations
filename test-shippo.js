const { Shippo } = require('shippo');

const shippo = new Shippo({ apiKeyHeader: 'shippo_test_ce0b29202bfa631ac0cb0165016071916c03fa4c' });

async function testShippo() {
  try {
    console.log('Testing Shippo API...');
    
    // Check available carrier accounts
    console.log('\n=== Checking Carrier Accounts ===');
    try {
      const carrierAccounts = await shippo.carrierAccounts.list();
      console.log('Available carrier accounts:', carrierAccounts.results?.length || 0);
      if (carrierAccounts.results && carrierAccounts.results.length > 0) {
        carrierAccounts.results.forEach((account, index) => {
          console.log(`${index + 1}. ${account.carrier} - ${account.account_id} (${account.active ? 'Active' : 'Inactive'})`);
        });
      } else {
        console.log('No carrier accounts found');
      }
    } catch (error) {
      console.log('Could not retrieve carrier accounts:', error.message);
    }
    
    // Test with FedEx specifically
    console.log('\n=== Testing FedEx ===');
    const fedexShipment = await shippo.shipments.create({
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
        name: 'Test Customer',
        street1: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'US',
        phone: '555-123-4567',
        email: 'test@example.com',
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
    });
    
    console.log('FedEx shipment created successfully!');
    console.log('FedEx rates:', fedexShipment.rates?.length || 0);
    
    if (fedexShipment.rates && fedexShipment.rates.length > 0) {
      console.log('Available FedEx rates:');
      fedexShipment.rates.forEach((rate, index) => {
        console.log(`${index + 1}. ${rate.provider} ${rate.servicelevel.name}: $${rate.amount}`);
      });
    } else {
      console.log('No FedEx rates available');
    }
    
    // Test with UPS
    console.log('\n=== Testing UPS ===');
    const upsShipment = await shippo.shipments.create({
      addressFrom: {
        name: 'Caydi\'s Creations',
        street1: '167 Cherry St',
        city: 'Milford',
        state: 'CT',
        zip: '06460',
        country: 'US',
        phone: '800-742-5877',
        email: 'admin@caydiscreations.com',
      },
      addressTo: {
        name: 'Test Customer',
        street1: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'US',
        phone: '555-123-4567',
        email: 'test@example.com',
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
    });
    
    console.log('UPS shipment created successfully!');
    console.log('UPS rates:', upsShipment.rates?.length || 0);
    
    if (upsShipment.rates && upsShipment.rates.length > 0) {
      console.log('Available UPS rates:');
      upsShipment.rates.forEach((rate, index) => {
        console.log(`${index + 1}. ${rate.provider} ${rate.servicelevel.name}: $${rate.amount}`);
      });
    }
    
  } catch (error) {
    console.error('Error testing Shippo:', error);
    if (error.response?.body) {
      console.error('Error response:', error.response.body);
    }
  }
}

testShippo(); 