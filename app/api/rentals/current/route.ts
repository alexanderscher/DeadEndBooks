import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET() {
  try {
    const rentals = await prisma.current.findMany({
      orderBy: { start_date: "asc" },
    });
    return new NextResponse(JSON.stringify(rentals), {
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

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const rentals = await prisma.current.delete({
      where: { id: parseInt(id) },
    });
    return new NextResponse(JSON.stringify(rentals), {
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
