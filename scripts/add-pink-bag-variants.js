require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function addPinkBagVariants() {
  try {
    console.log('👜 Adding pink multicolor bag variants and dark multicolor bag...\n');

    // 1. Update existing pink bag to clarify "solid pink" inner lining
    console.log('📝 Updating existing pink multicolor bag...');
    const existingProductId = 'prod_ScqwTo3jjqx8Kc';
    
    await stripe.products.update(existingProductId, {
      name: 'Handbag - Multicolor (Pink Bag - Solid Pink Lining)',
      description: 'Handbag, acrylic, multicolor: pink, purple, red, orange. Inner lining: solid pink. Length: 22 inches, Width: 15.5 inches.',
      metadata: {
        category: 'Bags',
        colors: 'Pink,Purple,Red,Orange',
        dimensions: '{"length":"22 inches","width":"15.5 inches"}',
        local_id: '8',
        material: 'Acrylic',
        parcel_height: '2',
        parcel_length: '13',
        parcel_weight_oz: '12.8',
        parcel_width: '8',
        stock: '1',
        tags: 'bag,pink,multicolor',
        inner_lining: 'solid pink'
      }
    });
    console.log('✅ Updated existing pink bag with solid pink lining');

    // 2. Create new pink bag with flowers inner lining
    console.log('\n👜 Creating pink multicolor bag with flowers inner lining...');
    const pinkFlowersProduct = await stripe.products.create({
      name: 'Handbag - Multicolor (Pink Bag - Flowers Lining)',
      description: 'Handbag, acrylic, multicolor: pink, purple, red, orange. Inner lining: pink with flowers. Length: 22 inches, Width: 15.5 inches.',
      metadata: {
        category: 'Bags',
        colors: 'Pink,Purple,Red,Orange',
        dimensions: '{"length":"22 inches","width":"15.5 inches"}',
        local_id: '9',
        material: 'Acrylic',
        parcel_height: '2',
        parcel_length: '13',
        parcel_weight_oz: '12.8',
        parcel_width: '8',
        stock: '1',
        tags: 'bag,pink,multicolor,flowers',
        inner_lining: 'pink with flowers'
      }
    });

    // Create price for pink flowers bag
    await stripe.prices.create({
      product: pinkFlowersProduct.id,
      unit_amount: 5000, // $50.00
      currency: 'usd',
      active: true
    });
    console.log('✅ Created pink bag with flowers lining');

    // 3. Create dark multicolor bag
    console.log('\n👜 Creating dark multicolor bag...');
    const darkBagProduct = await stripe.products.create({
      name: 'Handbag - Multicolor (Dark Bag)',
      description: 'Handbag, acrylic, multicolor: red, orange, pink, purple, green, blue. Inner lining: green with leaf design. Length: 23 inches, Width: 15.5 inches.',
      metadata: {
        category: 'Bags',
        colors: 'Red,Orange,Pink,Purple,Green,Blue',
        dimensions: '{"length":"23 inches","width":"15.5 inches"}',
        local_id: '10',
        material: 'Acrylic',
        parcel_height: '2',
        parcel_length: '13',
        parcel_weight_oz: '12.8',
        parcel_width: '8',
        stock: '1',
        tags: 'bag,dark,multicolor',
        inner_lining: 'green with leaf design'
      }
    });

    // Create price for dark bag
    await stripe.prices.create({
      product: darkBagProduct.id,
      unit_amount: 5000, // $50.00
      currency: 'usd',
      active: true
    });
    console.log('✅ Created dark multicolor bag');

    console.log('\n🎉 All bag variants created successfully!');
    console.log('\n📋 Summary:');
    console.log('1. ✅ Updated existing pink bag: "Handbag - Multicolor (Pink Bag - Solid Pink Lining)"');
    console.log('2. ✅ Created new pink bag: "Handbag - Multicolor (Pink Bag - Flowers Lining)"');
    console.log('3. ✅ Created dark bag: "Handbag - Multicolor (Dark Bag)"');
    console.log('\n💰 All bags priced at $50.00');

  } catch (error) {
    console.error('❌ Error adding bag variants:', error.message);
  }
}

addPinkBagVariants(); 