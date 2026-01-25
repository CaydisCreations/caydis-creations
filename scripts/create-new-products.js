const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createNewProducts() {
  try {
    console.log('🛍️ Creating new products...\n');

    // 1. Childrens' Ribbed Beanie with Pom-Pom
    console.log('📦 Creating Childrens\' Ribbed Beanie with Pom-Pom...');
    const beanieImages = [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/ChildrensRibbedPom-Pom/IMG_6988.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/ChildrensRibbedPom-Pom/IMG_6987.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/ChildrensRibbedPom-Pom/IMG_6981.jpeg'
    ];

    const beanieProduct = await stripe.products.create({
      name: "Childrens' Ribbed Beanie with Pom-Pom",
      description: "Multi colored beanie perfect for kids 4-7",
      images: beanieImages,
      metadata: {
        category: 'Wearables',
        tags: 'Beanies,Accessories,Kids,Children',
        material: 'Acrylic yarn',
        size: 'Kids 4-7',
        stock: '1'
      }
    });

    const beaniePrice = await stripe.prices.create({
      product: beanieProduct.id,
      unit_amount: 8500, // $85.00
      currency: 'usd',
    });

    await stripe.products.update(beanieProduct.id, {
      default_price: beaniePrice.id
    });

    console.log(`✅ Created: ${beanieProduct.name}`);
    console.log(`   Product ID: ${beanieProduct.id}, Price ID: ${beaniePrice.id}\n`);

    // 2. Thick Army Headband (Army 1)
    console.log('📦 Creating Thick Army Headband...');
    const army1Product = await stripe.products.create({
      name: "Thick Army Headband",
      description: "Stretchy headband!",
      images: ['https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Headbands/army/Army1.jpeg'],
      metadata: {
        category: 'Accessories',
        tags: 'Headbands,Accessories,Army',
        material: 'Acrylic Yarn',
        measurements: 'Length: 9 inches, Width: 4 inches',
        size: '9 inches x 4 inches',
        stock: '2'
      }
    });

    const army1Price = await stripe.prices.create({
      product: army1Product.id,
      unit_amount: 2000, // $20.00
      currency: 'usd',
    });

    await stripe.products.update(army1Product.id, {
      default_price: army1Price.id
    });

    console.log(`✅ Created: ${army1Product.name}`);
    console.log(`   Product ID: ${army1Product.id}, Price ID: ${army1Price.id}\n`);

    // 3. Army Headband - 10 inches (Army 2 Part 1)
    console.log('📦 Creating Army Headband - 10 inches...');
    const army2_10Product = await stripe.products.create({
      name: "Army Headband - 10 inches",
      description: "Headband made to fit, little stretch!",
      images: ['https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Headbands/army/Army2.jpeg'],
      metadata: {
        category: 'Accessories',
        tags: 'Headbands,Accessories,Army',
        material: 'Acrylic Yarn',
        measurements: 'Length: 10 inches, Width: 3 inches',
        size: '10 inches x 3 inches',
        stock: '2',
        size_variant: '10x3'
      }
    });

    const army2_10Price = await stripe.prices.create({
      product: army2_10Product.id,
      unit_amount: 2000, // $20.00
      currency: 'usd',
    });

    await stripe.products.update(army2_10Product.id, {
      default_price: army2_10Price.id
    });

    console.log(`✅ Created: ${army2_10Product.name}`);
    console.log(`   Product ID: ${army2_10Product.id}, Price ID: ${army2_10Price.id}\n`);

    // 4. Army Headband - 8.5 inches (Army 2 Part 2)
    console.log('📦 Creating Army Headband - 8.5 inches...');
    const army2_85Product = await stripe.products.create({
      name: "Army Headband - 8.5 inches",
      description: "Headband made to fit, little stretch!",
      images: ['https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Headbands/army/Army2.jpeg'],
      metadata: {
        category: 'Accessories',
        tags: 'Headbands,Accessories,Army',
        material: 'Acrylic Yarn',
        measurements: 'Length: 8.5 inches, Width: 2.5 inches',
        size: '8.5 inches x 2.5 inches',
        stock: '4',
        size_variant: '8.5x2.5',
        parent_product: 'Army Headband'
      }
    });

    const army2_85Price = await stripe.prices.create({
      product: army2_85Product.id,
      unit_amount: 2000, // $20.00
      currency: 'usd',
    });

    await stripe.products.update(army2_85Product.id, {
      default_price: army2_85Price.id
    });

    console.log(`✅ Created: ${army2_85Product.name}`);
    console.log(`   Product ID: ${army2_85Product.id}, Price ID: ${army2_85Price.id}\n`);

    // 5. Blue Multicolor Headband - 10 inches (Part 1)
    console.log('📦 Creating Blue Multicolor Headband - 10 inches...');
    const blue_10Product = await stripe.products.create({
      name: "Blue Multicolor Headband - 10 inches",
      description: "Thick headband, perfect for winter",
      images: ['https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Headbands/blue_white_brown/IMG_7243.jpeg'],
      metadata: {
        category: 'Accessories',
        tags: 'Headbands,Accessories,Blue,Multicolor',
        material: 'Acrylic Yarn',
        measurements: 'Length: 10 inches, Width: 3 inches',
        size: '10 inches x 3 inches',
        stock: '4',
        size_variant: '10x3'
      }
    });

    const blue_10Price = await stripe.prices.create({
      product: blue_10Product.id,
      unit_amount: 2000, // $20.00
      currency: 'usd',
    });

    await stripe.products.update(blue_10Product.id, {
      default_price: blue_10Price.id
    });

    console.log(`✅ Created: ${blue_10Product.name}`);
    console.log(`   Product ID: ${blue_10Product.id}, Price ID: ${blue_10Price.id}\n`);

    // 6. Blue Multicolor Headband - 8.5 inches (Part 2)
    console.log('📦 Creating Blue Multicolor Headband - 8.5 inches...');
    const blue_85Product = await stripe.products.create({
      name: "Blue Multicolor Headband - 8.5 inches",
      description: "Thick headband, perfect for winter",
      images: ['https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Headbands/blue_white_brown/IMG_7243.jpeg'],
      metadata: {
        category: 'Accessories',
        tags: 'Headbands,Accessories,Blue,Multicolor',
        material: 'Acrylic Yarn',
        measurements: 'Length: 8.5 inches, Width: 3 inches',
        size: '8.5 inches x 3 inches',
        stock: '2',
        size_variant: '8.5x3',
        parent_product: 'Blue Multicolor Headband'
      }
    });

    const blue_85Price = await stripe.prices.create({
      product: blue_85Product.id,
      unit_amount: 2000, // $20.00
      currency: 'usd',
    });

    await stripe.products.update(blue_85Product.id, {
      default_price: blue_85Price.id
    });

    console.log(`✅ Created: ${blue_85Product.name}`);
    console.log(`   Product ID: ${blue_85Product.id}, Price ID: ${blue_85Price.id}\n`);

    // 7. Kids Mermaid Cardigan
    console.log('📦 Creating Kids Mermaid Cardigan...');
    const mermaidProduct = await stripe.products.create({
      name: "Kids Mermaid Cardigan",
      description: "Perfect cardigan for your child! Waist Length Style",
      images: ['https://caydiscreations.s3.us-east-2.amazonaws.com/Public/logoCaydisCreation.PNG'],
      metadata: {
        category: 'Baby Clothes',
        tags: 'Cardigan,Baby Clothes,Clothing,Kids,Mermaid',
        material: 'Acrylic Yarn',
        size: 'Childs Medium, Childs 7-8',
        stock: '2'
      }
    });

    const mermaidPrice = await stripe.prices.create({
      product: mermaidProduct.id,
      unit_amount: 12000, // $120.00
      currency: 'usd',
    });

    await stripe.products.update(mermaidProduct.id, {
      default_price: mermaidPrice.id
    });

    console.log(`✅ Created: ${mermaidProduct.name}`);
    console.log(`   Product ID: ${mermaidProduct.id}, Price ID: ${mermaidPrice.id}\n`);

    console.log('🎉 All products created successfully!');
    console.log('\n📋 Summary:');
    console.log('   1. Childrens\' Ribbed Beanie with Pom-Pom - $85');
    console.log('   2. Thick Army Headband - $20');
    console.log('   3. Army Headband - 10 inches - $20');
    console.log('   4. Army Headband - 8.5 inches - $20');
    console.log('   5. Blue Multicolor Headband - 10 inches - $20');
    console.log('   6. Blue Multicolor Headband - 8.5 inches - $20');
    console.log('   7. Kids Mermaid Cardigan - $120');
    
  } catch (error) {
    console.error('❌ Error creating products:', error.message);
  }
}

// Run the script
createNewProducts();

