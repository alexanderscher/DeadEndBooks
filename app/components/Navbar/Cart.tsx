import { Book, ExtendedSession } from "@/types";

import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Loader } from "..";

const Cart = ({}) => {
  const { data: session } = useSession();
  const [pageData, setPageData] = useState<Book[]>([]);
  const [reload, setReload] = useState(false);
  const [userId, setUserId] = useState("");
  const [isLoading, setisLoading] = useState(true);
  const [queuedLists, setQueuedLists] = useState<number[]>([]);

  const [lineStatuses, setLineStatuses] = useState<Record<number, string>>({});

  useEffect(() => {
    setisLoading(true);
    const sessionId = (session as ExtendedSession)?.user?.id;
    setUserId(sessionId as string);
    const getCart = async () => {
      const res = await fetch(`/api/user/${sessionId}`);
      const data = await res.json();
      const queuedIds = [];

      for (const key in data.Queue) {
        queuedIds.push(data.Queue[key].bookId);
      }

      const cartBooks = [];
      const bookIds = [];
      const cartIds = [];

      for (const key in data.Cart) {
        const res = await fetch(`/api/book/${data.Cart[key].bookId}`);
        const book = await res.json();
        bookIds.push(data.Cart[key].bookId);
        cartIds.push(data.Cart[key].id);
        cartBooks.push({ ...book, cartId: data.Cart[key].id });
      }

      setPageData(cartBooks);
      setQueuedLists(queuedIds);
      setisLoading(false);
    };
    getCart();
  }, [session, reload]);

  const removeCart = async (cartId: number) => {
    const res = await fetch(`/api/cart`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartId,
      }),
    });
    setReload(true);
  };

  const getInLine = async (bookId: number) => {
    if (queuedLists.includes(bookId)) {
      setLineStatuses((prev) => ({ ...prev, [bookId]: "Already in queue" }));
      setTimeout(() => {
        setLineStatuses((prev) => ({ ...prev, [bookId]: "" }));
      }, 2000);
      return;
    }
    if (bookId === undefined) return;
    const res = await fetch(`/api/queue`, {
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

  const checkoutSubmit = async () => {
    try {
      for (const book of pageData) {
        if (!book.inStock) {
          console.log("Book is out of stock", book.id);
        } else {
          const res = await fetch(`/api/checkout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              bookId: book.id,
              userId: parseInt(userId),
            }),
          });

          if (!res.ok) {
            throw new Error(
              `Error checking out book with ID ${book.id}: ${res.statusText}`
            );
          }

          const res2 = await fetch(`/api/book/stock`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              bookId: book.id,
              inStock: false,
            }),
          });

          if (!res2.ok) {
            throw new Error(
              `Error checking out book with ID ${book.id}: ${res2.statusText}`
            );
          }

          const res3 = await fetch(`/api/cart`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cartId: book.cartId,
            }),
          });
          if (!res3.ok) {
            throw new Error(
              `Error deleting cart with ID ${book.cartId}: ${res3.statusText}`
            );
          }
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
    setReload(true);
  };

  if (isLoading) {
    return <Loader />;
  }
  if (pageData.length === 0) {
    return (
      <div className="text-[30px]">
        <h1>Your cart is empty</h1>
      </div>
    );
  }

  return (
    <div>
      <div className="fixed bottom-0 left-0 border-t-[2px] border-black bg-red-100 w-full text-red-500 p-5 flex hover:line-through">
        <button
          className="text-[30px]"
          onClick={() => {
            checkoutSubmit();
          }}
        >
          Checkout
        </button>
      </div>
      {pageData.map((book, index) => (
        <div
          key={book.id}
          className={`border-t-[2px] border-slate-400 ${
            index === pageData.length - 1 ? "mb-[200px]" : "mb-6"
          }`}
        >
          <div className="mt-4 flex justify-start w-full">
            <div className="max-w-[200px] mr-[50px]">
              <img className="max-w-[200px]" src={book.photo_front} />
            </div>
            <div className="w-3/4 text-[30px]">
              <h1 className="hover:line-through">
                <Link href={`/book/${book.title}`}>{book.title}</Link>
              </h1>
              <h1 className="mt-4">{book.author}</h1>
              {book.inStock ? (
                <>
                  <h1 className="text-slate-400 mt-4">In Stock</h1>
                  <h1
                    className="text-slate-400 cursor-pointer hover:line-through"
                    onClick={() => removeCart(book.cartId as number)}
                  >
                    Remove
                  </h1>
                </>
              ) : (
                <>
                  <h1 className="text-slate-400 mt-4">Out of stock</h1>

                  <h1
                    className="text-slate-400 cursor-pointer hover:line-through"
                    onClick={() => removeCart(book.cartId as number)}
                  >
                    Remove
                  </h1>
                  <h1
                    className="text-red-500 cursor-pointer hover:line-through"
                    onClick={() => getInLine(book.id as number)}
                  >
                    {lineStatuses[book.id as number] || "Get in line"}
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

export default Cart;
