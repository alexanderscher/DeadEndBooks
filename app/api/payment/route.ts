import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set in the environment variables."
    );
  }
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2023-08-16",
  });

  const json = await request.json();
  const priceId = json.priceId;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: "https://localhost:3003",
    cancel_url: "https://localhost:3003",
  });

  return NextResponse.json(session.url);
}
