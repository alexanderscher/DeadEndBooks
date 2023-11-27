import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { ExtendedSession } from "@/types";
import { stripe } from "@/stripe/stripe";
import { revalidateTag } from "next/cache";
import { authOptions } from "@/utils/auth";

export async function POST(request: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production";
  const url = isProduction
    ? "https://deadendbooks.org/home"
    : "http://localhost:3000/home";

  const stripeSecretKey = isProduction
    ? process.env.STRIPE_SECRET_KEY_LIVE
    : process.env.STRIPE_SECRET_KEY;
  const serverSession = await getServerSession(authOptions);
  const sessionId = (serverSession as ExtendedSession)?.user?.stripeCustomerId;
  const userId = (serverSession as ExtendedSession)?.user?.id;

  if (!stripeSecretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set in the environment variables."
    );
  }

  const json = await request.json();
  const priceId = json.priceId;

  const stripeSession = await stripe.checkout.sessions.create({
    allow_promotion_codes: true,
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

  revalidateTag(`user-profile-${userId}`);

  return NextResponse.json(stripeSession.url);
}
