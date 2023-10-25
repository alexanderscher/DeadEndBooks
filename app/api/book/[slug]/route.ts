import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const book = await prisma.book.update({
    where: { id: parseInt(slug) },
    data: {
      inStock: true,
    },
  });

  return new NextResponse(JSON.stringify(book), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export const dynamic = "force-dynamic";
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
        Current: true,
        Saved: true,
        Cart: true,
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
        Saved: true,
        Cart: true,
      },
    });
  }

  if (book === null) {
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
