import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const bookId = parseInt(id);

  if (isNaN(bookId)) {
    return new NextResponse(JSON.stringify({ error: "Invalid ID format" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const book = await request.json();

  if (
    !book.title ||
    !book.author ||
    !book.publisher ||
    !book.medium ||
    !book.photo_front ||
    !book.photo_back
  ) {
    return new NextResponse(JSON.stringify({ error: "Missing book details" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const thebook = {
    title: book.title,
    author: book.author,
    publisher: book.publisher,
    medium: book.medium,
    photo_front: book.photo_front,
    photo_back: book.photo_back,
  };

  try {
    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: thebook,
    });

    return new NextResponse(JSON.stringify(updatedBook), {
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const bookId = parseInt(id);

  if (isNaN(bookId)) {
    return new NextResponse(JSON.stringify({ error: "Invalid ID format" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    const updatedBook = await prisma.book.delete({
      where: { id: bookId },
    });

    return new NextResponse(JSON.stringify(updatedBook), {
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
