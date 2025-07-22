require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function testFreeOrder() {
  console.log('🆓 Testing free order scenario...\n');

  try {
    // Create a test product
    console.log('📦 Creating test product...');
    const product = await stripe.products.create({
      name: 'Test Free Product',
      description: 'A test product for free order testing',
      images: ['https://caydiscreations.s3.us-east-2.amazonaws.com/Public/logoCaydisCreation.PNG'],
      metadata: {
        stock: '10',
        total_sold: '0'
      }
    });

    // Create a price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 2500, // $25.00
      currency: 'usd',
    });

    // Create a 100% off coupon
    console.log('🎫 Creating 100% off coupon...');
    const coupon = await stripe.coupons.create({
      percent_off: 100,
      duration: 'once',
      name: 'FREE_ORDER_TEST'
    });

    console.log('✅ Coupon created:', coupon.id);

    // Create checkout session with coupon
    console.log('🛍️ Creating checkout session with coupon...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: 'payment',
      discounts: [{ coupon: coupon.id }],
      success_url: 'https://caydiscreations.com/success',
      cancel_url: 'https://caydiscreations.com/cancel',
      customer_email: 'pearsonrhill2@gmail.com',
      metadata: {
        test: 'free_order_test'
      }
    });

    console.log('✅ Checkout session created:', session.id);
    console.log('💰 Final amount will be: $0.00 (due to 100% coupon)');
    console.log('📧 Customer email will be sent to: pearsonrhill2@gmail.com');
    console.log('📧 Admin email will be sent to: caydiscreations@gmail.com');
    console.log('\n🔗 Payment URL:', session.url);
    console.log('\n📋 This will test:');
    console.log('1. Free order processing');
    console.log('2. Webhook with $0.00 amount');
    console.log('3. Email sending for free orders');
    console.log('4. Customer details handling');

    // Clean up info
    console.log('\n🧹 To clean up after testing:');
    console.log(`node scripts/cleanup-test-product.js ${product.id}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testFreeOrder(); 