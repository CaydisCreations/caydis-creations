require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');
const fs = require('fs');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Product to S3 image mappings based on descriptions and colors
const productImageMappings = {
  // BAG PRODUCTS
  'prod_SlvC49ifPVmHzA': { // Handbag - Multicolor (Dark Bag) - red, orange, pink, purple, green, blue
    name: 'Handbag - Multicolor (Dark Bag)',
    s3Folder: 'red_pink_orange_purple',
    description: 'Handbag, acrylic, multicolor: red, orange, pink, purple, green, blue. Inner lining: green with leaf design. Length: 23 inches, Width: 15.5 inches.',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/IMG_6119.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6157.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6159.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6163.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6164.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6167.jpeg'
    ]
  },
  'prod_SlvCyL1ArUUcAa': { // Handbag - Multicolor (Pink Bag - Flowers Lining) - pink, purple, red, orange
    name: 'Handbag - Multicolor (Pink Bag - Flowers Lining)',
    s3Folder: 'rainbow',
    description: 'Handbag, acrylic, multicolor: pink, purple, red, orange. Inner lining: pink with flowers. Length: 22 inches, Width: 15.5 inches.',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/IMG_6122.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6168.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6169.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6171.jpeg'
    ]
  },
  'prod_ScqwTo3jjqx8Kc': { // Handbag - Multicolor (Pink Bag - Solid Pink Lining) - pink, purple, red, orange
    name: 'Handbag - Multicolor (Pink Bag - Solid Pink Lining)',
    s3Folder: 'red_pink_orange_purple',
    description: 'Handbag, acrylic, multicolor: pink, purple, red, orange. Inner lining: solid pink. Length: 22 inches, Width: 15.5 inches.',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/IMG_6119.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6157.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6159.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6163.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6164.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6167.jpeg'
    ]
  },
  'prod_ScqwhWrHtkiqzn': { // Handbag - Multicolor (Light Bag) - white, pink, green, blue, red, orange
    name: 'Handbag - Multicolor (Light Bag)',
    s3Folder: 'white_blue_green_yellow_red',
    description: 'Handbag, acrylic, multicolor: white, pink, green, blue, red, orange. Inner lining: white. Length: 22.5 inches, Width: 15 inches.',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/white_blue_green_yellow_red/IMG_6124.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/white_blue_green_yellow_red/IMG_6125.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/white_blue_green_yellow_red/modeled/IMG_6151.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/white_blue_green_yellow_red/modeled/IMG_6152.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/white_blue_green_yellow_red/modeled/IMG_6156.jpeg'
    ]
  },
  'prod_ScqwkCIceXM4jB': { // Handbag - Beige/White Lining - beige
    name: 'Handbag - Beige/White Lining',
    s3Folder: 'cream_colored',
    description: 'Handbag, acrylic, beige, inner lining: white. Length: 23 inches, Width: 16 inches.',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/cream_colored/IMG_6130.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/cream_colored/modeled/IMG_6146.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/cream_colored/modeled/IMG_6149.jpeg'
    ]
  },
  'prod_ScqwOPq9wEVnU1': { // Handbag - Multicolor (Dark Bag) - red, orange, pink, purple, green, blue
    name: 'Handbag - Multicolor (Dark Bag)',
    s3Folder: 'red_pink_orange_purple',
    description: 'Handbag, acrylic, multicolor: red, orange, pink, purple, green, blue. Inner lining: green. Length: 23 inches, Width: 15.5 inches.',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/IMG_6119.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6157.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6159.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6163.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6164.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6167.jpeg'
    ]
  },

  // BEANIE PRODUCTS
  'prod_Sl3xhipQ5ZFILY': { // Beanie - Blue
    name: 'Beanie - Blue',
    s3Folder: 'blue1',
    description: 'Acrylic beanie, blue. Length: 10 inches, Width: 11 inches.',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/blue1/IMG_6109.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/blue1/modeled/IMG_6182.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/blue1/modeled/IMG_6186.jpeg'
    ]
  },
  'prod_Sl3xzq4JFPPuxp': { // Beanie - Multi-color (Green, Blue, White, Brown)
    name: 'Beanie - Multi-color (Green, Blue, White, Brown)',
    s3Folder: 'green_blue_white_brown',
    description: 'Acrylic beanie, multi-color: green, blue, white, brown. Length: 10 inches, Width: 11 inches.',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/green_blue_white_brown/IMG_6104.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/green_blue_white_brown/modeled/FullSizeRender%202.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/green_blue_white_brown/modeled/FullSizeRender%203.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/green_blue_white_brown/modeled/FullSizeRender.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/green_blue_white_brown/modeled/IMG_6201.jpeg'
    ]
  },
  'prod_Sl3xvGKEVx8u1O': { // Beanie - Multi-color (Red, Blue, Yellow)
    name: 'Beanie - Multi-color (Red, Blue, Yellow)',
    s3Folder: 'red_blue_yellow',
    description: 'Acrylic beanie, multi-color: red, blue, yellow. Length: 10 inches, Width: 11 inches.',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/red_blue_yellow/IMG_6107.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/red_blue_yellow/modeled/IMG_6207.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/red_blue_yellow/modeled/IMG_6210.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/red_blue_yellow/modeled/IMG_6212.jpeg'
    ]
  }
};

async function updateStripeProducts() {
  console.log('🔄 Updating Stripe products with S3 images...\n');

  for (const [productId, mapping] of Object.entries(productImageMappings)) {
    try {
      console.log(`📦 Updating: ${mapping.name}`);
      console.log(`   Product ID: ${productId}`);
      console.log(`   S3 Folder: ${mapping.s3Folder}`);
      console.log(`   Images: ${mapping.images.length} images`);

      // Update the product with new images
      await stripe.products.update(productId, {
        images: mapping.images
      });

      console.log(`   ✅ Successfully updated ${mapping.name}\n`);
    } catch (error) {
      console.error(`   ❌ Error updating ${mapping.name}: ${error.message}\n`);
    }
  }
}

async function updateGalleryFile() {
  console.log('🖼️ Updating gallery file with new items...\n');

  const galleryFilePath = 'src/app/gallery/page.tsx';
  let galleryContent = fs.readFileSync(galleryFilePath, 'utf8');

  // New gallery items to add
  const newGalleryItems = [
    {
      id: 'modeled-beanies',
      type: 'image-group',
      url: 'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/blue1/modeled/IMG_6182.jpeg',
      images: [
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/blue1/modeled/IMG_6182.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/blue1/modeled/IMG_6186.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/green_blue_white_brown/modeled/FullSizeRender%202.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/green_blue_white_brown/modeled/FullSizeRender%203.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/green_blue_white_brown/modeled/FullSizeRender.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/green_blue_white_brown/modeled/IMG_6201.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/red_blue_yellow/modeled/IMG_6207.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/red_blue_yellow/modeled/IMG_6210.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/red_blue_yellow/modeled/IMG_6212.jpeg'
      ],
      title: 'Modeled Beanies Collection',
      description: 'A collection of modeled beanie photos showing our handmade beanies being worn. Each beanie is crafted with care and unique design.',
      categories: ['Beanies', 'Accessories'],
      tags: ['modeled', 'beanies', 'worn', 'handmade', 'accessories'],
      date: '2024-07-31',
    },
    {
      id: 'brown-beanies',
      type: 'image-group',
      url: 'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/BrownHats/IMG_5912.jpeg',
      images: [
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/BrownHats/IMG_5912.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/BrownHats/IMG_5913.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/BrownHats/IMG_5914.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/BrownHats/IMG_5915.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/BrownHats/IMG_5916.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/BrownHats/IMG_5917.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/BrownHats/IMG_5918.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/BrownHats/IMG_5919.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/BrownHats/IMG_5920.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/BrownHats/IMG_5921.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/BrownHats/IMG_5922.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/BrownHats/IMG_5923.jpeg'
      ],
      title: 'Brown Beanies Collection',
      description: 'A collection of brown beanies with logo patches. Each beanie is hand crocheted from acrylic yarn and features a sewed on logo patch.',
      categories: ['Beanies', 'Accessories'],
      tags: ['brown', 'beanies', 'logo', 'handmade', 'accessories'],
      date: '2024-07-31',
    }
  ];

  // Update the existing "Bags Collection" with all bag images
  const allBagImages = [
    // Existing duffle bag images
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/duffleBag/IMG_6990.jpg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/duffleBag/IMG_6988.jpg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/duffleBag/IMG_6989.jpg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/duffleBag/IMG_6986.jpg',
    // New bag images
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/IMG_6122.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6168.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6169.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6171.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/white_blue_green_yellow_red/IMG_6124.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/white_blue_green_yellow_red/IMG_6125.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/white_blue_green_yellow_red/modeled/IMG_6151.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/white_blue_green_yellow_red/modeled/IMG_6152.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/white_blue_green_yellow_red/modeled/IMG_6156.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/IMG_6119.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6157.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6159.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6163.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6164.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6167.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/cream_colored/IMG_6130.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/cream_colored/modeled/IMG_6146.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/cream_colored/modeled/IMG_6149.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/gray/modeled/IMG_6141.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/gray/modeled/IMG_6143.jpeg'
  ];

  // Find the bags-collection item and update its images
  const bagsCollectionRegex = /id: 'bags-collection',[\s\S]*?images: \[([\s\S]*?)\],/;
  const bagsCollectionMatch = galleryContent.match(bagsCollectionRegex);
  
  if (bagsCollectionMatch) {
    const newBagsImages = allBagImages.map(img => `      '${img}',`).join('\n');
    const newBagsCollection = `id: 'bags-collection',
    type: 'image-group',
    url: '${allBagImages[0]}',
    images: [
${newBagsImages}
    ],`;
    
    galleryContent = galleryContent.replace(bagsCollectionRegex, newBagsCollection);
    console.log('✅ Updated Bags Collection with all bag images');
  }

  // Add new gallery items before the closing bracket
  const newItemsString = newGalleryItems.map(item => `  {
    id: '${item.id}',
    type: '${item.type}',
    url: '${item.url}',
    images: [
${item.images.map(img => `      '${img}',`).join('\n')}
    ],
    title: '${item.title}',
    description: '${item.description}',
    categories: [${item.categories.map(cat => `'${cat}'`).join(', ')}],
    tags: [${item.tags.map(tag => `'${tag}'`).join(', ')}],
    date: '${item.date}',
  },`).join('\n\n');

  // Insert new items before the closing bracket of mediaItems array
  const insertPoint = galleryContent.lastIndexOf(']');
  galleryContent = galleryContent.slice(0, insertPoint) + newItemsString + '\n\n' + galleryContent.slice(insertPoint);

  // Write the updated content back to the file
  fs.writeFileSync(galleryFilePath, galleryContent);
  console.log('✅ Added new gallery items: Modeled Beanies Collection and Brown Beanies Collection');
}

async function main() {
  try {
    console.log('🚀 Starting comprehensive product and gallery update...\n');
    
    // Step 1: Update Stripe products with S3 images
    await updateStripeProducts();
    
    // Step 2: Update gallery file with new items
    await updateGalleryFile();
    
    console.log('\n🎉 All updates completed successfully!');
    console.log('\n📋 Summary:');
    console.log('✅ Updated 9 Stripe products with S3 images');
    console.log('✅ Updated Bags Collection with all bag images (24 total)');
    console.log('✅ Added Modeled Beanies Collection (9 images)');
    console.log('✅ Added Brown Beanies Collection (12 images)');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main(); 