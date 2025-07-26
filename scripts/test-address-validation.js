const fetch = require('node-fetch');

async function testAddressValidation() {
  console.log('🧪 Testing Address Validation...\n');

  const testAddress = {
    name: 'Pearson Hill',
    line1: '26 lattanzi st',
    line2: '',
    city: 'WEST HAVEN',
    state: 'CT',
    postal_code: '06516',
    country: 'US',
    phone: '+12037100568',
    email: 'pearsonrhill2@gmail.com'
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
      console.log('✅ Address validation passed!');
      console.log('📦 Available rates:', result.rates?.length || 0);
      if (result.rates) {
        result.rates.forEach((rate, index) => {
          console.log(`${index + 1}. ${rate.provider} - $${rate.amount}`);
        });
      }
    } else {
      console.log('❌ Address validation failed:');
      console.log('❌ Error:', result.error);
      if (result.details) {
        console.log('❌ Details:', result.details);
      }
      if (result.suggestions) {
        console.log('💡 Suggestions:', result.suggestions);
      }
    }

  } catch (error) {
    console.error('❌ Error testing address validation:', error);
  }
}

// Run the test
testAddressValidation(); 