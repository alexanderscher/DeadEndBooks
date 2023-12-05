import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  const json = await request.json();
  const { userId, bookId } = json;
  try {
    const cart = await prisma.cart.create({
      data: {
        userId: parseInt(userId),
        bookId,
      },
    });
    revalidateTag(`cart-${userId}`);

    return new NextResponse(JSON.stringify(cart), {
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

export async function DELETE(request: Request) {
  const json = await request.json();
  const { cartId, userId } = json;
  try {
    const cart = await prisma.cart.delete({
      where: {
        id: cartId,
      },
    });

    revalidateTag(`cart-${userId}`);

    return new NextResponse(JSON.stringify(cart), {
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
