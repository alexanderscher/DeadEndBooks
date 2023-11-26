import { NextResponse } from "next/server";
import { stripe } from "@/stripe/stripe";

export async function GET(request: Request) {
  try {
    const prices = await stripe.prices.list({
      limit: 4,
      active: true,
      type: "recurring",
    });
    return new NextResponse(JSON.stringify(prices.data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: "Database error" }), {
      status: 500,

      headers: { "Content-Type": "application/json" },
    });
  }
}
