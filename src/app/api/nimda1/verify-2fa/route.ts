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

    // Get stored code
    const storedData = twoFACodes.get(email);
    
    if (!storedData) {
      return NextResponse.json({ error: 'No 2FA code found. Please request a new code.' }, { status: 400 });
    }

    // Check if code has expired
    if (Date.now() > storedData.expires) {
      twoFACodes.delete(email);
      return NextResponse.json({ error: '2FA code has expired. Please request a new code.' }, { status: 400 });
    }

    // Verify the code
    if (storedData.code !== code) {
      return NextResponse.json({ error: 'Invalid 2FA code' }, { status: 400 });
    }

    // Code is valid - remove it from storage
    twoFACodes.delete(email);

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