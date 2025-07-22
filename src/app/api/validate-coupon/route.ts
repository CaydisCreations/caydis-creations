import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { couponCode } = await req.json();
    
    if (!couponCode) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    // Try to retrieve the coupon from Stripe
    const coupon = await stripe.coupons.retrieve(couponCode);
    
    // Check if coupon is valid
    if (!coupon.valid) {
      return NextResponse.json({ 
        error: 'This coupon is no longer valid',
        valid: false 
      }, { status: 400 });
    }

    // Check if coupon has expired
    if (coupon.redeem_by && coupon.redeem_by < Math.floor(Date.now() / 1000)) {
      return NextResponse.json({ 
        error: 'This coupon has expired',
        valid: false 
      }, { status: 400 });
    }

    // Check if coupon has reached its maximum redemptions
    if (coupon.max_redemptions && coupon.times_redeemed >= coupon.max_redemptions) {
      return NextResponse.json({ 
        error: 'This coupon has reached its maximum usage limit',
        valid: false 
      }, { status: 400 });
    }

    // Return coupon details
    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        name: coupon.name,
        percent_off: coupon.percent_off,
        amount_off: coupon.amount_off,
        currency: coupon.currency,
        duration: coupon.duration,
        duration_in_months: coupon.duration_in_months,
        max_redemptions: coupon.max_redemptions,
        times_redeemed: coupon.times_redeemed,
        redeem_by: coupon.redeem_by,
      }
    });

  } catch (err: any) {
    if (err.type === 'StripeInvalidRequestError') {
      return NextResponse.json({ 
        error: 'Invalid coupon code',
        valid: false 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to validate coupon',
      valid: false 
    }, { status: 500 });
  }
} 