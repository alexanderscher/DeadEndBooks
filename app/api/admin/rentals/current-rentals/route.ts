import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

const daysLate = (input: string) => {
  const dueDate = new Date(input);
  const today = new Date();

  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diff = today.getTime() - dueDate.getTime();

  if (diff <= 0) {
    return 0;
  }

  return Math.round(diff / (1000 * 60 * 60 * 24));
};

const daysLeft = (input: string) => {
  const date = new Date(input);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const diff = date.getTime() - today.getTime();

  return Math.round(diff / (1000 * 60 * 60 * 24));
};

interface CurrentRentalsProps {
  isSmallDevice: boolean;
}

export async function GET() {
  try {
    const rentals = await prisma.current.findMany({
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
        orderId: rentals[key].orderId,
        bookId: rentals[key].bookId,
        userId: rentals[key].userId,
        start_date: rentals[key].start_date,
        return_date: rentals[key].return_date,
        user_email: user?.email as string,
        isLate: daysLate(rentals[key].return_date.toISOString().split("T")[0]),
        daysLeft: daysLeft(
          rentals[key].return_date.toISOString().split("T")[0]
        ),
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
