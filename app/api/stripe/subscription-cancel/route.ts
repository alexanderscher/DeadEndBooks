import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import Stripe from "stripe";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ExtendedSession } from "@/types";

export async function GET(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-08-16",
  });

  const session = await getServerSession(authOptions);

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

  const subscription = await stripe.subscriptions.update(stripeSubscriptionId, {
    cancel_at_period_end: true,
  });

  return NextResponse.json({ subscription }, { status: 200 });
}
