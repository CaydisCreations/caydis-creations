import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
    const { cartItems } = await req.json();
    console.log('cart-parcel-info: incoming cartItems:', cartItems);
    if (!Array.isArray(cartItems)) {
      console.error('cart-parcel-info: cartItems missing or not an array');
      return NextResponse.json({ error: 'cartItems missing or not an array' }, { status: 400 });
    }
    const enriched = await Promise.all(cartItems.map(async (item: any) => {
      try {
        const product = await stripe.products.retrieve(item.id.toString());
        const enrichedItem = {
          ...item,
          parcel_length: product.metadata?.parcel_length,
          parcel_width: product.metadata?.parcel_width,
          parcel_height: product.metadata?.parcel_height,
          parcel_weight_oz: product.metadata?.parcel_weight_oz,
        };
        console.log('cart-parcel-info: enriched item:', enrichedItem);
        return enrichedItem;
      } catch (err) {
        console.error('cart-parcel-info: error retrieving product', item.id, err);
        return item;
      }
    }));
    console.log('cart-parcel-info: enriched cartItems:', enriched);
    return NextResponse.json({ cartItems: enriched });
  } catch (err: any) {
    console.error('cart-parcel-info: error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 