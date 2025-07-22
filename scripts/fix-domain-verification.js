require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function fixDomainVerification() {
  console.log('🔧 Fixing Domain Verification Issue\n');

  try {
    // Check current domains
    console.log('📋 Current Domain Status:');
    const domains = await resend.domains.list();
    console.log('Domains:', JSON.stringify(domains, null, 2));

    // Test the custom domain directly
    console.log('\n🧪 Testing custom domain directly...');
    try {
      const testResult = await resend.emails.send({
        from: "Caydi's Creations <no-reply@confirmation.caydiscreations.com>",
        to: "caydiscreations@gmail.com",
        subject: "🔧 Domain Verification Test",
        html: `
          <div style="font-size:16px; color:#4A3419; font-family:sans-serif;">
            <h2>🔧 Domain Verification Test</h2>
            <p>This is a test to verify the custom domain is working.</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>From:</strong> no-reply@confirmation.caydiscreations.com</p>
            <p><strong>To:</strong> caydiscreations@gmail.com</p>
            <p>✅ If you receive this, the custom domain is working!</p>
          </div>
        `
      });
      console.log('✅ Custom domain test successful!');
      console.log('📧 Email ID:', testResult?.data?.id);
    } catch (testError) {
      console.error('❌ Custom domain test failed:', testError.message);
    }

    console.log('\n🎯 The Problem:');
    console.log('The domain shows as "verified" in the API, but Resend is still rejecting it.');
    console.log('This suggests a DNS propagation issue or incomplete verification.');

    console.log('\n🔧 Solutions to Try:');
    console.log('1. **Wait for DNS propagation** (can take up to 48 hours)');
    console.log('2. **Re-verify the domain** in Resend dashboard');
    console.log('3. **Check DNS records** are correct');
    console.log('4. **Contact Resend support** if the issue persists');

    console.log('\n📋 DNS Records to Check:');
    console.log('- Go to your domain registrar (where you bought caydiscreations.com)');
    console.log('- Look for DNS records for confirmation.caydiscreations.com');
    console.log('- Should have CNAME or A records pointing to Resend');

    console.log('\n🔄 Re-verification Steps:');
    console.log('1. Go to: https://resend.com/domains');
    console.log('2. Find confirmation.caydiscreations.com');
    console.log('3. Click "Re-verify" or "Check Status"');
    console.log('4. Wait for verification to complete');

    console.log('\n💡 Alternative Solution:');
    console.log('If the domain continues to have issues, you can:');
    console.log('1. Use a different subdomain (e.g., mail.caydiscreations.com)');
    console.log('2. Contact Resend support for manual verification');
    console.log('3. Use the onboarding@resend.dev domain temporarily');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixDomainVerification(); 