require('dotenv').config({ path: '.env.local' });

async function testCompleteFlow() {
  console.log('🧪 Testing Complete Order Flow with Tracking Numbers...\n');
  
  // Simulate a completed checkout session
  const mockSession = {
    id: 'cs_test_complete_flow_' + Date.now(),
    customer_details: {
      name: 'Pearson Hill',
      email: 'pearsonrhill2@gmail.com',
      phone: '+12037100568',
      address: {
        line1: '26 lattanzi st',
        line2: '',
        city: 'WEST HAVEN',
        state: 'CT',
        postal_code: '06516',
        country: 'US'
      }
    },
    amount_total: 1000, // $10.00
    metadata: {}
  };

  const mockLineItems = {
    data: [
      {
        description: 'Scrunchie Set 6',
        quantity: 1,
        amount_total: 1000,
        price: {
          id: 'price_test_scrunchies',
          product: 'prod_test_scrunchies'
        }
      }
    ]
  };

  console.log('📦 Step 1: Creating shipping labels...');
  
  try {
    const labelResponse = await fetch('http://localhost:3000/api/shipping-labels', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: mockSession.id,
        customerDetails: mockSession.customer_details,
        lineItems: mockLineItems.data,
      }),
    });

    if (labelResponse.ok) {
      const labelData = await labelResponse.json();
      console.log('✅ Shipping labels created successfully!');
      console.log('📦 Tracking info:', labelData.trackingInfo);
      
      // Update session metadata with tracking info
      mockSession.metadata = {
        ...mockSession.metadata,
        tracking_info: JSON.stringify(labelData.trackingInfo || [])
      };
      
      console.log('📧 Step 2: Testing email templates with tracking info...');
      
      // Test customer email template
      const trackingInfo = JSON.parse(mockSession.metadata.tracking_info);
      console.log('📦 Parsed tracking info for emails:', trackingInfo);
      
      if (trackingInfo.length > 0) {
        console.log('✅ Tracking numbers found:');
        trackingInfo.forEach((track, index) => {
          console.log(`  ${index + 1}. ${track.productName} - ${track.carrier} - ${track.trackingNumber || 'No tracking number'}`);
        });
      } else {
        console.log('❌ No tracking info found');
      }
      
    } else {
      const errorData = await labelResponse.json();
      console.error('❌ Shipping label creation failed:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Error in complete flow test:', error);
  }
}

// Run the test
testCompleteFlow(); 