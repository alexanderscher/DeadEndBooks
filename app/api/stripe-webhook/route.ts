// pages/api/stripe-webhook.ts

import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";
import { updateUserSubscriptionStatus } from "@/app/utils/updateSubscription";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
});

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new NextResponse(`Webhook error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Here, you'd extract user information from the session and update your database
    const userId = session.client_reference_id; // Assuming you set the client_reference_id to the user's ID during session creation

    await updateUserSubscriptionStatus(userId, true); // Set subscribed to true
  }

  return new NextResponse("Received event", { status: 200 });
}
