import { compare } from "bcrypt";
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function PUT(request: Request) {
  try {
    const json = await request.json();
    console.log(json);
    const userId = json.userId;
    const newEmail = json.email;
    const currentPasswordEmail = json.currentPasswordEmail;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    const existingUser = await prisma.user.findUnique({
      where: {
        email: newEmail,
      },
    });
    if (existingUser) {
      return new NextResponse(
        JSON.stringify({
          message: "Email already registered",
        }),
        {
          status: 500,
        }
      );
    }

    if (
      (newEmail === "" && currentPasswordEmail === "") ||
      newEmail === "" ||
      currentPasswordEmail === ""
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

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(newEmail)) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid email format",
        }),
        {
          status: 500,
        }
      );
    }

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
      const isPasswordValid = await compare(
        currentPasswordEmail,
        user.password
      );
      if (!isPasswordValid) {
        return new NextResponse(
          JSON.stringify({
            message: "Invalid Password",
          }),
          {
            status: 500,
          }
        );
      } else {
        const updatedUser = await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            email: newEmail,
          },
        });

        return new NextResponse(JSON.stringify(updatedUser), {
          status: 200,
        });
      }
    }

    // This is a catch-all return for any case that hasn't been explicitly handled:
    return new NextResponse(
      JSON.stringify({
        message: "Unexpected scenario encountered.",
      }),
      {
        status: 500,
      }
    );
  } catch (error: any) {
    if (error.code === "P2002") {
      return new NextResponse(
        JSON.stringify({
          message: "Email already exists",
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
