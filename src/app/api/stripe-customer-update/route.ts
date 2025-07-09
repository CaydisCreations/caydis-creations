import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { id, name, email, phone, address } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing customer id' }, { status: 400 });
    const update: Stripe.CustomerUpdateParams = {
      name,
      email,
      phone,
      shipping: address && address.line1 ? {
        name: name || undefined,
        address: {
          line1: address.line1,
          line2: address.line2 || undefined,
          city: address.city,
          state: address.state,
          postal_code: address.postal_code,
          country: address.country,
        },
      } : undefined,
    };
    const customer = await stripe.customers.update(id, update);
    return NextResponse.json({ customer });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update customer' }, { status: 500 });
  }
} 