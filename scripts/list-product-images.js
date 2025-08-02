const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function listProductImages() {
  try {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      console.log('📋 Usage:');
      console.log('  node scripts/list-product-images.js <product_name>');
      console.log('  node scripts/list-product-images.js <product_id>');
      console.log('');
      console.log('📝 Examples:');
      console.log('  node scripts/list-product-images.js "Handbag - Multicolor (Dark Bag)"');
      console.log('  node scripts/list-product-images.js prod_SmePkdpV8FocKE');
      console.log('');
      console.log('🔍 Available products:');
      
      const products = await stripe.products.list({ limit: 100, active: true });
      products.data.forEach(product => {
        console.log(`  - ${product.name} (${product.id})`);
      });
      return;
    }

    const searchTerm = args[0];
    const products = await stripe.products.list({ limit: 100, active: true });
    
    let targetProduct;
    
    // Try to find by ID first
    if (searchTerm.startsWith('prod_')) {
      targetProduct = products.data.find(p => p.id === searchTerm);
    }
    
    // If not found by ID, try by name
    if (!targetProduct) {
      targetProduct = products.data.find(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (!targetProduct) {
      console.error(`❌ Product not found: ${searchTerm}`);
      console.log('');
      console.log('🔍 Available products:');
      products.data.forEach(product => {
        console.log(`  - ${product.name} (${product.id})`);
      });
      return;
    }

    console.log(`📦 Product: ${targetProduct.name}`);
    console.log(`🆔 ID: ${targetProduct.id}`);
    console.log(`📝 Description: ${targetProduct.description}`);
    console.log(`💰 Price: $${targetProduct.metadata?.price || 'N/A'}`);
    console.log(`📦 Stock: ${targetProduct.metadata?.stock || 'N/A'}`);
    console.log('');
    
    if (!targetProduct.images || targetProduct.images.length === 0) {
      console.log('📸 No images found for this product.');
      return;
    }

    console.log(`📸 Images (${targetProduct.images.length}):`);
    targetProduct.images.forEach((image, index) => {
      const fileName = image.split('/').pop();
      console.log(`  ${index + 1}. ${fileName}`);
      console.log(`     ${image}`);
      console.log('');
    });

    console.log('💡 To remove an image, use:');
    console.log(`  node scripts/remove-product-image.js remove ${targetProduct.id} "<image_url>"`);
    console.log('');
    console.log('📋 Example:');
    console.log(`  node scripts/remove-product-image.js remove ${targetProduct.id} "https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/IMG_6121.jpeg"`);

  } catch (error) {
    console.error('❌ Error listing product images:', error);
  }
}

listProductImages(); 