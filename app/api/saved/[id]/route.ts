import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";

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
        Saved: true,
      },
    });
    const books = [];

    if (user) {
      for (const saved of user.Saved) {
        const book = await prisma.book.findUnique({
          where: { id: saved.bookId },
          include: {
            Current: true,
            Saved: true,
            Cart: true,
          },
        });
        books.push({ ...book, savedId: saved.id });
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
