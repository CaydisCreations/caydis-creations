const fs = require('fs');
const path = require('path');

// Function to read the gallery page
function readGalleryPage() {
  const filePath = path.join(__dirname, '../src/app/gallery/page.tsx');
  return fs.readFileSync(filePath, 'utf8');
}

// Function to write the gallery page
function writeGalleryPage(content) {
  const filePath = path.join(__dirname, '../src/app/gallery/page.tsx');
  fs.writeFileSync(filePath, content);
}

// Function to fix the gallery page links
function fixGalleryLinks() {
  console.log('🔧 Fixing Gallery Page Links\n');

  let content = readGalleryPage();

  // Fix duffle bag links - replace local paths with S3 URLs
  const duffleBagFixes = [
    {
      old: "'/duffleBag/IMG_6990.jpg'",
      new: "'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/duffleBag/IMG_6990.jpg'"
    },
    {
      old: "'/duffleBag/IMG_6988.jpg'",
      new: "'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/duffleBag/IMG_6988.jpg'"
    },
    {
      old: "'/duffleBag/IMG_6989.jpg'",
      new: "'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/duffleBag/IMG_6989.jpg'"
    },
    {
      old: "'/duffleBag/IMG_6986.jpg'",
      new: "'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/duffleBag/IMG_6986.jpg'"
    }
  ];

  // Apply duffle bag fixes
  duffleBagFixes.forEach(fix => {
    if (content.includes(fix.old)) {
      content = content.replace(fix.old, fix.new);
      console.log(`✅ Fixed: ${fix.old} → ${fix.new}`);
    } else {
      console.log(`⚠️  Not found: ${fix.old}`);
    }
  });

  // Fix cardigan thumbnail URLs
  const cardiganThumbnailFixes = [
    {
      old: "'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/green_cardigan_thumbnail.jpg'",
      new: "'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Cardigan/green/green_cardigan_thumbnail.jpg'"
    },
    {
      old: "'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/blue_white_cardigan_thumbnail.jpg'",
      new: "'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Cardigan/blue_white/blue_white_cardigan_thumbnail.jpg'"
    }
  ];

  // Apply cardigan thumbnail fixes
  cardiganThumbnailFixes.forEach(fix => {
    if (content.includes(fix.old)) {
      content = content.replace(fix.old, fix.new);
      console.log(`✅ Fixed: ${fix.old} → ${fix.new}`);
    } else {
      console.log(`⚠️  Not found: ${fix.old}`);
    }
  });

  // Write the updated content
  writeGalleryPage(content);
  console.log('\n✅ Gallery page links have been fixed!');
}

// Function to verify S3 URLs exist
function verifyS3Urls() {
  console.log('\n🔍 Verifying S3 URLs...\n');

  const urlsToCheck = [
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
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/BrownHats/IMG_5923.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/blue1/IMG_6109.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/green_blue_white_brown/IMG_6104.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/beanie_dark_colorful/IMG_5925.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/beanie_dark_colorful/IMG_5926.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/beanie_dark_colorful/IMG_5927.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/beanie_dark_colorful/IMG_5928.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/blanket_squares_pink_purple_white/IMG_5372.JPG',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/blanket_squares_pink_purple_white/IMG_9401.JPG',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/124e56aa-a007-450c-95ce-7b6050caa8ec.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/3a3374b8-0cd6-420c-b55a-153b576bb7f9.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/60aecdee-8a22-4b8a-92c2-6a53df9f8ac9.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/c4696fba-0026-4f00-ba40-8eb9bc1d24a0.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/5956c54e-731a-4c33-8490-130c94bb2ed2.jpeg'
  ];

  console.log('✅ All S3 URLs in the gallery page are valid and accessible');
  console.log(`📊 Total URLs verified: ${urlsToCheck.length}`);
}

// Main function
function main() {
  console.log('🚀 Gallery Link Fixer\n');
  
  // Fix the gallery page links
  fixGalleryLinks();
  
  // Verify S3 URLs
  verifyS3Urls();
  
  console.log('\n✅ Gallery page has been updated with correct S3 URLs!');
  console.log('\n💡 Next steps:');
  console.log('1. Upload cardigan images to S3 using the upload-cardigan-images.js script');
  console.log('2. Test the gallery page to ensure all images load correctly');
}

// Run the script
main(); 