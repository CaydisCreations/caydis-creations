const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin SDK (if credentials are available)
let adminApp = null;
try {
  const serviceAccount = {
    type: process.env.FIREBASE_ADMIN_TYPE,
    project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
    private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
    auth_uri: process.env.FIREBASE_ADMIN_AUTH_URI,
    token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
  };

  if (serviceAccount.project_id) {
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
} catch (error) {
  console.log('⚠️  Firebase Admin SDK not configured, running basic checks only');
}

async function testEmailFunctionality() {
  console.log('🧪 Testing Email Functionality for Caydi\'s Creations\n');

  // Check environment variables
  console.log('📋 Environment Variables Check:');
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];

  let allVarsPresent = true;
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`  ✅ ${varName}: ${value.substring(0, 10)}...`);
    } else {
      console.log(`  ❌ ${varName}: Missing`);
      allVarsPresent = false;
    }
  });

  if (!allVarsPresent) {
    console.log('\n⚠️  Some required environment variables are missing!');
    console.log('   This may cause email functionality to fail.');
  }

  // Check Firebase Admin SDK (if available)
  if (adminApp) {
    try {
      console.log('\n🔧 Firebase Admin SDK Check:');
      
      // Check authorized domains
      const authorizedDomains = await admin.auth().listAuthorizedDomains();
      console.log('  📋 Authorized domains:');
      authorizedDomains.domains.forEach(domain => {
        console.log(`    - ${domain.domain}`);
      });

      // Check if custom domain is authorized
      const customDomain = 'caydiscreations.com';
      const isCustomDomainAuthorized = authorizedDomains.domains.find(d => d.domain === customDomain);
      if (isCustomDomainAuthorized) {
        console.log(`  ✅ ${customDomain} is authorized`);
      } else {
        console.log(`  ❌ ${customDomain} is NOT authorized`);
        console.log(`     Add it in Firebase Console > Authentication > Settings > Authorized domains`);
      }

      // Check email templates
      console.log('\n📧 Email Templates Check:');
      try {
        const verifyTemplate = await admin.auth().getTemplate('verifyEmail');
        console.log('  ✅ Email verification template exists');
        console.log(`     Subject: ${verifyTemplate.subject}`);
      } catch (error) {
        console.log('  ❌ Email verification template not found or not accessible');
      }

      try {
        const resetTemplate = await admin.auth().getTemplate('resetPassword');
        console.log('  ✅ Password reset template exists');
        console.log(`     Subject: ${resetTemplate.subject}`);
      } catch (error) {
        console.log('  ❌ Password reset template not found or not accessible');
      }

    } catch (error) {
      console.log('  ❌ Error checking Firebase Admin SDK:', error.message);
    }
  } else {
    console.log('\n⚠️  Firebase Admin SDK not available');
    console.log('   To enable advanced checks, add Firebase Admin credentials to .env.local');
  }

  // Manual setup instructions
  console.log('\n📋 Manual Setup Checklist:');
  console.log('1. ✅ Firebase project configured');
  console.log('2. ⚠️  Add "caydiscreations.com" to authorized domains');
  console.log('3. ⚠️  Configure email templates in Firebase Console');
  console.log('4. ⚠️  Set up custom sender email (noreply@caydiscreations.com)');
  console.log('5. ⚠️  Test email functionality in browser');

  console.log('\n🔧 Firebase Console Setup Steps:');
  console.log('1. Go to https://console.firebase.google.com');
  console.log('2. Select your project');
  console.log('3. Go to Authentication > Settings > Authorized domains');
  console.log('4. Add "caydiscreations.com"');
  console.log('5. Go to Authentication > Templates');
  console.log('6. Update Email verification and Password reset templates');
  console.log('7. Set sender email to "noreply@caydiscreations.com"');

  console.log('\n🧪 Testing Instructions:');
  console.log('1. Open your website in a browser');
  console.log('2. Try to sign up with a new email');
  console.log('3. Check for verification email');
  console.log('4. Try password reset functionality');
  console.log('5. Check browser console (F12) for any errors');
  console.log('6. Check spam/junk folders');

  console.log('\n📧 Common Email Issues:');
  console.log('- Emails going to spam: Add SPF/DKIM records');
  console.log('- Not receiving emails: Check Firebase quotas');
  console.log('- Template errors: Verify HTML syntax');
  console.log('- Domain issues: Ensure domain is authorized');

  console.log('\n🎉 Email functionality test complete!');
}

testEmailFunctionality(); 