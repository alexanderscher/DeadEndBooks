"use client";
import { useDeviceQueries } from "@/utils/deviceQueries";
import { Book } from "@prisma/client";
import React, { useEffect, useState } from "react";

type bookArray = {
  bookArray: any;
  orderNumber: number;
};
const CheckoutSuccess = ({ bookArray, orderNumber }: bookArray) => {
  const { isSmallDevice } = useDeviceQueries();
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const getBooks = async () => {
      setBooks(bookArray);
    };
    getBooks();
  }, []);
  return (
    <div className={isSmallDevice ? "mt-10" : "w-full"}>
      <h1 className="text-[26px]">Thanks for your order</h1>
      <div className="text-[26px]">
        <span>Order ID: </span>
        <span className="ml-2 ">{orderNumber} </span>
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
