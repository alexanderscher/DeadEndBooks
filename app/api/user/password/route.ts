import { compare } from "bcrypt";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import prisma from "@/prisma/client";
import { revalidateTag } from "next/cache";

export async function PUT(request: Request) {
  try {
    const json = await request.json();
    const userId = json.userId;
    const newPassword = json.newPassword;
    const oldPassword = json.currentPasswordPassword;

    if (
      (newPassword === "" && oldPassword === "") ||
      newPassword === "" ||
      oldPassword === ""
    ) {
      return new NextResponse(
        JSON.stringify({
          message: "All field needs to be filled out",
        }),
        {
          status: 500,
        }
      );
    }

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

    if (user.password) {
      const isPasswordValid = await compare(oldPassword, user.password);

      if (!isPasswordValid) {
        return new NextResponse(
          JSON.stringify({
            message: "Current password is incorrect",
          }),
          {
            status: 500,
          }
        );
      } else {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            password: hashedPassword,
          },
        });
        revalidateTag(`user-profile-${userId}`);

        return new NextResponse(JSON.stringify(updatedUser), {
          status: 200,
        });
      }
    } else {
      return new NextResponse(
        JSON.stringify({
          message: "User doesn't have an associated password.",
        }),
        {
          status: 500,
        }
      );
    }
  } catch (error: any) {
    if (error.code === "P2002") {
      return new NextResponse(
        JSON.stringify({
          message: "Password already exists",
        }),
        {
          status: 500,
        }
      );
    }
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}
