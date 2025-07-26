import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// DELETE - Delete a coupon
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Coupon ID is required' }, { status: 400 });
    }

    await stripe.coupons.del(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 