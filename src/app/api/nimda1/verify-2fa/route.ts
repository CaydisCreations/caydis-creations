import { NextRequest, NextResponse } from 'next/server';
import { twoFACodes } from '../send-2fa/route';

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    // Only allow 2FA for authorized emails
    const authorizedEmails = ['caydiscreations@gmail.com'];
    if (!authorizedEmails.includes(email)) {
      return NextResponse.json({ error: 'Unauthorized email' }, { status: 403 });
    }

    // Clean up expired codes first
    const now = Date.now();
    for (const [storedEmail, data] of twoFACodes.entries()) {
      if (now > data.expires) {
        twoFACodes.delete(storedEmail);
      }
    }

    // Get stored code
    const storedData = twoFACodes.get(email);
    
    if (!storedData) {
      return NextResponse.json({ error: 'No 2FA code found. Please request a new code.' }, { status: 400 });
    }

    // Check if code has expired
    if (now > storedData.expires) {
      twoFACodes.delete(email);
      return NextResponse.json({ error: '2FA code has expired. Please request a new code.' }, { status: 400 });
    }

    // Verify the code
    if (storedData.code !== code) {
      console.log(`❌ Invalid 2FA code attempt: ${code} (expected: ${storedData.code})`);
      return NextResponse.json({ error: 'Invalid 2FA code' }, { status: 400 });
    }

    // Code is valid - remove it from storage and log success
    twoFACodes.delete(email);
    console.log(`✅ 2FA verification successful for ${email} with code ${code}`);

    return NextResponse.json({ 
      success: true, 
      message: '2FA verification successful' 
    });

  } catch (error: any) {
    console.error('Error verifying 2FA code:', error);
    return NextResponse.json({ 
      error: 'Failed to verify 2FA code' 
    }, { status: 500 });
  }
} 