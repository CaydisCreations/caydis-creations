require('dotenv').config({ path: '.env.local' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// New scrunchie products to upload
const newScrunchies = [
  {
    name: "Scrunchie: Pink Orange White",
    description: "Set of 4 scrunchies: pink, orange, white.",
    image: "https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/bbed883a-94b1-4eb7-a0bc-091b39e251c9.jpeg",
    price: 2000, // $20.00 in cents
    category: "Wearables",
    tags: "scrunchie,Accessories",
    stock: 1,
    parcel: {
      length: "4",
      width: "4", 
      height: "3",
      weight_oz: "2"
    }
  },
  {
    name: "Scrunchie: Purple Pink Orange",
    description: "Set of 4 scrunchies: purple, pink, orange.",
    image: "https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/943b5fbd-159b-4128-90b4-cc1f86812669.jpeg",
    price: 2000, // $20.00 in cents
    category: "Wearables",
    tags: "scrunchie,Accessories",
    stock: 1,
    parcel: {
      length: "4",
      width: "4",
      height: "3", 
      weight_oz: "2"
    }
  }
];

async function uploadNewScrunchies() {
  console.log('=== Uploading New Scrunchie Products ===\n');
  
  try {
    for (const scrunchie of newScrunchies) {
      console.log(`📦 Creating product: ${scrunchie.name}`);
      
      // Create the product
      const product = await stripe.products.create({
        name: scrunchie.name,
        description: scrunchie.description,
        images: [scrunchie.image],
        active: true,
        metadata: {
          stock: String(scrunchie.stock),
          total_sold: '0',
          category: scrunchie.category,
          tags: scrunchie.tags,
          parcel_length: scrunchie.parcel.length,
          parcel_width: scrunchie.parcel.width,
          parcel_height: scrunchie.parcel.height,
          parcel_weight_oz: scrunchie.parcel.weight_oz
        }
      });
      
      console.log(`✅ Product created: ${product.id}`);
      
      // Create the price
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: scrunchie.price,
        currency: 'usd',
        active: true
      });
      
      console.log(`✅ Price created: ${price.id} - $${(scrunchie.price / 100).toFixed(2)} USD`);
      console.log(`   Stock: ${scrunchie.stock}`);
      console.log(`   Category: ${scrunchie.category}`);
      console.log(`   Tags: ${scrunchie.tags}`);
      console.log(`   Parcel: ${scrunchie.parcel.length} x ${scrunchie.parcel.width} x ${scrunchie.parcel.height} in, ${scrunchie.parcel.weight_oz} oz`);
      console.log('');
    }
    
    console.log('🎉 All new scrunchie products uploaded successfully!');
    console.log('\n📋 Summary:');
    console.log(`   Products created: ${newScrunchies.length}`);
    console.log(`   Price: $20.00 USD each`);
    console.log(`   Category: Wearables`);
    console.log(`   Tags: scrunchie,Accessories`);
    console.log(`   Parcel: 4 x 4 x 3 in, 2 oz`);
    console.log(`   Stock: 1 each`);
    
  } catch (error) {
    console.error('❌ Error uploading scrunchies:', error.message);
    process.exit(1);
  }
}

// Run the upload
uploadNewScrunchies(); 