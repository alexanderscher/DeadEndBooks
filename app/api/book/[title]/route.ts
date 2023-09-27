import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(
  request: Request,
  { params }: { params: { title: string } }
) {
  const { title } = params;
  console.log(title);

  const decodedName = decodeURIComponent(title);
  try {
    const book = await prisma.book.findFirst({
      where: { title: decodedName },
    });
    console.log(book);

    return new NextResponse(JSON.stringify(book), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
