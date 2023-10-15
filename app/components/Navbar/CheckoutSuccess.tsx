"use client";
import { Book } from "@prisma/client";
import React, { useEffect, useState } from "react";

type OrderBooks = {
  orderBooks: {
    orderId: number;
    bookId: number;
  }[];
};
const CheckoutSuccess = ({ orderBooks }: OrderBooks) => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const getBooks = async () => {
      const bookArray = [];
      for (const book of orderBooks) {
        const res = await fetch(`/api/book/${book.bookId}`);
        const data = await res.json();
        bookArray.push(data);
      }
      setBooks(bookArray);
    };
    getBooks();
  }, []);
  return (
    <div>
      <h1 className="text-[26px]">Thanks for your order</h1>
      <div className="text-[26px]">
        <span>Order ID: </span>
        <span className="ml-2 ">{orderBooks[0].orderId} </span>
      </div>
      <div className="mt-8 text-[26px]">
        {books.map((book) => (
          <div key={book.id}>
            <span className="text-red-500">{book.title}</span>
            <span className="ml-2 text-slate-400">{book.author}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutSuccess;
