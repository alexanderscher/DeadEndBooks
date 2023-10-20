"use client";
import { Book, ExtendedSession } from "@/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Loader } from "..";
import page from "@/app/page";

const Saved = () => {
  const { data: session } = useSession();
  const [pageData, setPageData] = useState<Book[]>([]);
  const [userId, setUserId] = useState("");
  const [cartIdList, setCartIdList] = useState<number[]>([]);
  const [queuedLists, setQueuedLists] = useState<number[]>([]);
  const [reload, setReload] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);
  const [cartStatuses, setCartStatuses] = useState<Record<number, string>>({});
  const [lineStatuses, setLineStatuses] = useState<Record<number, string>>({});

  useEffect(() => {
    setReload(false);
    const sessionId = (session as ExtendedSession)?.user?.id;
    setUserId(sessionId);

    const getSaved = async () => {
      setIsLoaded(true);
      const res = await fetch(`/api/user/${sessionId}`);
      const data = await res.json();
      const savedBooks = [];
      const cartIds = [];
      const queuedIds = [];

      for (const key in data.Cart) {
        cartIds.push(data.Cart[key].bookId);
      }

      for (const key in data.Queue) {
        const queueItem = data.Queue[key];
        queuedIds.push(queueItem.bookId);
      }

      for (const key in data.Saved) {
        const savedItem = data.Saved[key];
        const res = await fetch(`/api/book/${savedItem.bookId}`);
        const book = await res.json();

        let stockStatus = "";

        if (
          book.Queue[0]?.userId !== parseInt(sessionId) &&
          book.inStock &&
          book.Queue.length > 0
        ) {
          stockStatus = "notYours";
        } else if (
          book.Queue[0]?.userId === parseInt(sessionId) &&
          book.inStock
        ) {
          stockStatus = "yours";
        } else if (book.Queue.length === 0 && book.inStock) {
          stockStatus = "upForGrabs";
        } else if (
          book.Current[0]?.userId &&
          book.Current[0]?.userId === parseInt(sessionId)
        ) {
          stockStatus = "inYourPossession";
        }

        savedBooks.push({
          ...book,
          savedId: savedItem.id,
          current: book.Current[0]?.userId === parseInt(sessionId),
          stockStatus: stockStatus,
        });
      }

      setPageData(savedBooks);
      setCartIdList(cartIds);
      setQueuedLists(queuedIds);
      setIsLoaded(false);
    };
    getSaved();
  }, [session, reload]);

  const [addedToQueue, setAddedToQueue] = useState({
    bookId: 0,
    status: false,
  });

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
    setAddedToQueue({
      bookId,
      status: true,
    });
    setTimeout(() => {
      setAddedToQueue({
        bookId: 0,
        status: false,
      });
    }, 2000);
  };
  const [addedToCart, setAddedToCart] = useState({
    bookId: 0,
    status: false,
  });

  const handleCart = async (bookId: number) => {
    if (cartIdList.includes(bookId)) {
      setCartStatuses((prev) => ({ ...prev, [bookId]: "Already in cart" }));
      setTimeout(() => {
        setCartStatuses((prev) => ({ ...prev, [bookId]: "" }));
      }, 2000);
      return;
    }
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

    setAddedToCart({
      bookId,
      status: true,
    });

    setTimeout(() => {
      setAddedToCart({
        bookId: 0,
        status: false,
      });
    }, 2000);
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
    setReload(true);
  };

  if (isLoaded) {
    return <Loader />;
  }

  if (pageData.length === 0) {
    return (
      <div className="text-[26px] ">
        <h1>books saved</h1>
      </div>
    );
  }

  return (
    <div>
      {pageData.map((book) => (
        <div key={book.id} className="border-t-[2px] border-slate-400 mb-6">
          <div key={book.id} className="mt-4 flex justify-start w-full">
            <div className="max-w-[200px] mr-[50px]">
              <img className="" src={book.photo_front} />
            </div>

            <div className="w-3/4 text-[24px]">
              <h1 className="hover:line-through">
                <Link href={`/book/${book.title}`}>{book.title}</Link>
              </h1>
              <h1 className="mt-4">{book.author}</h1>
              {book.inStock && book.stockStatus === "yours" && (
                <>
                  <h1 className="text-slate-400 cursor-pointer">In Stock</h1>
                  <h1
                    className="text-slate-400 cursor-pointer hover:line-through"
                    onClick={() => removeSave(book.savedId as number)}
                  >
                    Remove
                  </h1>
                  <h1
                    className="text-red-500 cursor-pointer hover:line-through"
                    onClick={() => handleCart(book.id as number)}
                  >
                    {addedToCart.status && addedToCart.bookId === book.id
                      ? "Added to cart"
                      : cartStatuses[book.id as number] || "Add to cart"}
                  </h1>
                </>
              )}

              {book.inStock && book.stockStatus === "upForGrabs" && (
                <>
                  <h1 className="text-slate-400 cursor-pointer">In Stock</h1>
                  <h1
                    className="text-slate-400 cursor-pointer hover:line-through"
                    onClick={() => removeSave(book.savedId as number)}
                  >
                    Remove
                  </h1>
                  <h1
                    className="text-red-500 cursor-pointer hover:line-through"
                    onClick={() => handleCart(book.id as number)}
                  >
                    {addedToCart.status && addedToCart.bookId === book.id
                      ? "Added to cart"
                      : cartStatuses[book.id as number] || "Add to cart"}
                  </h1>
                </>
              )}
              {book.inStock && book.stockStatus === "notYours" && (
                <>
                  <h1 className="text-slate-400 cursor-pointer">
                    Out of Stock
                  </h1>
                  <h1
                    className="text-slate-400 cursor-pointer hover:line-through"
                    onClick={() => removeSave(book.savedId as number)}
                  >
                    Remove
                  </h1>
                  <h1
                    className="text-red-500 cursor-pointer hover:line-through"
                    onClick={() => getInLine(book.id as number)}
                  >
                    {addedToQueue.status && addedToQueue.bookId === book.id
                      ? "Added to queue"
                      : lineStatuses[book.id as number] || "Get in line"}
                  </h1>
                </>
              )}
              {!book.inStock && !book.current && (
                <>
                  <h1 className="text-slate-400 cursor-pointer">
                    Out of Stock
                  </h1>
                  <h1
                    className="text-slate-400 cursor-pointer hover:line-through"
                    onClick={() => removeSave(book.savedId as number)}
                  >
                    Remove
                  </h1>
                  <h1
                    className="text-red-500 cursor-pointer hover:line-through"
                    onClick={() => getInLine(book.id as number)}
                  >
                    {addedToQueue.status && addedToQueue.bookId === book.id
                      ? "Added to queue"
                      : lineStatuses[book.id as number] || "Get in line"}
                  </h1>
                </>
              )}

              <>
                {book.current && (
                  <>
                    <h1
                      className="text-slate-400 cursor-pointer hover:line-through"
                      onClick={() => removeSave(book.savedId as number)}
                    >
                      Remove
                    </h1>
                    <h1 className="text-red-500">In your posession</h1>
                  </>
                )}
              </>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Saved;
