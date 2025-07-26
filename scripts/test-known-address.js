const fetch = require('node-fetch');

async function testKnownAddress() {
  console.log('🧪 Testing with Known Good Address...\n');

  const testAddress = {
    name: 'John Doe',
    line1: '123 Main St',
    line2: '',
    city: 'New York',
    state: 'NY',
    postal_code: '10001',
    country: 'US',
    phone: '+1234567890',
    email: 'test@example.com'
  };

  console.log('📍 Test Address:', testAddress);

  try {
    const response = await fetch('http://localhost:3000/api/shipping-rates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: testAddress,
        cartItems: [{
          parcel_length: 10,
          parcel_width: 8,
          parcel_height: 4,
          parcel_weight_oz: 16
        }]
      }),
    });

    const result = await response.json();
    console.log('📋 Response Status:', response.status);
    console.log('📋 Response:', result);

    if (response.ok) {
      console.log('✅ Known address test passed!');
      console.log('📦 Available rates:', result.rates?.length || 0);
      if (result.rates) {
        result.rates.forEach((rate, index) => {
          console.log(`${index + 1}. ${rate.provider} - $${rate.amount}`);
        });
      }
    } else {
      console.log('❌ Known address test failed:');
      console.log('❌ Error:', result.error);
      if (result.details) {
        console.log('❌ Details:', result.details);
      }
    }

  } catch (error) {
    console.error('❌ Error testing known address:', error);
  }
}

// Run the test
testKnownAddress(); 