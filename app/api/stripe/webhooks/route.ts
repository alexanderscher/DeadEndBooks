import Stripe from "stripe";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { stripe } from "@/stripe/stripe";

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

const webhookHandler = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const buf = await req.text();
    const sig = req.headers.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      if (err! instanceof Error) console.log(err);
      console.log(`❌ Error message: ${errorMessage}`);

      return new NextResponse(
        JSON.stringify({
          error: {
            message: `Webhook Error: ${errorMessage}`,
          },
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("✅ Success:", event.id);

    const subscription = event.data.object as Stripe.Subscription;
    console.log(subscription.plan.nickname);

    const subscriptionId = subscription.id;

    switch (event.type) {
      case "customer.subscription.created":
        await prisma.user.update({
          where: {
            stripeCustomerId: subscription.customer as string,
          },
          data: {
            isActive: true,
            subscriptionID: subscriptionId,
          },
        });
        break;
      case "customer.subscription.deleted":
        await prisma.user.update({
          where: {
            stripeCustomerId: subscription.customer as string,
          },
          data: {
            isActive: false,
            subscriptionType: subscription.plan.nickname,
          },
        });
        break;
      default:
        console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
        break;
    }

    return new NextResponse(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    const response = new NextResponse(
      JSON.stringify({
        error: {
          message: `Method Not Allowed`,
        },
      }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );

    response.headers.set("Allow", "POST");
    return response;
  }
};

export { webhookHandler as POST };
