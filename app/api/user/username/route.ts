import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import prisma from "@/prisma/client";

export async function PUT(request: Request) {
  try {
    const json = await request.json();
    console.log(json);
    const userId = json.userId;
    const newName = json.username;
    console.log(newName);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({
          message: "User not found",
        }),
        {
          status: 500,
        }
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: newName,
      },
    });
    console.log(updatedUser);

    return new NextResponse(JSON.stringify(updatedUser), {
      status: 200,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return new NextResponse("Name already exists", {
        status: 409,
      });
    }
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}
