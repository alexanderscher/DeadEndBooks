import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { revalidateTag } from "next/cache";

export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const json = await request.json();
    const userId = json.userId;
    const newsletter = json.newsletter;

    await prisma.user.update({
      where: {
        id: parseInt(userId),
      },
      data: {
        newsletter: newsletter,
      },
    });
    revalidateTag(`user-profile-${userId}`);

    return new NextResponse("Success", { status: 200 }); // Return success response
  } catch (error: any) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}
