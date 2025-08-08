require('dotenv').config({ path: '../.env.local' });
const Stripe = require('stripe');

// Debug: Check if environment variable is loaded
console.log('Stripe key loaded:', !!process.env.STRIPE_SECRET_KEY);
console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('STRIPE')));

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Scrunchie images with their URLs
const scrunchieImages = [
  {
    filename: '124e56aa-a007-450c-95ce-7b6050caa8ec.jpeg',
    url: 'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/124e56aa-a007-450c-95ce-7b6050caa8ec.jpeg'
  },
  {
    filename: '32384b1b-d9d7-4134-9161-4a8397c020d9.jpeg',
    url: 'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/32384b1b-d9d7-4134-9161-4a8397c020d9.jpeg'
  },
  {
    filename: '3a3374b8-0cd6-420c-b55a-153b576bb7f9.jpeg',
    url: 'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/3a3374b8-0cd6-420c-b55a-153b576bb7f9.jpeg'
  },
  {
    filename: '5ebe3346-72ad-4750-8466-bd3ba14da425 (1).jpeg',
    url: 'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/5ebe3346-72ad-4750-8466-bd3ba14da425%20(1).jpeg'
  },
  {
    filename: '60aecdee-8a22-4b8a-92c2-6a53df9f8ac9.jpeg',
    url: 'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/60aecdee-8a22-4b8a-92c2-6a53df9f8ac9.jpeg'
  },
  {
    filename: '943b5fbd-159b-4128-90b4-cc1f86812669.jpeg',
    url: 'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/943b5fbd-159b-4128-90b4-cc1f86812669.jpeg'
  },
  {
    filename: 'bbed883a-94b1-4eb7-a0bc-091b39e251c9.jpeg',
    url: 'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/bbed883a-94b1-4eb7-a0bc-091b39e251c9.jpeg'
  },
  {
    filename: 'c4696fba-0026-4f00-ba40-8eb9bc1d24a0.jpeg',
    url: 'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/c4696fba-0026-4f00-ba40-8eb9bc1d24a0.jpeg'
  }
];

// Product configurations - I'll need to examine the images to determine colors
// For now, I'll create a template and you can help me identify the colors
const scrunchieProducts = [
  {
    name: "Scrunchie Set 1",
    description: "Scrunchie, multicolor: [COLORS TO BE DETERMINED]",
    price: 8.00,
    imageIndex: 0
  },
  {
    name: "Scrunchie Set 2", 
    description: "Scrunchie, multicolor: [COLORS TO BE DETERMINED]",
    price: 8.00,
    imageIndex: 1
  },
  {
    name: "Scrunchie Set 3",
    description: "Scrunchie, multicolor: [COLORS TO BE DETERMINED]", 
    price: 8.00,
    imageIndex: 2
  },
  {
    name: "Scrunchie Set 4",
    description: "Scrunchie, multicolor: [COLORS TO BE DETERMINED]",
    price: 8.00,
    imageIndex: 3
  },
  {
    name: "Scrunchie Set 5",
    description: "Scrunchie, multicolor: [COLORS TO BE DETERMINED]",
    price: 8.00,
    imageIndex: 4
  },
  {
    name: "Scrunchie Set 6",
    description: "Scrunchie, multicolor: [COLORS TO BE DETERMINED]",
    price: 8.00,
    imageIndex: 5
  },
  {
    name: "Scrunchie Set 7",
    description: "Scrunchie, multicolor: [COLORS TO BE DETERMINED]",
    price: 8.00,
    imageIndex: 6
  },
  {
    name: "Scrunchie Set 8",
    description: "Scrunchie, multicolor: [COLORS TO BE DETERMINED]",
    price: 8.00,
    imageIndex: 7
  }
];

async function createScrunchieProducts() {
  console.log('🎀 Creating 8 new scrunchie product listings...\n');

  for (let i = 0; i < scrunchieProducts.length; i++) {
    const product = scrunchieProducts[i];
    const image = scrunchieImages[product.imageIndex];
    
    console.log(`📦 Creating ${product.name}...`);
    console.log(`🖼️ Image: ${image.filename}`);
    console.log(`🔗 URL: ${image.url}`);
    console.log(`💰 Price: $${product.price}`);
    console.log(`📝 Description: ${product.description}\n`);

    try {
      // Create the product
      const stripeProduct = await stripe.products.create({
        name: product.name,
        description: product.description,
        images: [image.url],
        metadata: {
          category: 'Accessories',
          tags: 'Scrunchies,Accessories,Hair',
          material: 'Acrylic',
          size: 'Standard',
          stock: '10',
          total_sold: '0'
        }
      });

      // Create the price
      const price = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: Math.round(product.price * 100), // Convert to cents
        currency: 'usd',
      });

      console.log(`✅ Created: ${product.name}`);
      console.log(`   Product ID: ${stripeProduct.id}`);
      console.log(`   Price ID: ${price.id}`);
      console.log(`   Price: $${product.price}\n`);

    } catch (error) {
      console.error(`❌ Error creating ${product.name}:`, error.message);
    }
  }

  console.log('🎉 Finished creating scrunchie products!');
  console.log('\n📋 Next Steps:');
  console.log('1. Examine the images to determine colors');
  console.log('2. Update the descriptions with correct colors');
  console.log('3. Run the update script to fix descriptions');
}

// Run the script
createScrunchieProducts().catch(console.error); 