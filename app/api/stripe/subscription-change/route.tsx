import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "../../auth/[...nextauth]/route";
import { ExtendedSession } from "@/types";
import { stripe } from "@/stripe/stripe";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const isProduction = process.env.NODE_ENV === "production";
  const url = isProduction
    ? "https://deadendbooks.org/home"
    : "http://localhost:3000/home";

  if (!session?.user) {
    return NextResponse.json(
      {
        error: {
          code: "no-access",
          message: "You are not signed in.",
        },
      },
      { status: 401 }
    );
  }
  const stripeSubscriptionId = (session as ExtendedSession)?.user
    ?.subscriptionID;

  const cancel = await stripe.subscriptions.cancel(stripeSubscriptionId);

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
  const subscriptionID = json.subscriptionID;

  const stripeSession = await stripe.checkout.sessions.create({
    customer: sessionId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${url}/success/${subscriptionID}`,
    cancel_url: `${url}/cancel/${subscriptionID}`,
  });

  return NextResponse.json(stripeSession.url);
}
