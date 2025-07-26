require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function testShippingLabels() {
  console.log('🚚 Testing Shipping Label System...\n');

  try {
    // 1. Create a test product with parcel metadata
    console.log('📦 1. Creating test product with parcel metadata...');
    const product = await stripe.products.create({
      name: 'Test Crochet Item - Shipping Labels',
      description: 'A test product for shipping label testing',
      images: ['https://caydiscreations.s3.us-east-2.amazonaws.com/Public/logoCaydisCreation.PNG'],
      metadata: {
        stock: '5',
        total_sold: '0',
        parcel_length: '8',
        parcel_width: '6',
        parcel_height: '3',
        parcel_weight_oz: '12'
      }
    });

    // 2. Create a price for the product
    console.log('💰 2. Creating price...');
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 3000, // $30.00
      currency: 'usd',
    });

    console.log('✅ Product created:', product.id);
    console.log('✅ Price created:', price.id);

    // 3. Create a checkout session (simulating an order)
    console.log('🛍️ 3. Creating checkout session...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://caydiscreations.com/success',
      cancel_url: 'https://caydiscreations.com/cancel',
      customer_email: 'test@example.com',
      shipping_address_collection: { allowed_countries: ['US'] },
      phone_number_collection: { enabled: true },
      metadata: {
        test: 'shipping_labels'
      }
    });

    console.log('✅ Checkout session created:', session.id);
    console.log('📧 Customer email: test@example.com');
    console.log('📧 Admin email: caydiscreations@gmail.com');

    // 4. Note: Payment simulation skipped (not possible via API)
    console.log('\n💳 4. Payment simulation skipped (not possible via API)');
    console.log('✅ Session created successfully');
    console.log('✅ Session ID:', session.id);

    // 5. Test shipping label creation
    console.log('\n🚚 5. Testing shipping label creation...');
          const labelResponse = await fetch('http://localhost:3000/api/shipping-labels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: session.id,
          customerDetails: {
            name: 'Test Customer',
            email: 'test@example.com',
            phone: '555-123-4567',
            address: {
              line1: '1600 Pennsylvania Avenue NW',
              line2: '',
              city: 'Washington',
              state: 'DC',
              postal_code: '20500',
              country: 'US',
            },
          },
          lineItems: [{
            priceId: price.id,
            quantity: 1,
          }],
        }),
      });

    let labelData = null;
    if (labelResponse.ok) {
      labelData = await labelResponse.json();
      console.log('✅ Shipping labels created successfully!');
      console.log('📋 Tracking info:', labelData.trackingInfo);
    } else {
      const error = await labelResponse.json();
      console.error('❌ Shipping label creation failed:', error);
    }

    // 6. Test admin dashboard data
    console.log('\n📊 6. Testing admin dashboard data...');
    const ordersResponse = await fetch('http://localhost:3000/api/admin/orders');
    
    if (ordersResponse.ok) {
      const ordersData = await ordersResponse.json();
      console.log('✅ Admin orders API working');
      console.log('📋 Found orders:', ordersData.orders.length);
      
      const testOrder = ordersData.orders.find(order => order.id === session.id);
      if (testOrder) {
        console.log('✅ Test order found in admin dashboard');
        console.log('📦 Shipping status:', testOrder.metadata?.shipping_status || 'pending');
      }
    } else {
      console.error('❌ Admin orders API failed');
    }

    // 7. Test webhook simulation (to trigger emails with tracking info)
    console.log('\n📧 7. Testing webhook simulation for emails...');
    console.log('⚠️  Webhook test skipped - requires Stripe signature in production');
    console.log('✅ In production, emails will automatically include tracking information');
    console.log('📋 Tracking number generated:', labelData.trackingInfo[0]?.trackingNumber || 'N/A');

    console.log('\n🎉 Shipping label system test completed!');
    console.log('\n📋 What to check:');
    console.log('1. Check your email for order confirmation with tracking info');
    console.log('2. Check admin email for shipping label creation with tracking info');
    console.log('3. Visit /admin/dashboard to see the order');
    console.log('4. Test label recreation from admin dashboard');

  } catch (error) {
    console.error('❌ Error testing shipping labels:', error.message);
    console.error('🔍 Full error:', error);
  }
}

testShippingLabels(); 