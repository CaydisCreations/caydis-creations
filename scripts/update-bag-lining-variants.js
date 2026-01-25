const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Bag products with lining variants
const bagLiningVariants = {
  'Dark Rainbow Handbag': {
    baseName: 'Dark Rainbow Handbag',
    variants: [
      {
        productId: 'prod_SmePkdpV8FocKE',
        lining: 'Leaf Lining',
        liningType: 'leaf'
      },
      {
        productId: 'prod_SlvC49ifPVmHzA',
        lining: 'Solid Green Lining',
        liningType: 'solid-green'
      }
    ]
  },
  'Pink Handbag': {
    baseName: 'Pink Handbag',
    variants: [
      {
        productId: 'prod_SlvCyL1ArUUcAa',
        lining: 'Flower Lining',
        liningType: 'flower'
      },
      {
        productId: 'prod_ScqwTo3jjqx8Kc',
        lining: 'Solid Pink Lining',
        liningType: 'solid-pink'
      }
    ]
  }
};

async function updateBagLiningVariants() {
  try {
    console.log('🔄 Updating bag products with lining variant metadata...\n');

    for (const [bagName, bagInfo] of Object.entries(bagLiningVariants)) {
      console.log(`\n📦 Processing: ${bagName}`);
      
      // Get all images from all variants to combine them
      const allImages = [];
      const variantProducts = [];

      for (const variant of bagInfo.variants) {
        const product = await stripe.products.retrieve(variant.productId);
        variantProducts.push(product);
        
        // Collect all images from this variant
        if (product.images && product.images.length > 0) {
          allImages.push(...product.images);
        }
      }

      // Remove duplicate images
      const uniqueImages = [...new Set(allImages)];

      console.log(`   Found ${uniqueImages.length} unique images across all variants`);

      // Update each variant product with metadata
      for (const variant of bagInfo.variants) {
        const product = await stripe.products.retrieve(variant.productId);
        
        // Get existing metadata
        const existingMetadata = product.metadata || {};
        
        // Update metadata to identify as lining variant
        const updatedMetadata = {
          ...existingMetadata,
          hasLiningVariants: 'true',
          parentProduct: bagInfo.baseName,
          liningType: variant.liningType,
          liningName: variant.lining,
          variantType: 'lining'
        };

        console.log(`   📝 Updating ${variant.lining} (${variant.productId})`);
        console.log(`      Lining: ${variant.lining}`);
        
        // Update the product with new metadata
        await stripe.products.update(variant.productId, {
          metadata: updatedMetadata
        });

        console.log(`      ✅ Updated successfully`);
      }

      // Update the first variant to have all combined images (this will be the "main" product)
      const firstVariant = bagInfo.variants[0];
      const firstProduct = await stripe.products.retrieve(firstVariant.productId);
      
      console.log(`\n   🖼️  Updating first variant with all ${uniqueImages.length} combined images...`);
      await stripe.products.update(firstVariant.productId, {
        images: uniqueImages,
        metadata: {
          ...firstProduct.metadata,
          hasAllVariantImages: 'true'
        }
      });
      console.log(`      ✅ Images updated`);
    }

    console.log('\n🎉 All bag lining variants updated successfully!');
    console.log('\n📋 Summary:');
    console.log('   - Dark Rainbow Handbag: 2 lining variants (Leaf, Solid Green)');
    console.log('   - Pink Handbag: 2 lining variants (Flower, Solid Pink)');
    console.log('   - All variant images combined into main product listings');
    console.log('   - Metadata added to identify variants for grouping');

  } catch (error) {
    console.error('❌ Error updating bag lining variants:', error.message);
    console.error(error);
  }
}

// Run the script
updateBagLiningVariants();

