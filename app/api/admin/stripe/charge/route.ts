import { NextResponse, NextRequest } from "next/server";
import { stripe } from "@/stripe/stripe";

export async function POST(request: NextRequest) {
  const json = await request.json();

  const isProduction = process.env.NODE_ENV === "production";

  const stripeSecretKey = isProduction
    ? process.env.STRIPE_SECRET_KEY_LIVE
    : process.env.STRIPE_SECRET_KEY;

  const url = isProduction
    ? "https://www.deadendbooks.org"
    : "http://localhost:3000";

  if (!stripeSecretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set in the environment variables."
    );
  }

  try {
    const charge = await stripe.paymentIntents.create({
      amount: json.amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      customer: json.stripeCustomerId,
      payment_method: json.paymentMethodId,
      confirm: true,
      return_url: url,
    });

    return NextResponse.json(charge);
  } catch (error) {
    console.error("Stripe error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
