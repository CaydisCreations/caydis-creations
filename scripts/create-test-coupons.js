const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createTestCoupons() {
  try {
    console.log('Creating test coupons...\n');

    // 10% off coupon
    const percentCoupon = await stripe.coupons.create({
      id: 'SAVE10',
      percent_off: 10,
      duration: 'once',
      name: 'Save 10%',
      max_redemptions: 100,
    });
    console.log('✅ Created 10% off coupon:', percentCoupon.id);

    // $5 off coupon
    const amountCoupon = await stripe.coupons.create({
      id: 'SAVE5',
      amount_off: 500, // $5.00 in cents
      currency: 'usd',
      duration: 'once',
      name: 'Save $5',
      max_redemptions: 50,
    });
    console.log('✅ Created $5 off coupon:', amountCoupon.id);

    // 20% off coupon (limited time)
    const limitedCoupon = await stripe.coupons.create({
      id: 'SAVE20',
      percent_off: 20,
      duration: 'once',
      name: 'Save 20% - Limited Time',
      redeem_by: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days from now
      max_redemptions: 25,
    });
    console.log('✅ Created 20% off coupon (limited time):', limitedCoupon.id);

    console.log('\n🎉 All test coupons created successfully!');
    console.log('\nTest coupon codes:');
    console.log('- SAVE10 (10% off)');
    console.log('- SAVE5 ($5 off)');
    console.log('- SAVE20 (20% off, expires in 30 days)');

  } catch (error) {
    console.error('❌ Error creating coupons:', error.message);
  }
}

createTestCoupons(); 