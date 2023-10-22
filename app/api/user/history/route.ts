import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

const formatDate = (input: Date | string) => {
  if (!input) {
    return;
  }

  let date: Date;

  if (typeof input === "string") {
    date = new Date(input);
  } else {
    date = input;
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  return `${month}/${day}/${year}` as string;
};

const daysLate = (input: string | Date) => {
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

const daysLeft = (input: string | Date) => {
  const date = new Date(input);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const diff = date.getTime() - today.getTime();

  return Math.round(diff / (1000 * 60 * 60 * 24));
};

export async function POST(request: Request) {
  try {
    const json = await request.json();

    const id = json;

    if (!id) {
      return new NextResponse("Missing name. Cannot find user.", {
        status: 400,
      });
    }

    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return new NextResponse("Invalid ID provided.", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: parsedId },
      include: {
        address: true,
        Saved: true,
        Cart: true,
        Current: true,
        Queue: true,
        History: true,
        Orders: true,
      },
    });
    if (user?.History.length === 0) {
      return new NextResponse(JSON.stringify([]), {
        status: 200,
      });
    } else {
      const rentals = [];
      if (user) {
        for (const rental in user.Current) {
          const dataBook = await prisma.book.findUnique({
            where: {
              id: user.Current[rental].bookId,
            },
          });

          const dataOrder = await prisma.orders.findUnique({
            where: {
              id: user.Current[rental].orderId,
            },
          });

          if (dataOrder) {
            rentals.push({
              title: dataBook?.title,
              start_date: formatDate(user.History[rental].start_date),
              return_date: formatDate(user.History[rental].return_date),
            });
          }
        }
      }

      return new NextResponse(JSON.stringify(rentals), {
        status: 200,
      });
    }
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to find user", { status: 500 });
  }
}
