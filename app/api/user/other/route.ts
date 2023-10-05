import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        Current: true,
        History: true,
      },
    });

    const result = [];

    for (const key in users) {
      const current_books_promises = users[key].Current.map(async (current) => {
        const book = await prisma.book.findUnique({
          where: {
            id: current.bookId,
          },
        });
        if (book) {
          book.start_date = current.start_date; // This line appends the start_date to the book
        }
        return book;
      });

      const past_books_promises = users[key].History.map(async (history) => {
        const book = await prisma.book.findUnique({
          where: {
            id: history.bookId,
          },
        });
        if (book) {
          book.start_date = history.start_date; // This line appends the start_date to the book
        }
        return book;
      });

      const current_books = await Promise.all(current_books_promises);
      console.log(current_books);

      const past_books = await Promise.all(past_books_promises);

      result.push({
        id: users[key].id,
        name: users[key].name,
        email: users[key].email,
        current_books: current_books,
        past_books: past_books,
      });
    }

    return new NextResponse(JSON.stringify(result), {
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
