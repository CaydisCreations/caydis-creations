const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const BUCKET_NAME = 'caydiscreations';
const AWS_REGION = 'us-east-2';

console.log('🔄 Starting S3 folder reorganization and image uploads...\n');

async function runCommand(command) {
  try {
    console.log(`📋 Running: ${command}`);
    const result = execSync(command, { encoding: 'utf8' });
    console.log('✅ Success');
    return result;
  } catch (error) {
    console.error(`❌ Error running command: ${command}`);
    console.error(error.message);
    throw error;
  }
}

async function uploadFile(localPath, s3Path) {
  const command = `aws s3 cp "${localPath}" "s3://${BUCKET_NAME}/${s3Path}" --region ${AWS_REGION}`;
  return runCommand(command);
}

async function createFolder(folderPath) {
  const command = `aws s3api put-object --bucket ${BUCKET_NAME} --key "${folderPath}/" --region ${AWS_REGION}`;
  return runCommand(command);
}

async function moveFolder(sourcePath, destinationPath) {
  // First, copy all objects from source to destination
  const copyCommand = `aws s3 cp "s3://${BUCKET_NAME}/${sourcePath}" "s3://${BUCKET_NAME}/${destinationPath}" --recursive --region ${AWS_REGION}`;
  await runCommand(copyCommand);
  
  // Then delete the source folder
  const deleteCommand = `aws s3 rm "s3://${BUCKET_NAME}/${sourcePath}" --recursive --region ${AWS_REGION}`;
  await runCommand(deleteCommand);
}

async function main() {
  try {
    console.log('📁 Step 1: Creating Public/Blankets folder...');
    await createFolder('Public/Blankets');
    
    console.log('📁 Step 2: Moving blanket_squares_pink_purple_white folder...');
    await moveFolder('Public/blanket_squares_pink_purple_white', 'Public/Blankets/blanket_squares_pink_purple_white');
    
    console.log('📁 Step 3: Creating Public/Blankets/HeavyMultiColored folder...');
    await createFolder('Public/Blankets/HeavyMultiColored');
    
    console.log('📁 Step 4: Uploading HeavyMultiColored blanket images...');
    const heavyMultiColoredImages = [
      '/Users/phill/Downloads/drive-download-20250731T220601Z-1-001/FullSizeRender 2.jpeg',
      '/Users/phill/Downloads/drive-download-20250731T220601Z-1-001/FullSizeRender 3.jpeg'
    ];
    
    for (const imagePath of heavyMultiColoredImages) {
      const fileName = path.basename(imagePath);
      const s3Path = `Public/Blankets/HeavyMultiColored/${fileName}`;
      await uploadFile(imagePath, s3Path);
      console.log(`✅ Uploaded: ${fileName}`);
    }
    
    console.log('📁 Step 5: Creating Public/Scarves folder structure...');
    await createFolder('Public/Scarves');
    await createFolder('Public/Scarves/Solid_white');
    await createFolder('Public/Scarves/Solid_white/Modeled');
    await createFolder('Public/Scarves/Solid_green');
    await createFolder('Public/Scarves/Solid_green/Modeled');
    await createFolder('Public/Scarves/green_white');
    await createFolder('Public/Scarves/green_white/Modeled');
    
    console.log('📁 Step 6: Uploading Solid_white scarf images...');
    const solidWhiteImages = [
      '/Users/phill/Downloads/drive-download-20250731T220610Z-1-001/IMG_6236.jpeg',
      '/Users/phill/Downloads/drive-download-20250731T220610Z-1-001/IMG_6240.jpeg',
      '/Users/phill/Downloads/drive-download-20250731T220610Z-1-001/IMG_6248.jpeg',
      '/Users/phill/Downloads/drive-download-20250731T220610Z-1-001/IMG_6251.jpeg'
    ];
    
    for (const imagePath of solidWhiteImages) {
      const fileName = path.basename(imagePath);
      const s3Path = `Public/Scarves/Solid_white/Modeled/${fileName}`;
      await uploadFile(imagePath, s3Path);
      console.log(`✅ Uploaded: ${fileName}`);
    }
    
    console.log('📁 Step 7: Uploading Solid_green scarf images...');
    const solidGreenImages = [
      '/Users/phill/Downloads/drive-download-20250731T220610Z-1-001/IMG_6293.jpeg',
      '/Users/phill/Downloads/drive-download-20250731T220610Z-1-001/IMG_6295.jpeg',
      '/Users/phill/Downloads/drive-download-20250731T220610Z-1-001/IMG_6299.jpeg',
      '/Users/phill/Downloads/drive-download-20250731T220610Z-1-001/IMG_6302.jpeg',
      '/Users/phill/Downloads/drive-download-20250731T220610Z-1-001/IMG_6317.jpeg'
    ];
    
    for (const imagePath of solidGreenImages) {
      const fileName = path.basename(imagePath);
      const s3Path = `Public/Scarves/Solid_green/Modeled/${fileName}`;
      await uploadFile(imagePath, s3Path);
      console.log(`✅ Uploaded: ${fileName}`);
    }
    
    console.log('📁 Step 8: Uploading green_white scarf images...');
    const greenWhiteImages = [
      '/Users/phill/Downloads/drive-download-20250731T220610Z-1-001/IMG_6260.jpeg',
      '/Users/phill/Downloads/drive-download-20250731T220610Z-1-001/IMG_6280.jpeg',
      '/Users/phill/Downloads/drive-download-20250731T220610Z-1-001/IMG_6281.jpeg'
    ];
    
    for (const imagePath of greenWhiteImages) {
      const fileName = path.basename(imagePath);
      const s3Path = `Public/Scarves/green_white/Modeled/${fileName}`;
      await uploadFile(imagePath, s3Path);
      console.log(`✅ Uploaded: ${fileName}`);
    }
    
    console.log('\n🎉 S3 folder reorganization and image uploads completed successfully!');
    console.log('\n📋 Summary of changes:');
    console.log('✅ Created: Public/Blankets/');
    console.log('✅ Moved: blanket_squares_pink_purple_white/ → Public/Blankets/');
    console.log('✅ Created: Public/Blankets/HeavyMultiColored/');
    console.log('✅ Uploaded: 2 HeavyMultiColored blanket images');
    console.log('✅ Created: Public/Scarves/ folder structure');
    console.log('✅ Uploaded: 4 Solid_white scarf images');
    console.log('✅ Uploaded: 5 Solid_green scarf images');
    console.log('✅ Uploaded: 3 green_white scarf images');
    
  } catch (error) {
    console.error('❌ Error during S3 operations:', error);
    process.exit(1);
  }
}

main(); 