import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const parsedId = parseInt(id);

    const user = await prisma.user.findUnique({
      where: { id: parsedId },
      include: {
        Cart: true,
      },
    });
    const books = [];

    if (user) {
      for (const cart of user.Cart) {
        const book = await prisma.book.findUnique({
          where: { id: cart.bookId },
          include: {
            Current: true,
            Saved: true,
            Cart: true,
          },
        });
        books.push({ ...book, cartId: cart.id });
      }
    }

    return new NextResponse(JSON.stringify(books), {
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
