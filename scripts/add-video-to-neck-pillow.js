const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function addVideoToNeckPillow() {
  try {
    console.log('🎥 Adding video to Packable Travel Neck Pillow product...\n');

    // Find the neck pillow product
    const products = await stripe.products.list({
      limit: 100,
      active: true
    });

    const neckPillowProduct = products.data.find(product => 
      product.name === "Packable Travel Neck Pillow"
    );

    if (!neckPillowProduct) {
      console.error('❌ Packable Travel Neck Pillow product not found!');
      return;
    }

    console.log(`📦 Found product: ${neckPillowProduct.name}`);
    console.log(`   Current images: ${neckPillowProduct.images.length}`);
    console.log(`   Product ID: ${neckPillowProduct.id}\n`);

    // Create new images array with video as second item
    const newImages = [
      neckPillowProduct.images[0], // Keep first image
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/TravelPillows/NeckPillow_tan_brown_orange_red/neckpillowVid.MOV', // Add video as second
      ...neckPillowProduct.images.slice(1) // Add remaining images
    ];

    console.log('🖼️ New image order:');
    newImages.forEach((img, index) => {
      const isVideo = img.includes('.MOV') || img.includes('.mp4') || img.includes('.webm');
      console.log(`   ${index + 1}. ${isVideo ? '🎥 VIDEO' : '🖼️ IMAGE'}: ${img.split('/').pop()}`);
    });

    // Update the product with new images
    await stripe.products.update(neckPillowProduct.id, {
      images: newImages
    });

    console.log('\n✅ Video added successfully!');
    console.log(`   Total images: ${newImages.length}`);
    console.log('   Video is now the second item in the carousel');
    console.log('\n🎉 Packable Travel Neck Pillow now includes video as second item!');

  } catch (error) {
    console.error('❌ Error adding video to neck pillow:', error.message);
  }
}

// Run the script
addVideoToNeckPillow().catch(console.error);
