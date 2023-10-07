import prisma from "@/prisma/client";

export async function updateUserSubscriptionStatus(
  userId: number,
  subscribed: boolean
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { subscribed: subscribed },
  });
}
