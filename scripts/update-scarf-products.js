const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Image mappings for each scarf product
const scarfImageMappings = {
  'Scarf - White': [
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_white/Modeled/IMG_6236.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_white/Modeled/IMG_6240.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_white/Modeled/IMG_6248.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_white/Modeled/IMG_6251.jpeg'
  ],
  'Scarf - Green, White': [
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/green_white/Modeled/IMG_6260.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/green_white/Modeled/IMG_6280.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/green_white/Modeled/IMG_6281.jpeg'
  ],
  'Scarf - Green': [
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_green/Modeled/IMG_6293.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_green/Modeled/IMG_6295.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_green/Modeled/IMG_6299.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_green/Modeled/IMG_6302.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_green/Modeled/IMG_6317.jpeg'
  ]
};

async function updateScarfProducts() {
  try {
    console.log('🔄 Finding scarf products on Stripe...\n');
    
    // Get all active products
    const products = await stripe.products.list({ limit: 100, active: true });
    const scarfProducts = products.data.filter(p => 
      p.name === 'Scarf - White' || 
      p.name === 'Scarf - Green, White' || 
      p.name === 'Scarf - Green'
    );
    
    console.log(`✅ Found ${scarfProducts.length} scarf products`);
    
    for (const product of scarfProducts) {
      const imagesToAdd = scarfImageMappings[product.name];
      
      if (!imagesToAdd) {
        console.log(`⚠️ No image mapping found for ${product.name}`);
        continue;
      }
      
      console.log(`\n📦 Updating ${product.name}...`);
      console.log(`🖼️ Adding ${imagesToAdd.length} images`);
      
      // Update the product with new images
      const updatedProduct = await stripe.products.update(product.id, {
        images: imagesToAdd
      });
      
      console.log(`✅ Successfully updated ${product.name} with ${updatedProduct.images.length} images`);
      
      // Log the image URLs for verification
      console.log('📋 Image URLs:');
      updatedProduct.images.forEach((url, index) => {
        console.log(`  ${index + 1}. ${url}`);
      });
    }
    
    console.log('\n🎉 All scarf products updated successfully!');
    
    // Summary
    console.log('\n📊 Summary:');
    console.log(`✅ Scarf - White: ${scarfImageMappings['Scarf - White'].length} images`);
    console.log(`✅ Scarf - Green, White: ${scarfImageMappings['Scarf - Green, White'].length} images`);
    console.log(`✅ Scarf - Green: ${scarfImageMappings['Scarf - Green'].length} images`);
    
  } catch (error) {
    console.error('❌ Error updating scarf products:', error);
  }
}

updateScarfProducts(); 