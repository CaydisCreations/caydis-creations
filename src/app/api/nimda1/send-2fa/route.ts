import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Store 2FA codes in memory (in production, use Redis or database)
const twoFACodes = new Map<string, { code: string; expires: number; sentAt: number }>();

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

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

    // Generate random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = now + 10 * 60 * 1000; // 10 minutes
    const sentAt = now;

    // Store the new code (this will overwrite any existing code)
    twoFACodes.set(email, { code, expires, sentAt });

    console.log(`📧 Sending 2FA code ${code} to ${email} at ${new Date(sentAt).toISOString()}`);

    // Send email with the code
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4A3419; margin: 0;">🔐 Two-Factor Authentication</h1>
        </div>
        
        <div style="background: #FFF5E6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #4A3419; margin-top: 0;">Your Verification Code</h2>
          <p style="color: #666; margin-bottom: 20px;">
            You're trying to access the admin dashboard. Please use the following code to complete your login:
          </p>
          
          <div style="background: #4A3419; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="margin: 0; font-size: 32px; letter-spacing: 4px; font-family: monospace;">${code}</h1>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
          <p>Caydi's Creations Admin System</p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: 'Caydi\'s Creations <admin@caydiscreations.com>',
      to: email,
      subject: '🔐 Your Admin Access Code',
      html: emailHtml,
    });

    return NextResponse.json({ 
      success: true, 
      message: '2FA code sent to your email' 
    });

  } catch (error: any) {
    console.error('Error sending 2FA code:', error);
    return NextResponse.json({ 
      error: 'Failed to send 2FA code' 
    }, { status: 500 });
  }
}

// Export the twoFACodes map so it can be accessed by the verify endpoint
export { twoFACodes }; 