import Stripe from "stripe";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set in the environment variables."
    );
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2023-08-16",
  });

  const prices = await stripe.prices.list({
    limit: 2,
  });

  return NextResponse.json(prices.data);
}
