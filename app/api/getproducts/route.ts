import { NextResponse } from "next/server";
import { stripe } from "@/stripe/stripe";

export async function GET(request: Request) {
  const prices = await stripe.prices.list({
    limit: 4,
    active: true,
  });

  return NextResponse.json(prices.data);
}
