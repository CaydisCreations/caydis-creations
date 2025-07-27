require('dotenv').config({ path: '.env.local' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// New beanie products to upload
const newBeanies = [
  {
    name: "Beanie - Multi-color (Red, Blue, Yellow)",
    description: "Acrylic beanie, multi-color: red, blue, yellow. Length: 10 inches, Width: 11 inches.",
    image: "https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/red_blue_yellow/IMG_6107.jpeg",
    price: 3000, // $30.00 in cents
    category: "Wearables",
    tags: "hats",
    stock: 1,
    parcel: {
      length: "10",
      width: "11",
      height: "2",
      weight_oz: "12.8"
    }
  },
  {
    name: "Beanie - Multi-color (Green, Blue, White, Brown)",
    description: "Acrylic beanie, multi-color: green, blue, white, brown. Length: 10 inches, Width: 11 inches.",
    image: "https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/green_blue_white_brown/IMG_6104.jpeg",
    price: 3000, // $30.00 in cents
    category: "Wearables",
    tags: "hats",
    stock: 1,
    parcel: {
      length: "10",
      width: "11",
      height: "2",
      weight_oz: "12.8"
    }
  },
  {
    name: "Beanie - Blue",
    description: "Acrylic beanie, blue. Length: 10 inches, Width: 11 inches.",
    image: "https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/blue1/IMG_6109.jpeg",
    price: 3000, // $30.00 in cents
    category: "Wearables",
    tags: "hats",
    stock: 1,
    parcel: {
      length: "10",
      width: "11",
      height: "2",
      weight_oz: "12.8"
    }
  }
];

async function uploadNewBeanies() {
  console.log('=== Uploading New Beanie Products ===\n');
  
  // Check if any URLs contain [FILENAME] placeholder
  const hasPlaceholders = newBeanies.some(beanie => beanie.image.includes('[FILENAME]'));
  
  if (hasPlaceholders) {
    console.log('⚠️  WARNING: Some image URLs contain [FILENAME] placeholders!');
    console.log('Please update the script with the actual filenames before running.\n');
    
    console.log('📋 Current URLs (need filename updates):');
    newBeanies.forEach((beanie, index) => {
      console.log(`${index + 1}. ${beanie.name}`);
      console.log(`   URL: ${beanie.image}`);
      console.log('');
    });
    
    console.log('🔧 To fix this:');
    console.log('1. Check your S3 bucket for the actual filenames');
    console.log('2. Replace [FILENAME] with the actual filename (e.g., IMG_1234.jpeg)');
    console.log('3. Run the script again');
    return;
  }
  
  try {
    for (const beanie of newBeanies) {
      console.log(`📦 Creating product: ${beanie.name}`);
      
      // Create the product
      const product = await stripe.products.create({
        name: beanie.name,
        description: beanie.description,
        images: [beanie.image],
        active: true,
        metadata: {
          stock: String(beanie.stock),
          total_sold: '0',
          category: beanie.category,
          tags: beanie.tags,
          parcel_length: beanie.parcel.length,
          parcel_width: beanie.parcel.width,
          parcel_height: beanie.parcel.height,
          parcel_weight_oz: beanie.parcel.weight_oz
        }
      });
      
      console.log(`✅ Product created: ${product.id}`);
      
      // Create the price
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: beanie.price,
        currency: 'usd',
        active: true
      });
      
      console.log(`✅ Price created: ${price.id} - $${(beanie.price / 100).toFixed(2)} USD`);
      console.log(`   Stock: ${beanie.stock}`);
      console.log(`   Category: ${beanie.category}`);
      console.log(`   Tags: ${beanie.tags}`);
      console.log(`   Parcel: ${beanie.parcel.length} x ${beanie.parcel.width} x ${beanie.parcel.height} in, ${beanie.parcel.weight_oz} oz`);
      console.log('');
    }
    
    console.log('🎉 All new beanie products uploaded successfully!');
    console.log('\n📋 Summary:');
    console.log(`   Products created: ${newBeanies.length}`);
    console.log(`   Price: $30.00 USD each`);
    console.log(`   Category: Wearables`);
    console.log(`   Tags: hats`);
    console.log(`   Parcel: 10 x 11 x 2 in, 12.8 oz`);
    console.log(`   Stock: 1 each`);
    
  } catch (error) {
    console.error('❌ Error uploading beanies:', error.message);
    process.exit(1);
  }
}

// Run the upload
uploadNewBeanies(); 