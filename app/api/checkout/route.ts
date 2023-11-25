import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: Request): Promise<NextResponse> {
  const json = await request.json();
  const {
    userId,
    inStock,
    address,
    zipcode,
    city,
    state,
    country,
    phone,
    name,
    books,
  } = json;

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() + 3);

  const returnDate = new Date(startDate);
  returnDate.setDate(returnDate.getDate() + 34);

  try {
    const order = await prisma.orders.create({
      data: {
        userId: parseInt(userId),
        order_date: today,
        start_date: startDate,
        return_date: returnDate,
        shipped: false,
      },
    });

    await prisma.orderAddress.create({
      data: {
        name: name,
        orderId: order.id,
        address: address,
        zipcode: zipcode,
        city: city,
        state: state,
        country: country,
        phone: phone,
      },
    });

    const book_titles = [];
    const orderBookPromises = [];
    const returnedPromises = [];
    const bookUpdatePromises = [];
    const titlePromises = [];
    const currentPromises = [];
    const cartDeletePromises = [];

    for (const book of books) {
      prisma.orderBook.create({
        data: {
          orderId: order.id,
          bookId: book.id,
        },
      });

      orderBookPromises.push(
        prisma.orderBook.create({
          data: {
            orderId: order.id,
            bookId: book.id,
          },
        })
      );

      returnedPromises.push(
        prisma.returned.create({
          data: {
            orderId: order.id,
            bookId: book.id,
            returned: false,
          },
        })
      );

      bookUpdatePromises.push(
        prisma.book.update({
          where: { id: book.id },
          data: {
            inStock: false,
          },
        })
      );

      titlePromises.push(prisma.book.findUnique({ where: { id: book.id } }));

      currentPromises.push(
        prisma.current.create({
          data: {
            userId: parseInt(userId),
            bookId: book.id,
            start_date: startDate,
            return_date: returnDate,
            orderId: order.id,
          },
        })
      );

      cartDeletePromises.push(
        book.Cart.map((cartItem: any) =>
          prisma.cart.delete({
            where: {
              id: cartItem.id,
              userId: parseInt(userId),
              bookId: book.id,
            },
          })
        )
      );
    }
    await Promise.all(orderBookPromises);
    await Promise.all(returnedPromises);
    await Promise.all(bookUpdatePromises);
    const titles = await Promise.all(titlePromises);
    const bookTitles = titles.map((book) => book?.title);
    book_titles.push(...bookTitles);

    await Promise.all(currentPromises);
    await Promise.all(cartDeletePromises.flat());

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });
    if (!user) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    // revalidatePath("/api/admin/rentals/current-rentals");
    revalidateTag("other-users");
    revalidateTag(`user-profile-${userId}`);
    revalidateTag(`cart-${userId}`);
    revalidateTag(`all-orders`);

    return new NextResponse(
      JSON.stringify({
        name: user.name,
        email: user.email,
        orderId: order.id,
        date: today.toString(),
        titles: book_titles,
        returnDate: returnDate.toString(),
      }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "Database error" }), {
      status: 500,
    });
  }
}
