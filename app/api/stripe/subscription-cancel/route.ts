import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ExtendedSession } from "@/types";
import { stripe } from "@/stripe/stripe";
import prisma from "@/prisma/client";
import { revalidateTag } from "next/cache";
import { authOptions } from "@/utils/auth";

function isNinetyDaysOrMoreSince(givenDateStr: string) {
  const givenDate = new Date(givenDateStr);

  givenDate.setDate(givenDate.getDate() + 90);

  const currentDate = new Date();

  return currentDate >= givenDate;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const sessionUserId = (session as ExtendedSession)?.user?.id;

  try {
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

    const user = await prisma.user.findUnique({
      where: {
        id: parseInt((session as ExtendedSession)?.user?.id),
      },
    });

    if (!user) {
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

    if (user.subscriptionType === "Monthly Plan") {
      console.log("Monthly Plan");
      if (user.subscriptionDate) {
        if (isNinetyDaysOrMoreSince(user.subscriptionDate.toString())) {
          const stripeSubscriptionId = (session as ExtendedSession)?.user
            ?.subscriptionID;

          const subscription = await stripe.subscriptions.cancel(
            stripeSubscriptionId
          );

          return NextResponse.json({ user }, { status: 200 });
        } else {
          return NextResponse.json(
            {
              error: {
                message: "Has not been 90 days since subscription.",
              },
            },
            { status: 403 }
          );
        }
      }
    } else {
      const stripeSubscriptionId = (session as ExtendedSession)?.user
        ?.subscriptionID;

      const subscription = await stripe.subscriptions.cancel(
        stripeSubscriptionId
      );

      revalidateTag(`user-profile-${sessionUserId}`);

      return NextResponse.json({ user }, { status: 200 });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        error: {
          message: "Something went wrong.",
        },
      },
      { status: 500 }
    );
  }
}
