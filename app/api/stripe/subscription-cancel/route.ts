import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "../../auth/[...nextauth]/route";
import { ExtendedSession } from "@/types";
import { stripe } from "@/stripe/stripe";
import prisma from "@/prisma/client";

export async function GET(req: NextRequest) {
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

  const subscription = await stripe.subscriptions.cancel(stripeSubscriptionId);

  // const subscription = await stripe.subscriptions.update(stripeSubscriptionId, {
  //   cancel_at_period_end: true,
  // });

  // const user = await prisma.user.update({
  //   where: { id: parseInt((session as ExtendedSession)?.user?.id) },
  //   data: {
  //     isActive: false,
  //     subscriptionType: null,
  //   },
  // });

  return NextResponse.json({ subscription }, { status: 200 });
}
