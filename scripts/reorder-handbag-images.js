const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function reorderHandbagImages() {
  try {
    console.log('🔄 Reordering handbag images to show modeled shots first...');

    // Get all products
    const products = await stripe.products.list({
      limit: 100,
      active: true
    });

    // Find the specific products
    const beigeBag = products.data.find(p => p.name === 'Handbag - Beige/White Lining');
    const pinkBag = products.data.find(p => p.name === 'Handbag - Multicolor (Pink Bag - Solid Pink Lining)');

    if (!beigeBag) {
      console.log('❌ Handbag - Beige/White Lining not found');
    } else {
      console.log(`📦 Found Beige/White Lining bag: ${beigeBag.id}`);
      
      // Reorder images: put modeled shots first
      const reorderedBeigeImages = [
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/cream_colored/modeled/IMG_6146.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/cream_colored/modeled/IMG_6149.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/cream_colored/IMG_6130.jpeg'
      ];

      await stripe.products.update(beigeBag.id, {
        images: reorderedBeigeImages
      });

      console.log('✅ Updated Beige/White Lining bag with reordered images');
      console.log('   New order: Modeled shot → Modeled shot → Product shot');
    }

    if (!pinkBag) {
      console.log('❌ Handbag - Multicolor (Pink Bag - Solid Pink Lining) not found');
    } else {
      console.log(`📦 Found Pink Bag: ${pinkBag.id}`);
      
      // Reorder images: put modeled shots first
      const reorderedPinkImages = [
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6157.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6159.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6163.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6164.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/IMG_6119.jpeg'
      ];

      await stripe.products.update(pinkBag.id, {
        images: reorderedPinkImages
      });

      console.log('✅ Updated Pink Bag with reordered images');
      console.log('   New order: Modeled shots → Product shot');
    }

    console.log('\n🎉 Handbag image reordering completed!');

  } catch (error) {
    console.error('❌ Error reordering handbag images:', error);
  }
}

reorderHandbagImages(); 