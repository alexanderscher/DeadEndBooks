import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

type ExtendedBook = {
  start_date?: Date;
  id: number;
  title: string;
  author: string;
  publisher: string;
  medium: string;
  photo_front: string;
  photo_back: string;
  inStock: boolean;
};

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        isActive: true,
      },
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
          (book as ExtendedBook).start_date = current.start_date;
          return book as ExtendedBook;
        }
        return null;
      });

      const past_books_promises = users[key].History.map(async (history) => {
        const book = await prisma.book.findUnique({
          where: {
            id: history.bookId,
          },
        });
        if (book) {
          (book as ExtendedBook).start_date = history.start_date;
          return book as ExtendedBook;
        }
        return book;
      });

      const current_books = await Promise.all(current_books_promises);

      let past_books = await Promise.all(past_books_promises);

      // Remove duplicates from past_books based on book id
      past_books = past_books.filter(
        (book, index, self) =>
          index === self.findIndex((b) => b?.id === book?.id)
      );

      // Sort past_books by start_date in descending order and retain only the first 3
      past_books.sort(
        (a, b) =>
          new Date(b?.start_date as Date).getTime() -
          new Date(a?.start_date as Date).getTime()
      );
      past_books = past_books.slice(0, 3);

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
