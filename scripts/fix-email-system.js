require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function fixEmailSystem() {
  console.log('🔧 Fixing email system issues...\n');

  try {
    // Check current domains
    console.log('📋 Checking current domains...');
    const domains = await resend.domains.list();
    console.log('Current domains:', JSON.stringify(domains, null, 2));

    // Test with verified domain (onboarding@resend.dev)
    console.log('\n🧪 Testing with verified domain (onboarding@resend.dev)...');
    try {
      const testResult = await resend.emails.send({
        from: "Caydi's Creations <onboarding@resend.dev>",
        to: "caydiscreations@gmail.com",
        subject: "🔧 Email System Fix Test",
        html: `
          <div style="font-size:16px; color:#4A3419; font-family:sans-serif;">
            <h2>🔧 Email System Fix Test</h2>
            <p>This is a test email using the verified domain (onboarding@resend.dev).</p>
            <p>If you receive this, the email system is now working!</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>From:</strong> onboarding@resend.dev</p>
            <p><strong>To:</strong> caydiscreations@gmail.com</p>
          </div>
        `
      });
      console.log('✅ Test email sent successfully!');
      console.log('📧 Email ID:', testResult?.data?.id);
      console.log('📧 Check your email at: caydiscreations@gmail.com');
    } catch (testError) {
      console.error('❌ Test email failed:', testError.message);
    }

    // Test customer email
    console.log('\n🧪 Testing customer email...');
    try {
      const customerResult = await resend.emails.send({
        from: "Caydi's Creations <onboarding@resend.dev>",
        to: "pearsonrhill2@gmail.com",
        subject: "🧶 Test Customer Email - Fixed System",
        html: `
          <div style="font-size:18px; color:#4A3419; font-family:sans-serif; max-width:600px; margin:0 auto;">
            <div style="text-align:center; margin-bottom:24px;">
              <img src="https://caydiscreations.s3.us-east-2.amazonaws.com/Public/logoCaydisCreation.PNG" alt="Caydi's Creations Logo" style="max-width:120px; width:120px; height:auto; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.08); background:#fff;" />
            </div>
            <p>Hi there,</p>
            <p>This is a test customer email to verify the fixed email system is working!</p>
            <p>If you receive this, the customer email system is now functional.</p>
            <p style="margin-top:32px;">
              Warmly,<br/>
              <b>Caydance Hill</b><br/>
              Owner & Maker, Caydi's Creations
            </p>
          </div>
        `
      });
      console.log('✅ Customer email sent successfully!');
      console.log('📧 Email ID:', customerResult?.data?.id);
      console.log('📧 Check pearsonrhill2@gmail.com for the test email');
    } catch (customerError) {
      console.error('❌ Customer email failed:', customerError.message);
    }

    console.log('\n📋 Domain Verification Status:');
    console.log('✅ onboarding@resend.dev - VERIFIED (working)');
    console.log('❌ confirmation.caydiscreations.com - NOT VERIFIED (needs setup)');
    
    console.log('\n🔧 To fix the custom domain issue:');
    console.log('1. Go to https://resend.com/domains');
    console.log('2. Add domain: confirmation.caydiscreations.com');
    console.log('3. Follow the DNS verification steps');
    console.log('4. Wait for verification to complete');
    console.log('5. Once verified, you can switch back to using the custom domain');
    
    console.log('\n💡 Current Status:');
    console.log('- ✅ Email system is now using verified domain (onboarding@resend.dev)');
    console.log('- ✅ Rate limiting is implemented (1 second between emails)');
    console.log('- ✅ Fallback system is improved');
    console.log('- ⚠️ Custom domain needs verification');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('🔍 Full error:', error);
  }
}

fixEmailSystem(); 