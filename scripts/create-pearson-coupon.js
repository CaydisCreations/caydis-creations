const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createPearsonCoupon() {
  try {
    console.log('Creating Pearson coupon...\n');

    // Create 100% off coupon with unlimited uses
    const pearsonCoupon = await stripe.coupons.create({
      id: 'pearsonFREEPearson',
      name: 'pearsonFREEPearson',
      percent_off: 100,
      duration: 'forever',
      // No max_redemptions = unlimited uses
    });

    console.log('✅ Created Pearson coupon successfully!');
    console.log('\nCoupon Details:');
    console.log(`- ID: ${pearsonCoupon.id}`);
    console.log(`- Name: ${pearsonCoupon.name}`);
    console.log(`- Discount: ${pearsonCoupon.percent_off}% off`);
    console.log(`- Duration: ${pearsonCoupon.duration}`);
    console.log(`- Max Uses: Unlimited`);
    console.log(`- Status: ${pearsonCoupon.valid ? 'Active' : 'Inactive'}`);

    console.log('\n🎉 Coupon is ready to use!');
    console.log('💡 This coupon will give 100% off the entire order (including shipping)');

  } catch (error) {
    console.error('❌ Error creating coupon:', error.message);
  }
}

createPearsonCoupon(); 