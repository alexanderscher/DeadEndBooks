import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(request: Request) {
  const current = await prisma.current.deleteMany({});
  const history = await prisma.history.deleteMany({});
  const orderAddress = await prisma.orderAddress.deleteMany({});
  const orderBook = await prisma.orderBook.deleteMany({});
  const orders = await prisma.orders.deleteMany({});
  const books = await prisma.book.updateMany({
    data: {
      inStock: true,
    },
  });

  return new NextResponse(JSON.stringify({ message: "Success" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
