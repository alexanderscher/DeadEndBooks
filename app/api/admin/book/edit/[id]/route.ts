import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { deleteUploadThingImage } from "@/app/actions/photo/delete";
import { utapi } from "uploadthing/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const bookId = parseInt(id);

  if (isNaN(bookId)) {
    return new NextResponse(JSON.stringify({ error: "Invalid ID format" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const book = await request.json();

  if (
    !book.title ||
    !book.author ||
    !book.publisher ||
    !book.medium ||
    !book.photo_front ||
    !book.photo_back ||
    !book.pf_fileKey ||
    !book.pb_fileKey
  ) {
    return new NextResponse(JSON.stringify({ error: "Missing book details" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const oldImage = await prisma.book.findUnique({
    where: { id: bookId },
    select: {
      photo_front: true,
      photo_back: true,
      pb_fileKey: true,
      pf_fileKey: true,
    },
  });

  if (oldImage && oldImage.photo_front !== book.photo_front) {
    await deleteUploadThingImage(oldImage.pf_fileKey);
  }

  if (oldImage && oldImage.photo_back !== book.photo_back) {
    await deleteUploadThingImage(oldImage.pb_fileKey);
  }

  const thebook = {
    title: book.title,
    author: book.author,
    publisher: book.publisher,
    medium: book.medium,
    photo_front: book.photo_front,
    photo_back: book.photo_back,
    pf_fileKey: book.pf_fileKey,
    pb_fileKey: book.pb_fileKey,
  };

  try {
    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: thebook,
    });
    return new NextResponse(JSON.stringify(updatedBook), {
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const bookId = parseInt(id);

  if (isNaN(bookId)) {
    return new NextResponse(JSON.stringify({ error: "Invalid ID format" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    const updatedBook = await prisma.book.findUnique({
      where: { id: bookId },
      include: {
        Current: true,
      },
    });

    if (!updatedBook) {
      return new NextResponse(JSON.stringify({ error: "No book found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (updatedBook.Current.length > 0) {
      return new NextResponse(
        JSON.stringify({ error: "Book is currently in use" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      await utapi.deleteFiles(updatedBook.pb_fileKey);
      await utapi.deleteFiles(updatedBook.pf_fileKey);

      const deletedBook = await prisma.book.delete({
        where: { id: bookId },
      });
      return new NextResponse(JSON.stringify(deletedBook), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
