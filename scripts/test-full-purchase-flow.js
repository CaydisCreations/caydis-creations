require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function testFullPurchaseFlow() {
  console.log('🛒 Testing Full Purchase Flow...\n');

  try {
    // 1. Create a test product first
    console.log('📦 Creating test product...');
    const product = await stripe.products.create({
      name: 'Test Crochet Item - Full Flow',
      description: 'A test product for the full purchase flow',
      images: ['https://caydiscreations.s3.us-east-2.amazonaws.com/Public/logoCaydisCreation.PNG'],
      metadata: {
        stock: '10',
        total_sold: '0',
        parcel_length: '6',
        parcel_width: '4',
        parcel_height: '2',
        parcel_weight_oz: '8'
      }
    });

    // 2. Create a price for the product
    console.log('💰 Creating price...');
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 2500, // $25.00
      currency: 'usd',
    });

    console.log('✅ Product created:', product.id);
    console.log('✅ Price created:', price.id);

    // 3. Create a checkout session (simulating the cart)
    console.log('🛍️ Creating checkout session...');
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
      customer_email: 'pearsonrhill2@gmail.com',
      metadata: {
        test: 'full_purchase_flow'
      }
    });

    console.log('✅ Checkout session created:', session.id);
    console.log('📧 Customer email will be sent to: pearsonrhill2@gmail.com');
    console.log('📧 Admin email will be sent to: caydiscreations@gmail.com');
    console.log('\n🔗 Payment URL:', session.url);
    console.log('\n📋 What will happen:');
    console.log('1. Complete the payment in Stripe');
    console.log('2. Webhook will trigger automatically');
    console.log('3. Inventory will be updated (stock reduced)');
    console.log('4. Customer confirmation email sent');
    console.log('5. Admin notification email sent');
    console.log('6. Check both email addresses for confirmations');

    // 4. Clean up function (run this after testing)
    console.log('\n🧹 To clean up after testing, run:');
    console.log(`node scripts/cleanup-test-product.js ${product.id}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testFullPurchaseFlow(); 