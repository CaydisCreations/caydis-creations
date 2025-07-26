import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// GET - List all coupons
export async function GET() {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const coupons = await stripe.coupons.list({ limit: 100 });
    
    return NextResponse.json({
      coupons: coupons.data.map(coupon => ({
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
        valid: coupon.valid,
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create a new coupon
export async function POST(req: NextRequest) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const body = await req.json();
    const {
      id,
      name,
      percent_off,
      amount_off,
      currency,
      duration,
      max_redemptions,
      redeem_by,
    } = body;

    if (!id || !name) {
      return NextResponse.json({ error: 'ID and name are required' }, { status: 400 });
    }

    if (!percent_off && !amount_off) {
      return NextResponse.json({ error: 'Either percent_off or amount_off is required' }, { status: 400 });
    }

    const couponData: any = {
      id,
      name,
      duration,
    };

    if (percent_off) {
      couponData.percent_off = parseInt(percent_off);
    } else if (amount_off) {
      couponData.amount_off = parseInt(amount_off);
      couponData.currency = currency || 'usd';
    }

    if (max_redemptions) {
      couponData.max_redemptions = parseInt(max_redemptions);
    }

    if (redeem_by) {
      // Convert date string to timestamp
      couponData.redeem_by = Math.floor(new Date(redeem_by).getTime() / 1000);
    }

    const coupon = await stripe.coupons.create(couponData);

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        name: coupon.name,
        percent_off: coupon.percent_off,
        amount_off: coupon.amount_off,
        currency: coupon.currency,
        duration: coupon.duration,
        max_redemptions: coupon.max_redemptions,
        times_redeemed: coupon.times_redeemed,
        redeem_by: coupon.redeem_by,
        valid: coupon.valid,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 