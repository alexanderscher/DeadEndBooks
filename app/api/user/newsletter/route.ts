import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const json = await request.json();
    console.log(json);
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

    return new NextResponse("Success", { status: 200 }); // Return success response
  } catch (error: any) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}
