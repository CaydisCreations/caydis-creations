require('dotenv').config({ path: '.env.local' });

async function testReal2FA() {
  console.log('🔐 Testing Real 2FA System...\n');

  // Test 1: Send 2FA code
  console.log('1. Testing 2FA code sending...');
  try {
    const response = await fetch('http://localhost:3000/api/nimda1/send-2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'caydiscreations@gmail.com' }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ 2FA code sent successfully');
      console.log('📧 Check your email for the verification code');
    } else {
      const error = await response.json();
      console.log('❌ Failed to send 2FA code:', error.error);
    }
  } catch (error) {
    console.log('❌ Error sending 2FA code:', error.message);
  }

  // Test 2: Try with unauthorized email
  console.log('\n2. Testing unauthorized email...');
  try {
    const response = await fetch('http://localhost:3000/api/nimda1/send-2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'unauthorized@example.com' }),
    });

    if (response.status === 403) {
      console.log('✅ Unauthorized email properly blocked');
    } else {
      console.log('⚠️ Unauthorized email test returned status:', response.status);
    }
  } catch (error) {
    console.log('❌ Error testing unauthorized email:', error.message);
  }

  console.log('\n🎉 Real 2FA System Test Complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Check your email for the 2FA code');
  console.log('2. Visit http://localhost:3000/nimda1/auth');
  console.log('3. Sign in with your Firebase credentials');
  console.log('4. Enter the code from your email');
  console.log('5. Verify you can access the dashboard');
}

testReal2FA(); 