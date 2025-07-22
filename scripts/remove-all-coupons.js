const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function removeAllCoupons() {
  try {
    console.log('Fetching all existing coupons...\n');
    
    // List all coupons
    const coupons = await stripe.coupons.list({ limit: 100 });
    
    if (coupons.data.length === 0) {
      console.log('✅ No coupons found to delete.');
      return;
    }
    
    console.log(`Found ${coupons.data.length} coupons:`);
    coupons.data.forEach(coupon => {
      const discount = coupon.percent_off ? 
        `${coupon.percent_off}% off` : 
        `$${(coupon.amount_off / 100).toFixed(2)} off`;
      const usage = `${coupon.times_redeemed}${coupon.max_redemptions ? ` / ${coupon.max_redemptions}` : ''}`;
      const status = coupon.valid ? 'Active' : 'Inactive';
      console.log(`- ${coupon.id}: ${coupon.name} (${discount}, ${usage} uses, ${status})`);
    });
    
    console.log('\n🗑️  Deleting all coupons...\n');
    
    // Delete each coupon
    for (const coupon of coupons.data) {
      try {
        await stripe.coupons.del(coupon.id);
        console.log(`✅ Deleted: ${coupon.id} (${coupon.name})`);
      } catch (error) {
        console.log(`❌ Failed to delete ${coupon.id}: ${error.message}`);
      }
    }
    
    console.log('\n🎉 All coupons have been removed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

removeAllCoupons(); 