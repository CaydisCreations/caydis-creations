require('dotenv').config({ path: '.env.local' });

async function testShipStationRates() {
  try {
    console.log('🧪 Testing ShipStation shipping rates API...\n');

    const testAddress = {
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '123-456-7890',
      line1: 'lattanzi street',
      line2: '',
      city: 'west haven',
      state: 'ct',
      postal_code: '06516',
      country: 'US'
    };

    const testCartItems = [
      {
        priceId: 'test_price_id',
        name: 'Scrunchie Set 8',
        quantity: 1,
        parcel_weight_oz: '8',
        parcel_length: '10',
        parcel_width: '8',
        parcel_height: '4'
      }
    ];

    console.log('📦 Test address:', testAddress);
    console.log('🛒 Test cart items:', testCartItems);

    const response = await fetch('http://localhost:3000/api/shipstation-shipping-rates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: testAddress, cartItems: testCartItems })
    });

    const data = await response.json();
    
    console.log('\n📊 Response status:', response.status);
    console.log('📊 Response data:', JSON.stringify(data, null, 2));

    if (data.rates && data.rates.length > 0) {
      console.log('\n✅ SUCCESS: Found shipping rates!');
      data.rates.forEach((rate, index) => {
        console.log(`   ${index + 1}. ${rate.servicelevel.name}: $${rate.amount} (${rate.delivery_days} days)`);
      });
    } else {
      console.log('\n❌ FAILED: No shipping rates found');
      if (data.error) {
        console.log('   Error:', data.error);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testShipStationRates();
