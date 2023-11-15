import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ExtendedSession } from "@/types";
import { stripe } from "@/stripe/stripe";
import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return new NextResponse("Missing name. Cannot find user.", {
        status: 400,
      });
    }

    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return new NextResponse("Invalid ID provided.", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: parsedId },
      include: {
        address: true,
        Saved: true,
        Cart: true,
        Current: true,
        History: true,
        Orders: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to find user", { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return new NextResponse("Missing name. Cannot find user.", {
        status: 400,
      });
    }

    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return new NextResponse("Invalid ID provided.", { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: parsedId },
      data: {
        isActive: true,
      },
    });
    revalidatePath(`/api/user/${parsedId}`);

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to find user", { status: 500 });
  }
}

function isNinetyDaysOrMoreSince(givenDateStr: string) {
  const givenDate = new Date(givenDateStr);

  givenDate.setDate(givenDate.getDate() + 90);

  const currentDate = new Date();

  return currentDate >= givenDate;
}

// export async function DELETE(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   const { id } = params;
//   const userId = parseInt(id);
//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//   });

//   if (user && user.isActive) {
//     return new NextResponse(JSON.stringify({ error: "Active subsciption" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   } else {
//     // await prisma.orders.deleteMany({ where: { userId } });
//     // await prisma.orderAddress.deleteMany({ where: {} });
//     // await prisma.address.deleteMany({ where: { userId } });
//     // await prisma.current.deleteMany({ where: { userId } });
//     // await prisma.cart.deleteMany({ where: { userId } });
//     // await prisma.saved.deleteMany({ where: { userId } });
//     // await prisma.history.deleteMany({ where: { userId } });
//     // await prisma.user.delete({ where: { id: userId } });
//   }

//   return new NextResponse(JSON.stringify(id), {
//     status: 200,
//     headers: { "Content-Type": "application/json" },
//   });
// }
