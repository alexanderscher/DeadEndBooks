"use client";
import { Book, ExtendedSession } from "@/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { parse } from "path";
import React, { useEffect, useState } from "react";

const Saved = () => {
  const { data: session } = useSession();
  const [pageData, setPageData] = useState<Book[]>([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const sessionId = (session as ExtendedSession)?.user?.id;
    setUserId(sessionId);
    const getSaved = async () => {
      const res = await fetch(`/api/user/${sessionId}`);
      const data = await res.json();
      const savedBooks = [];

      for (const key in data.Saved) {
        console.log(data.Saved[key].id);
        const res = await fetch(`/api/book/${data.Saved[key].bookId}`);
        const book = await res.json();

        savedBooks.push({ ...book, savedId: data.Saved[key].id });
      }

      setPageData(savedBooks);
    };
    getSaved();
  }, [session]);

  const handleCart = async (bookId: number) => {
    if (bookId === undefined) return;
    const res = await fetch(`/api/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookId,
        userId: userId,
      }),
    });
  };

  const removeSave = async (savedId: number) => {
    const res = await fetch(`/api/saved`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        savedId,
      }),
    });
  };

  return (
    <div>
      {pageData.map((book) => (
        <div className="border-t-[2px] border-slate-400 mb-6">
          <div key={book.id} className="mt-4 flex justify-start w-full">
            <div className="max-w-[200px] mr-[50px]">
              <img className="" src={book.photo_front} />
            </div>

            <div className="w-3/4 text-[24px]">
              <h1 className="hover:line-through">
                <Link href={`/book/${book.title}`}>{book.title}</Link>
              </h1>
              <h1 className="mt-4">{book.author}</h1>
              {book.inStock ? (
                <h1 className="text-slate-400 cursor-pointer">In Stock</h1>
              ) : (
                <>
                  {" "}
                  <h1 className="text-slate-400 cursor-pointer">
                    Out of stock
                  </h1>
                  <h1 className="text-red-500 cursor-pointer hover:line-through">
                    Get in line
                  </h1>
                </>
              )}

              <h1
                className="text-slate-400 cursor-pointer hover:line-through"
                onClick={() => removeSave(book.savedId as number)}
              >
                Remove
              </h1>
              {book.inStock ? (
                <h1
                  className="text-red-500 cursor-pointer hover:line-through"
                  onClick={() => handleCart(book.id as number)}
                >
                  Add to cart
                </h1>
              ) : (
                <>
                  <h1 className="text-red-500 cursor-pointer hover:line-through">
                    Get in line
                  </h1>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Saved;
