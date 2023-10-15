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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const order = await prisma.orders.findUnique({
      where: { id: parseInt(id) },
      include: {
        books: true,
      },
    });
    if (order === null) {
      return new NextResponse(JSON.stringify({}), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new NextResponse(JSON.stringify(order), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new NextResponse(JSON.stringify(e), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
