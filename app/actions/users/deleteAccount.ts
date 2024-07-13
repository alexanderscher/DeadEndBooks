"use server";

import prisma from "@/prisma/client";
import { stripe } from "@/stripe/stripe";
import { ExtendedSession } from "@/types";
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";

export const deleteAccount = async () => {
  const session = await getServerSession(authOptions);
  const userId = (session as ExtendedSession)?.user?.id;
  if (!userId) {
    return { error: "Unauthorized" };
  }

  const transaction = await prisma.$transaction(async (prisma) => {
    const subscription = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: { subscriptionID: true },
    });

    if (subscription && subscription.subscriptionID) {
      await stripe.subscriptions.cancel(subscription.subscriptionID);
    } else {
      console.log("No subscription found for the user.");
    }

    await prisma.user.delete({
      where: { id: parseInt(userId) },
    });
  });

  try {
    transaction;
    return { success: true };
  } catch (error) {
    console.error("Error deleting account:", error);
    return { error: "An error occurred during account deletion" };
  }
};
