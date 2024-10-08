import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { userId, bookId, start_date, return_date, id, orderId } = json;

    await prisma.book.update({
      where: { id: bookId },
      data: {
        inStock: true,
      },
    });

    await prisma.history.create({
      data: {
        userId: parseInt(userId),
        bookId,
        start_date,
        return_date,
      },
    });

    await prisma.returned.update({
      where: {
        orderId_bookId: {
          orderId: orderId,
          bookId: bookId,
        },
      },
      data: {
        returned: true,
      },
    });

    await prisma.current.delete({
      where: { id: parseInt(id) },
    });

    revalidateTag("rentals");

    return new NextResponse(JSON.stringify({ message: "Success" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API error:", error);

    return new NextResponse(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
