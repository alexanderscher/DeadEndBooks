import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  const { id } = params;
  console.log(id);

  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });
    console.log(user);

    return new NextResponse(JSON.stringify(user), {
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
