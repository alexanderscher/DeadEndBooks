import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(request: Request) {
  const json = await request.json();
  const book = await prisma.book.create({
    data: {
      title: json.title,
      author: json.author,
      publisher: json.publisher,
      medium: json.medium,
      photo_front: json.frontCover,
      photo_back: json.backCover,
      inStock: true,
    },
  });

  return new NextResponse(JSON.stringify(book), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
