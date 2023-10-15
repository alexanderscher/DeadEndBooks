import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

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
        shipped: false,
      },
    });
    console.log(orders);
    return new NextResponse(JSON.stringify(orders), {
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
