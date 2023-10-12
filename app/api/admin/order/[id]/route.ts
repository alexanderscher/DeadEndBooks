import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  console.log(slug);

  const book = await prisma.orders.update({
    where: { id: parseInt(slug) },
    data: {
      shipped: true,
    },
  });

  return new NextResponse(JSON.stringify(book), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
