import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET() {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-06-30.basil',
    });
    
    // Fetch all active products with their default prices expanded
    const products = await stripe.products.list({ 
      active: true, 
      limit: 100,
      expand: ['data.default_price']
    });

    // Combine product and price info
    const result = products.data.map(product => {
      const price = product.default_price as Stripe.Price | null;
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.images && product.images.length > 0 ? product.images[0] : null,
        images: product.images && product.images.length > 0 ? product.images : null,
        price: price ? (Number(price.unit_amount_decimal) / 100) : null,
        currency: price ? price.currency : null,
        priceId: price ? price.id : null,
        metadata: product.metadata,
      };
    });

    // Sort products by display_order if available, otherwise by creation date
    result.sort((a, b) => {
      const orderA = a.metadata?.display_order ? parseInt(a.metadata.display_order) : 999;
      const orderB = b.metadata?.display_order ? parseInt(b.metadata.display_order) : 999;
      
      if (orderA !== 999 || orderB !== 999) {
        return orderA - orderB;
      }
      
      // Fallback to creation date if no display_order
      return 0;
    });

    return NextResponse.json({ products: result });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch Stripe products', details: err }, { status: 500 });
  }
}
