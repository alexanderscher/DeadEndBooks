import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const dynamic = "force-dynamic";
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const address = await prisma.address.findUnique({
    where: { id: parseInt(id) },
  });

  return NextResponse.json(address);
}
