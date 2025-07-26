const fetch = require('node-fetch');

async function test2FAVerification() {
  console.log('🧪 Testing 2FA Verification System...\n');

  try {
    // First, send a 2FA code
    console.log('📧 Sending 2FA code...');
    const sendResponse = await fetch('http://localhost:3000/api/nimda1/send-2fa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'caydiscreations@gmail.com'
      }),
    });

    if (!sendResponse.ok) {
      console.log('❌ Failed to send 2FA code');
      return;
    }

    console.log('✅ 2FA code sent successfully!');
    console.log('📧 Check your email for the code, then enter it below:');
    
    // Wait for user input (in a real test, you'd get the code from the email)
    console.log('\n🔍 To test verification:');
    console.log('1. Check your email for the 6-digit code');
    console.log('2. Run: node scripts/test-2fa-verification.js <CODE>');
    console.log('3. Or test with invalid code: node scripts/test-2fa-verification.js 123456');

  } catch (error) {
    console.error('❌ Error testing 2FA:', error);
  }
}

// If a code is provided as argument, test verification
async function testCodeVerification(code) {
  console.log(`🔐 Testing verification with code: ${code}`);
  
  try {
    const verifyResponse = await fetch('http://localhost:3000/api/nimda1/verify-2fa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'caydiscreations@gmail.com',
        code: code
      }),
    });

    const verifyResult = await verifyResponse.json();
    console.log('Verify Response:', verifyResult);

    if (verifyResponse.ok) {
      console.log('✅ 2FA verification successful!');
    } else {
      console.log('❌ 2FA verification failed:', verifyResult.error);
    }

  } catch (error) {
    console.error('❌ Error verifying 2FA code:', error);
  }
}

// Check if code is provided as argument
const code = process.argv[2];

if (code) {
  testCodeVerification(code);
} else {
  test2FAVerification();
} 