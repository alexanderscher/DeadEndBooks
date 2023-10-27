import prisma from "@/prisma/client";
import { Book } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return new NextResponse("Missing name. Cannot find user.", {
        status: 400,
      });
    }

    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return new NextResponse("Invalid ID provided.", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: parsedId },
      include: {
        Current: true,
        History: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // const books = {
    //   name: user.name,
    //   current: user.Current,
    //   history: user.History,
    // };

    const books = {
      name: user.name,
      current: <any>[],
      history: <any>[],
    };

    for (const current of user.Current) {
      const currentbook = await prisma.book.findUnique({
        where: { id: current.bookId },
      });
      books.current.push(currentbook);
    }

    for (const history of user.History) {
      const historybook = await prisma.book.findUnique({
        where: { id: history.bookId },
      });
      books.history.push(historybook);
    }

    return new NextResponse(JSON.stringify(books), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to find user", { status: 500 });
  }
}
