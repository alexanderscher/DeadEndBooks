import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { revalidateTag } from "next/cache";

export async function PUT(request: Request) {
  const json = await request.json();

  const book = await prisma.orders.update({
    where: { id: parseInt(json.id) },
    data: {
      shipped: true,
    },
  });
  revalidateTag("orders");

  return new NextResponse(JSON.stringify(book), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
