require('dotenv').config({ path: '.env.local' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Green scarf product to upload
const greenScarf = {
  name: "Scarf - Green",
  description: "Alpaca/nylon scarf, green. Length: 61 inches, Width: 8.5 inches.",
  image: "https://caydiscreations.s3.us-east-2.amazonaws.com/Public/logoCaydisCreation.PNG", // Logo placeholder
  price: 8000, // $80.00 in cents
  category: "Wearables",
  tags: "scarf,Accessories",
  stock: 1,
  parcel: {
    length: "8",
    width: "8",
    height: "3",
    weight_oz: "12.8"
  }
};

async function uploadGreenScarf() {
  console.log('=== Uploading Green Scarf Product ===\n');
  
  try {
    console.log(`📦 Creating product: ${greenScarf.name}`);
    
    // Create the product
    const product = await stripe.products.create({
      name: greenScarf.name,
      description: greenScarf.description,
      images: [greenScarf.image],
      active: true,
      metadata: {
        stock: String(greenScarf.stock),
        total_sold: '0',
        category: greenScarf.category,
        tags: greenScarf.tags,
        parcel_length: greenScarf.parcel.length,
        parcel_width: greenScarf.parcel.width,
        parcel_height: greenScarf.parcel.height,
        parcel_weight_oz: greenScarf.parcel.weight_oz
      }
    });
    
    console.log(`✅ Product created: ${product.id}`);
    
    // Create the price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: greenScarf.price,
      currency: 'usd',
      active: true
    });
    
    console.log(`✅ Price created: ${price.id} - $${(greenScarf.price / 100).toFixed(2)} USD`);
    console.log(`   Stock: ${greenScarf.stock}`);
    console.log(`   Category: ${greenScarf.category}`);
    console.log(`   Tags: ${greenScarf.tags}`);
    console.log(`   Parcel: ${greenScarf.parcel.length} x ${greenScarf.parcel.width} x ${greenScarf.parcel.height} in, ${greenScarf.parcel.weight_oz} oz`);
    console.log(`   Material: 70% alpaca, 30% nylon`);
    console.log(`   Dimensions: 61 inches x 8.5 inches`);
    console.log('');
    
    console.log('🎉 Green scarf product uploaded successfully!');
    console.log('\n📋 Summary:');
    console.log(`   Product: ${greenScarf.name}`);
    console.log(`   Price: $${(greenScarf.price / 100).toFixed(2)} USD`);
    console.log(`   Category: ${greenScarf.category}`);
    console.log(`   Tags: ${greenScarf.tags}`);
    console.log(`   Parcel: ${greenScarf.parcel.length} x ${greenScarf.parcel.width} x ${greenScarf.parcel.height} in, ${greenScarf.parcel.weight_oz} oz`);
    console.log(`   Stock: ${greenScarf.stock}`);
    console.log(`   Material: 70% alpaca, 30% nylon`);
    console.log(`   Dimensions: 61 inches x 8.5 inches`);
    console.log(`   Image: Logo placeholder (can be updated later)`);
    
  } catch (error) {
    console.error('❌ Error uploading green scarf:', error.message);
    process.exit(1);
  }
}

// Run the upload
uploadGreenScarf(); 