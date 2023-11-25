import React, { useEffect, useState } from "react";
import { Loader, Navbar, CheckoutSuccess } from "@/app/components";
import { ExtendedSession } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { isProduction } from "@/utils/name";

const page = async ({ params }: { params: { id: number } }) => {
  const serverSession = await getServerSession(authOptions);
  const sessionId = (serverSession as ExtendedSession)?.user?.id;
  const url = isProduction();
  const id = params.id;
  let orderBooks = [
    {
      orderId: 0,
      bookId: 0,
    },
  ];

  if (sessionId) {
    const res = await fetch(`${url}/api/order/${id}`);
    const data = await res.json();
    orderBooks = data.books;
    console.log(orderBooks);
  }

  const bookArray = [];

  for (const book of orderBooks) {
    const res = await fetch(`${url}/api/book/${book.bookId}`);
    const data = await res.json();
    bookArray.push(data);
  }

  return (
    <main className="page">
      <>
        <Navbar />

        {sessionId && (
          <CheckoutSuccess bookArray={bookArray} orderNumber={id} />
        )}
      </>
    </main>
  );
};

export default page;
