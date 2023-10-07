import { storeSubscriptionPlans } from "@/config/subscription";

import prisma from "@/prisma/client";
import { stripe } from "./stripe";
import { getServerSession } from "next-auth";
import { ExtendedSession } from "@/types";

export async function getUserSubscriptionPlan() {
  const session = await getServerSession();

  if (!session || !session.user) {
    throw new Error("User not found.");
  }

  const sessionId = (session as ExtendedSession)?.user?.id;

  const user = await prisma.user.findFirst({
    where: {
      id: parseInt(sessionId),
    },
  });
  console.log(user);

  //   if (!user) {
  //     throw new Error("User not found.");
  //   }

  //   const isSubscribed =
  //     user.stripePriceId &&
  //     user.stripeCurrentPeriodEnd &&
  //     user.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now();

  //   const plan = isSubscribed
  //     ? storeSubscriptionPlans.find(
  //         (plan) => plan.stripePriceId === user.stripePriceId
  //       )
  //     : null;

  //   let isCanceled = false;
  //   if (isSubscribed && user.stripeSubscriptionId) {
  //     const stripePlan = await stripe.subscriptions.retrieve(
  //       user.stripeSubscriptionId
  //     );
  //     isCanceled = stripePlan.cancel_at_period_end;
  //   }

  //   return {
  //     ...plan,
  //     stripeSubscriptionId: user.stripeSubscriptionId,
  //     stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd,
  //     stripeCustomerId: user.stripeCustomerId,
  //     isSubscribed,
  //     isCanceled,
  //   };
}
