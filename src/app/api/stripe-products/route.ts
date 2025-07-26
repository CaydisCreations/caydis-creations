import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET() {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-06-30.basil',
    });
    
    // Fetch all active products
    const products = await stripe.products.list({ active: true, limit: 100 });
    // Fetch all prices
    const prices = await stripe.prices.list({ active: true, limit: 100 });

    // Map prices by product id
    const priceMap: Record<string, Stripe.Price> = {};
    for (const price of prices.data) {
      if (typeof price.product === 'string') {
        priceMap[price.product] = price;
      }
    }

    // Combine product and price info
    const result = products.data.map(product => {
      const price = priceMap[product.id];
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.images && product.images.length > 0 ? product.images[0] : null,
        price: price ? (Number(price.unit_amount_decimal) / 100) : null,
        currency: price ? price.currency : null,
        priceId: price ? price.id : null,
        metadata: product.metadata,
      };
    });

    return NextResponse.json({ products: result });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch Stripe products', details: err }, { status: 500 });
  }
} 