import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { ExtendedSession } from "@/types";
import { authOptions } from "../../auth/[...nextauth]/route";
import { stripe } from "@/stripe/stripe";

export async function POST(request: NextRequest) {
  const isProduction = process.env.NEXT_PUBLIC_NODE_ENV === "production";
  const url = isProduction
    ? "https://deadendbooks.org/home"
    : "http://localhost:3000/home";
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const serverSession = await getServerSession(authOptions);
  const sessionId = (serverSession as ExtendedSession)?.user?.stripeCustomerId;

  if (!stripeSecretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set in the environment variables."
    );
  }

  const json = await request.json();
  const priceId = json.priceId;

  const stripeSession = await stripe.checkout.sessions.create({
    customer: sessionId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${url}/success`,
    cancel_url: `${url}/cancel`,
  });

  return NextResponse.json(stripeSession.url);
}
