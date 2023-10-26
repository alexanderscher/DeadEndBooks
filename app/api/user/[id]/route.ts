import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const dynamic = "force-dynamic";
export async function GET(
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

    const user = await prisma.user.update({
      where: { id: parsedId },
      data: {
        isActive: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to find user", { status: 500 });
  }
}
