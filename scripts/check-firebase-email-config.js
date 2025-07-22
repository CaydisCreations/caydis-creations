require('dotenv').config({ path: '.env.local' });

function checkFirebaseEmailConfig() {
  console.log('🔍 Checking Firebase Email Configuration for Caydi\'s Creations\n');

  // Check environment variables
  console.log('📋 Firebase Project Configuration:');
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  
  if (projectId) {
    console.log(`  ✅ Project ID: ${projectId}`);
  } else {
    console.log('  ❌ Project ID: Missing');
  }
  
  if (authDomain) {
    console.log(`  ✅ Auth Domain: ${authDomain}`);
  } else {
    console.log('  ❌ Auth Domain: Missing');
  }

  console.log('\n🎯 Custom Domain Setup Status:');
  console.log('  📧 Custom Domain: confirmation.caydiscreations.com');
  console.log('  ✅ DNS Records: Added (as shown in your screenshot)');
  console.log('  ⏳ Verification: Pending (can take up to 48 hours)');

  console.log('\n🔧 Required Firebase Console Configuration:');
  console.log('1. Go to: https://console.firebase.google.com');
  console.log(`2. Select project: ${projectId || 'caydiscreations'}`);
  console.log('3. Go to: Authentication → Settings → Authorized domains');
  console.log('4. Add: caydiscreations.com');
  console.log('5. Go to: Authentication → Templates');
  console.log('6. Update Email verification template:');
  console.log('   - Sender email: noreply@confirmation.caydiscreations.com');
  console.log('   - Subject: Verify your email for Caydi\'s Creations');
  console.log('7. Update Password reset template:');
  console.log('   - Sender email: noreply@confirmation.caydiscreations.com');
  console.log('   - Subject: Reset your password for Caydi\'s Creations');

  console.log('\n📧 Current Email Flow:');
  console.log('1. User clicks "Verify Email" or "Reset Password"');
  console.log('2. Code calls Firebase sendEmailVerification() or sendPasswordResetEmail()');
  console.log('3. Firebase sends email from configured sender in Firebase Console');
  console.log('4. User receives email from noreply@confirmation.caydiscreations.com');

  console.log('\n⚠️  Important Notes:');
  console.log('- The custom domain must be verified in Firebase Console');
  console.log('- DNS verification can take up to 48 hours');
  console.log('- Emails will still send from Firebase\'s default sender until custom domain is verified');
  console.log('- Check spam/junk folders for emails');

  console.log('\n🧪 Testing Steps:');
  console.log('1. Wait for DNS verification to complete (check Firebase Console)');
  console.log('2. Update email templates in Firebase Console');
  console.log('3. Test email verification on your website');
  console.log('4. Check browser console (F12) for logs');
  console.log('5. Check email inbox and spam folder');

  console.log('\n📞 If emails still don\'t send:');
  console.log('1. Check Firebase Console for any error messages');
  console.log('2. Verify DNS records are properly configured');
  console.log('3. Check Firebase project quotas and limits');
  console.log('4. Ensure domain verification is complete');

  console.log('\n🎉 Configuration check complete!');
}

checkFirebaseEmailConfig(); 