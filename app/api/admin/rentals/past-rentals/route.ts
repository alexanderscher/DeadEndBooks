import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function PUT() {
  try {
    const rentals = await prisma.history.findMany({
      orderBy: { start_date: "asc" },
    });

    const apiRentals = [];

    for (const key in rentals) {
      const book = await prisma.book.findUnique({
        where: { id: rentals[key].bookId },
      });

      const user = await prisma.user.findUnique({
        where: { id: rentals[key].userId as number },
      });

      apiRentals.push({
        id: rentals[key].id,
        title: book?.title,
        bookId: rentals[key].bookId,
        userId: rentals[key].userId,
        start_date: rentals[key].start_date,
        return_date: rentals[key].return_date,
        user_email: user?.email,
      });
    }

    return new NextResponse(JSON.stringify(apiRentals), {
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
