import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(request: Request) {
  const json = await request.json();
  const { userId, bookId } = json;
  const today = new Date();
  try {
    const saved = await prisma.queue.create({
      data: {
        userId: parseInt(userId),
        bookId,
        date: today,
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
  const { queuedId } = json;

  try {
    const queue = await prisma.queue.delete({
      where: {
        id: queuedId,
      },
    });

    return new NextResponse(JSON.stringify(queue), {
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
