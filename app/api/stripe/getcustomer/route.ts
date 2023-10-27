import { stripe } from "@/stripe/stripe";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set in the environment variables."
    );
  }

  const customer = await stripe.customers.list({});

  return NextResponse.json(customer.data);
}
