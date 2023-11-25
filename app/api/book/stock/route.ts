import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { revalidateTag } from "next/cache";

export async function PUT(request: Request) {
  const json = await request.json();

  const bookId = Number(json.bookId);
  const inStock = json.inStock;

  if (isNaN(bookId)) {
    return new NextResponse(JSON.stringify({ error: "Invalid ID format" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: {
        inStock: {
          set: inStock,
        },
      },
    });

    revalidateTag(`book-${bookId}`);
    revalidateTag(`all-books`);

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
