import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(request: Request) {
  const json = await request.json();
  const { userId, bookId } = json;

  const today = new Date();
  const startDate = new Date(today);

  const returnDate = new Date(startDate);
  returnDate.setDate(returnDate.getDate() + 38);

  try {
    const cart = await prisma.current.create({
      data: {
        userId: parseInt(userId),
        bookId,
        start_date: startDate,
        return_date: returnDate,
      },
    });

    return new NextResponse(JSON.stringify(cart), {
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
