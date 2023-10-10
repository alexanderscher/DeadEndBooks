import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(request: Request) {
  const json = await request.json();
  const {
    userId,
    bookId,
    inStock,
    cartId,
    address,
    zipcode,
    city,
    state,
    country,
    phone,
  } = json;

  const today = new Date();
  const startDate = new Date(today);

  const returnDate = new Date(startDate);
  returnDate.setDate(returnDate.getDate() + 38);

  try {
    const order = await prisma.orders.create({
      data: {
        userId: parseInt(userId),
        bookId,
        start_date: startDate,
        return_date: returnDate,
        shipped: false,
        returned: false,
      },
    });

    const addy = await prisma.orderAddress.create({
      data: {
        orderId: order.id,
        address: address,
        zipcode: zipcode,
        city: city,
        state: state,
        country: country,
        phone: phone,
      },
    });

    const check = await prisma.current.create({
      data: {
        userId: parseInt(userId),
        bookId,
        start_date: startDate,
        return_date: returnDate,
        orderId: order.id,
      },
    });

    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: {
        inStock: {
          set: inStock,
        },
      },
    });

    const cart = await prisma.cart.delete({
      where: {
        id: cartId,
      },
    });

    return new NextResponse(JSON.stringify(order), {
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
