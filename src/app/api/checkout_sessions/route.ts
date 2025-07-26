import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // Remove apiVersion to use the default for the installed package
  })
  
  const { items, address, selectedRate, couponId } = await req.json()
  try {
    // Try to find an existing customer by email
    let customer = null;
    if (address?.email) {
      const customers = await stripe.customers.list({ email: address.email, limit: 1 });
      if (customers.data.length > 0) {
        customer = customers.data[0];
        // Update the customer with the latest info
        await stripe.customers.update(customer.id, {
          name: address?.name,
          phone: address?.phone,
          address: {
            line1: address?.line1,
            line2: address?.line2,
            city: address?.city,
            state: address?.state,
            postal_code: address?.postal_code,
            country: address?.country,
          },
          shipping: {
            name: address?.name,
            phone: address?.phone,
            address: {
              line1: address?.line1,
              line2: address?.line2,
              city: address?.city,
              state: address?.state,
              postal_code: address?.postal_code,
              country: address?.country,
            },
          },
        });
      }
    }
    if (!customer) {
      // Create a new customer if none exists
      customer = await stripe.customers.create({
        name: address?.name,
        email: address?.email,
        phone: address?.phone,
        address: {
          line1: address?.line1,
          line2: address?.line2,
          city: address?.city,
          state: address?.state,
          postal_code: address?.postal_code,
          country: address?.country,
        },
        shipping: {
          name: address?.name,
          phone: address?.phone,
          address: {
            line1: address?.line1,
            line2: address?.line2,
            city: address?.city,
            state: address?.state,
            postal_code: address?.postal_code,
            country: address?.country,
          },
        },
      });
    }
    // Prepare line items: products + shipping
    const lineItems = [
      ...items.map((item: any) => ({
        price: item.priceId,
        quantity: item.quantity,
      })),
      selectedRate && {
        price_data: {
          currency: selectedRate.currency || 'usd',
          unit_amount: Math.round(Number(selectedRate.amount) * 100),
          product_data: {
            name: `Shipping (${selectedRate.provider} ${selectedRate.servicelevel?.name})`,
          },
        },
        quantity: 1,
      },
    ].filter(Boolean)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      customer: customer.id,
      ...(couponId && { discounts: [{ coupon: couponId }] }),
      shipping_address_collection: { allowed_countries: [
        'US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'JP', 'CN', 'IN', 'MX', 'BR', 'NL', 'SE', 'CH', 'IE', 'NZ', 'SG', 'KR', 'ZA', 'BE', 'DK', 'NO', 'FI', 'AT', 'PL', 'PT', 'RU', 'TR', 'IL', 'AE', 'AR', 'CL', 'CO', 'TH', 'MY', 'PH', 'ID', 'SA', 'EG', 'GR', 'CZ', 'HU', 'RO', 'SK', 'SI', 'HR', 'BG', 'EE', 'LV', 'LT', 'LU', 'MT', 'CY'
      ] },
      phone_number_collection: { enabled: true },
      success_url: `${req.nextUrl.origin}/success`,
      cancel_url: `${req.nextUrl.origin}/cancel`,
    })
    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
} 