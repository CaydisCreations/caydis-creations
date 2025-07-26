require('dotenv').config({ path: '.env.local' });

async function testShippoManual() {
  console.log('🧪 Testing Shippo API with Manual HTTP Request...\n');
  
  const apiKey = process.env.SHIPPO_API_KEY;
  console.log('🔑 API Key:', apiKey?.substring(0, 15) + '...');
  
  const shipmentData = {
    address_from: {
      name: 'Test Sender',
      street1: '123 Test St',
      city: 'Test City',
      state: 'CA',
      zip: '90210',
      country: 'US',
    },
    address_to: {
      name: 'Test Receiver',
      street1: '456 Test Ave',
      city: 'Test Town',
      state: 'NY',
      zip: '10001',
      country: 'US',
    },
    parcels: [{
      length: '5',
      width: '5',
      height: '5',
      distance_unit: 'in',
      weight: '10',
      mass_unit: 'oz',
    }],
    async: false,
  };
  
  try {
    console.log('📦 Making manual HTTP request to Shippo...');
    
    const response = await fetch('https://api.goshippo.com/shipments/', {
      method: 'POST',
      headers: {
        'Authorization': `ShippoToken ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shipmentData),
    });
    
    console.log('📋 Response Status:', response.status);
    console.log('📋 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📋 Response Body:', responseText);
    
    if (response.ok) {
      const data = JSON.parse(responseText);
      console.log('✅ Manual request successful!');
      console.log('📋 Shipment ID:', data.object_id);
      console.log('📋 Rates count:', data.rates?.length || 0);
    } else {
      console.log('❌ Manual request failed');
    }
    
  } catch (error) {
    console.error('❌ Manual request error:', error);
  }
}

// Run the test
testShippoManual(); 