import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(request: Request) {
  const json = await request.json();
  const { userId, bookId } = json;
  try {
    const saved = await prisma.saved.create({
      data: {
        userId: parseInt(userId),
        bookId,
      },
    });

    return new NextResponse(JSON.stringify(saved), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(request: Request) {
  const json = await request.json();
  const { savedId } = json;
  try {
    const saved = await prisma.saved.delete({
      where: {
        id: savedId,
      },
    });

    return new NextResponse(JSON.stringify(saved), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
