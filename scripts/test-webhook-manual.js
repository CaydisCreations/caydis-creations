require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function testWebhookWithRealPurchase() {
  console.log('🧪 Testing webhook with real purchase...\n');

  try {
    // Create a test checkout session with a real product
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Test Product - Real Purchase',
              images: ['https://caydiscreations.s3.us-east-2.amazonaws.com/Public/logoCaydisCreation.PNG'],
            },
            unit_amount: 50, // $0.50
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://caydiscreations.com/success',
      cancel_url: 'https://caydiscreations.com/cancel',
      customer_email: 'pearsonrhill2@gmail.com', // Use your email for testing
      metadata: {
        test: 'real_purchase'
      }
    });

    console.log('✅ Test checkout session created:', session.id);
    console.log('📧 Customer email will be sent to: pearsonrhill2@gmail.com');
    console.log('📧 Admin email will be sent to: caydiscreations@gmail.com');
    console.log('\n⚠️  Note: You need to complete the payment in Stripe to trigger the webhook!');
    console.log('🔗 Payment URL:', session.url);
    console.log('\n📋 Next steps:');
    console.log('1. Click the payment URL above');
    console.log('2. Complete the test payment in Stripe');
    console.log('3. Check Vercel logs for webhook debugging');
    console.log('4. Check your email at caydiscreations@gmail.com');
    console.log('5. Check the test email at pearsonrhill2@gmail.com');

  } catch (error) {
    console.error('❌ Error creating test session:', error.message);
  }
}

testWebhookWithRealPurchase(); 