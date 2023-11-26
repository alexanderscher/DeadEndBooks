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
export async function GET() {
  try {
    const orders = await prisma.orders.findMany({
      orderBy: { order_date: "desc" },
      include: {
        address: true,
        books: true,
        returned: true,
      },

      where: {
        shipped: true,
      },
    });

    const orderArray = [];

    for (const order of orders) {
      const bookTitlesPromises = order.books.map(async (book) => {
        const bookTitle = await prisma.book.findUnique({
          where: { id: book.bookId },
        });
        return bookTitle?.title;
      });

      const bookTitles = await Promise.all(bookTitlesPromises);

      const bookReturnStatus = order.books.map((book, index: number) => {
        const returnStatus = order.returned.find(
          (ret) => ret.bookId === book.bookId && ret.orderId === book.orderId
        );
        return {
          bookTitle: bookTitles[index],
          returned: returnStatus?.returned || false,
        };
      });

      const user = await prisma.user.findUnique({
        where: { id: order.userId },
      });

      const orderReturn = {
        addressOrder: {
          address: order.address?.address,
          city: order.address?.city,
          country: order.address?.country,
          state: order.address?.state,
          zipcode: order.address?.zipcode,
          phone: order.address?.phone,
          orderName: order.address?.name,
        },
        id: order.id,
        title: bookTitles,
        email: user?.email,
        name: user?.name,
        order_date: formatDate(order.order_date),
        start_date: formatDate(order.start_date),
        return_date: formatDate(order.return_date),
        shipped: order.shipped,
        returned: bookReturnStatus,
      };

      orderArray.push(orderReturn);
    }
    return new NextResponse(JSON.stringify(orderArray), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    return new NextResponse(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
