import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import prisma from "@/prisma/client";

export async function PUT(request: Request) {
  try {
    const json = await request.json();
    console.log(json);
    const userId = json.userId;
    const newsletter = json.newsletter;

    const user = await prisma.user.update({
      where: {
        id: parseInt(userId),
      },
      data: {
        newsletter: newsletter,
      },
    });
  } catch (error: any) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}
