import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(request: Request) {
  const json = await request.json();
  const {
    userId,
    inStock,
    address,
    zipcode,
    city,
    state,
    country,
    phone,
    name,
    books,
  } = json;

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() + 3);

  const returnDate = new Date(startDate);
  returnDate.setDate(returnDate.getDate() + 38);

  try {
    const order = await prisma.orders.create({
      data: {
        userId: parseInt(userId),
        order_date: today,
        start_date: startDate,
        return_date: returnDate,
        shipped: false,
        returned: false,
      },
    });

    await prisma.orderAddress.create({
      data: {
        name: name,
        orderId: order.id,
        address: address,
        zipcode: zipcode,
        city: city,
        state: state,
        country: country,
        phone: phone,
      },
    });

    for (const book of books) {
      await prisma.orderBook.create({
        data: {
          orderId: order.id,
          bookId: book.id,
        },
      });
      await prisma.book.update({
        where: { id: book.id },
        data: {
          inStock: false,
        },
      });

      await prisma.current.create({
        data: {
          userId: parseInt(userId),
          bookId: book.id,
          start_date: startDate,
          return_date: returnDate,
          orderId: order.id,
        },
      });

      book.Cart.map(async (cartItem) => {
        await prisma.cart.delete({
          where: {
            id: cartItem.id,
            userId: parseInt(userId),
            bookId: book.id,
          },
        });
      });
      book.Queue.map(async (QueueItem) => {
        await prisma.cart.delete({
          where: {
            id: QueueItem.id,
            userId: parseInt(userId),
          },
        });
      });
    }

    // prisma.book.update({
    //   where: { id: book.id },
    //   data: {
    //     inStock: false,
    //   },
    // }),
    // ...book.Cart.map((cartItem) =>
    //   prisma.cart.delete({
    //     where: {
    //       id: cartItem.id,
    //       userId: parseInt(userId),
    //     },
    //   })
    // ),
    // ...book.Queue.map((queueItem) =>
    //   prisma.queue.delete({
    //     where: {
    //       id: queueItem.id,
    //       userId: parseInt(userId),
    //     },
    //   })
    // ),

    // if (!order || !addy || !check || !updatedBook || !cart) {
    //   return new NextResponse(JSON.stringify({ error: "Order not created" }), {
    //     status: 500,
    //     headers: { "Content-Type": "application/json" },
    //   });
    // } else {
    //   return new NextResponse(JSON.stringify(order), {
    //     status: 201,
    //     headers: { "Content-Type": "application/json" },
    //   });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
