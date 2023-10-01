import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  let book;

  if (!isNaN(Number(slug))) {
    book = await prisma.book.findUnique({
      where: { id: parseInt(slug) },
      include: {
        Queue: {
          orderBy: { date: "asc" },
        },
      },
    });
  } else {
    const decodedTitle = decodeURIComponent(slug);
    book = await prisma.book.findFirst({
      where: { title: decodedTitle },
      include: {
        Queue: {
          orderBy: { date: "asc" },
        },
        Current: true,
      },
    });
  }

  if (!book) {
    return new NextResponse(JSON.stringify({ error: "Book not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new NextResponse(JSON.stringify(book), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
