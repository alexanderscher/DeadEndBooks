import { NextResponse } from "next/server";
import { stripe } from "@/stripe/stripe";

export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const prices = await stripe.prices.list({
    limit: 4,
    active: true,
    type: "recurring",
  });

  return NextResponse.json(prices.data);
}
