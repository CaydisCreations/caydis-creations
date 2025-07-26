import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
    const body = await req.json();
    const { email, create, name, phone, address } = body;
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });
    if (create) {
      // Create a new Stripe customer
      const customer = await stripe.customers.create({
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
      });
      return NextResponse.json({ customer });
    }
    // Fetch existing customer by email
    const customers = await stripe.customers.list({ email, limit: 1 });
    if (customers.data.length === 0) {
      return NextResponse.json({ customer: null });
    }
    const customer = customers.data[0];
    return NextResponse.json({ customer });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 