import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: { title: "asc" },
    });
    return new NextResponse(JSON.stringify(books), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: "Database error" }), {
      status: 500,

      headers: { "Content-Type": "application/json" },
    });
  }
}
