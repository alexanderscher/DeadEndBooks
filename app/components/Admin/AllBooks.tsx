"use client";
import { Book } from "@/types";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Loader } from "..";

const AllBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    const getBooks = async () => {
      setIsLoaded(true);
      const res = await fetch("/api/book");
      const data = await res.json();
      setBooks(data);
      setIsLoaded(false);
    };
    getBooks();
  }, []);

  if (isLoaded) {
    return <Loader />;
  }
  return (
    <div>
      {books.map((book) => (
        <div
          key={book.id}
          className="border-t-[2px] border-slate-300 mt-6 flex w-full"
        >
          <div className="w-[200px] mt-2 mr-10 ">
            <p className="text-slate-400">Title</p>
            <p className="mb-2 hover:line-through">
              <Link href={`/book/${book.title}`}>{book.title}</Link>
            </p>

            <p className="text-slate-400">Author</p>
            <p className="mb-2">{book.author}</p>
            <p className="text-slate-400">Medium</p>
            <p className="mb-2">{book.medium}</p>
            <p className="text-slate-400">Publisher</p>
            <p className="mb-2">{book.publisher}</p>
            <button className="text-red-500 hover:line-through">
              <Link href={`/admin/editbook/${book.title}`}>Edit</Link>
            </button>
          </div>

          <div className="w-1/2 max-w-[500px] mt-4 flex ">
            <div className="w-1/2 mr-4">
              <img src={book.photo_front} alt="" />
            </div>
            <div className="w-1/2">
              <img src={book.photo_back} alt="" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllBooks;
