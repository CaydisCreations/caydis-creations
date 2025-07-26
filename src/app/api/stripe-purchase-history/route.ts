import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(req: NextRequest) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
    const { searchParams } = new URL(req.url!);
    const customerId = searchParams.get('customerId');
    if (!customerId) {
      return NextResponse.json({ error: 'customerId required' }, { status: 400 });
    }
    const sessions = await stripe.checkout.sessions.list({ customer: customerId, limit: 20, expand: ['data.line_items'] });
    return NextResponse.json({ history: sessions.data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 