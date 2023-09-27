"use client";
import { Book } from "@/types";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const AllBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const getBooks = async () => {
      const res = await fetch("/api/book");
      const data = await res.json();
      setBooks(data);
    };
    getBooks();
  }, []);
  return (
    <div>
      {books.map((book) => (
        <div
          key={book.id}
          className="border-t-[2px] border-slate-400 mt-6 flex w-full"
        >
          <div className="w-[300px] mt-2 mr-16">
            <p className="text-slate-400">Title</p>
            <p className="mb-2">
              <Link href={`/book/${book.title}`}>{book.title}</Link>
            </p>

            <p className="text-slate-400">Author</p>
            <p className="mb-2">{book.author}</p>
            <p className="text-slate-400">Medium</p>
            <p className="mb-2">{book.medium}</p>
            <p className="text-slate-400">Publisher</p>
            <p className="mb-2">{book.publisher}</p>
            <button className="text-red-500">
              <Link href={`/admin/editbook/${book.title}`}>Edit</Link>
            </button>
          </div>

          <div className="w-1/2 mt-2 flex ">
            <div className="w-[200px] mr-4">
              <img src={book.photo_front} alt="" />
            </div>
            <div className="w-[200px]">
              <img src={book.photo_back} alt="" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllBooks;
