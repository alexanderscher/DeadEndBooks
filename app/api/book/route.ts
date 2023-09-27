import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: { title: "asc" },
    });
    return new NextResponse(JSON.stringify(books), {
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

export async function POST(request: Request) {
  const json = await request.json();

  const requiredFields = [
    "title",
    "author",
    "publisher",
    "medium",
    "frontCover",
    "backCover",
  ];

  const missingFields: string[] = [];

  for (const field of requiredFields) {
    if (!json[field]) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    return new NextResponse(
      JSON.stringify({
        error: `Missing or invalid fields: ${missingFields.join(", ")}`,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
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
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
