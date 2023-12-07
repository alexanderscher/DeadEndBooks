import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function PUT() {
  try {
    const users = await prisma.user.findMany({
      include: {
        Current: true,
        History: true,
      },
    });
    return new NextResponse(JSON.stringify(users), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
