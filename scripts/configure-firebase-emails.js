const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin SDK
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

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

async function configureFirebaseEmails() {
  try {
    console.log('🔧 Configuring Firebase Authentication email settings...\n');

    // Configure email templates
    const emailTemplates = {
      // Email verification template
      verifyEmail: {
        subject: 'Verify your email for Caydi\'s Creations',
        htmlBody: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FFF5E6;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="https://caydiscreations.com/logoCaydisCreation.PNG" alt="Caydi's Creations" style="width: 80px; height: 80px; border-radius: 50%;">
              <h1 style="color: #4A3419; margin: 20px 0;">Welcome to Caydi's Creations!</h1>
            </div>
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #4A3419; margin-bottom: 20px;">Verify Your Email Address</h2>
              <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
                Thank you for signing up with Caydi's Creations! To complete your registration and start shopping our handmade crochet creations, please verify your email address by clicking the button below.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{LINK}}" style="background-color: #4A3419; color: #FFF5E6; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Verify Email Address
                </a>
              </div>
              <p style="color: #666; font-size: 14px; margin-top: 25px;">
                If the button doesn't work, you can copy and paste this link into your browser:<br>
                <a href="{{LINK}}" style="color: #4A3419;">{{LINK}}</a>
              </p>
              <hr style="border: none; border-top: 1px solid #E8C39E; margin: 30px 0;">
              <p style="color: #999; font-size: 12px; text-align: center;">
                This email was sent from <strong>noreply@caydiscreations.com</strong><br>
                If you didn't create an account with Caydi's Creations, you can safely ignore this email.
              </p>
            </div>
          </div>
        `,
        actionCodeSettings: {
          url: 'https://caydiscreations.com/account',
          handleCodeInApp: false,
        }
      },
      
      // Password reset template
      resetPassword: {
        subject: 'Reset your password for Caydi\'s Creations',
        htmlBody: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FFF5E6;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="https://caydiscreations.com/logoCaydisCreation.PNG" alt="Caydi's Creations" style="width: 80px; height: 80px; border-radius: 50%;">
              <h1 style="color: #4A3419; margin: 20px 0;">Password Reset Request</h1>
            </div>
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #4A3419; margin-bottom: 20px;">Reset Your Password</h2>
              <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
                We received a request to reset your password for your Caydi's Creations account. Click the button below to create a new password.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{LINK}}" style="background-color: #4A3419; color: #FFF5E6; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Reset Password
                </a>
              </div>
              <p style="color: #666; font-size: 14px; margin-top: 25px;">
                If the button doesn't work, you can copy and paste this link into your browser:<br>
                <a href="{{LINK}}" style="color: #4A3419;">{{LINK}}</a>
              </p>
              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                <strong>Security Note:</strong> This link will expire in 1 hour for your security. If you didn't request a password reset, you can safely ignore this email.
              </p>
              <hr style="border: none; border-top: 1px solid #E8C39E; margin: 30px 0;">
              <p style="color: #999; font-size: 12px; text-align: center;">
                This email was sent from <strong>noreply@caydiscreations.com</strong><br>
                If you didn't request a password reset, please contact our support team.
              </p>
            </div>
          </div>
        `,
        actionCodeSettings: {
          url: 'https://caydiscreations.com/reset-password',
          handleCodeInApp: false,
        }
      }
    };

    // Update email templates
    for (const [templateType, template] of Object.entries(emailTemplates)) {
      try {
        await admin.auth().updateTemplate(templateType, {
          subject: template.subject,
          htmlBody: template.htmlBody,
          actionCodeSettings: template.actionCodeSettings,
        });
        console.log(`✅ Updated ${templateType} template`);
      } catch (error) {
        console.log(`⚠️  Could not update ${templateType} template:`, error.message);
      }
    }

    // Configure authorized domains
    try {
      const authorizedDomains = await admin.auth().listAuthorizedDomains();
      console.log('\n📋 Current authorized domains:');
      authorizedDomains.domains.forEach(domain => {
        console.log(`  - ${domain.domain}`);
      });
      
      // Add your custom domain if not already present
      const customDomain = 'caydiscreations.com';
      if (!authorizedDomains.domains.find(d => d.domain === customDomain)) {
        console.log(`\n➕ Adding ${customDomain} to authorized domains...`);
        // Note: This requires Firebase CLI or manual setup in Firebase Console
        console.log('💡 Please add caydiscreations.com to authorized domains in Firebase Console');
      }
    } catch (error) {
      console.log('⚠️  Could not check authorized domains:', error.message);
    }

    console.log('\n🎉 Email configuration complete!');
    console.log('\n📧 Next steps:');
    console.log('1. Go to Firebase Console > Authentication > Settings > Authorized domains');
    console.log('2. Add "caydiscreations.com" to the list');
    console.log('3. Test email verification and password reset functionality');
    console.log('4. Check spam folders if emails don\'t arrive');

  } catch (error) {
    console.error('❌ Error configuring Firebase emails:', error);
    console.log('\n💡 Manual setup required:');
    console.log('1. Go to Firebase Console > Authentication > Templates');
    console.log('2. Update Email verification and Password reset templates');
    console.log('3. Set sender email to noreply@caydiscreations.com');
    console.log('4. Add caydiscreations.com to authorized domains');
  }
}

configureFirebaseEmails(); 