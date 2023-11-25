"use client";
import { Book, ExtendedSession } from "@/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Loader } from "..";
import page from "@/app/page";
import { useDeviceQueries } from "@/utils/deviceQueries";

type Props = {
  res: any;
  session: any;
};
const Saved = ({ res, session }: Props) => {
  const { isSmallDevice, isMobileDevice } = useDeviceQueries();

  const [pageData, setPageData] = useState<Book[]>([]);
  const [userId, setUserId] = useState("");
  const [cartIdList, setCartIdList] = useState<number[]>([]);
  const [reload, setReload] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);
  const [cartStatuses, setCartStatuses] = useState<Record<number, string>>({});

  useEffect(() => {
    setReload(false);
    const sessionId = (session as ExtendedSession)?.user?.id;
    setUserId(sessionId);

    const getSaved = async () => {
      setIsLoaded(true);

      const data = await res;
      if (data === null) return;
      setCartIdList(data.map((book: Book) => book.id));

      setPageData(data);
      setIsLoaded(false);
    };
    getSaved();
  }, [session, reload]);

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
        userId,
      }),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      console.error("Error removing cart");
      // Handle error case here
    }
    setReload(true);
  };
  if (res === null) {
    return (
      <div className={`${isSmallDevice ? "mt-10" : " w-full"}`}>
        <h1 className="text-[26px]">
          Log in or sign up to view your saved books
        </h1>
        <div className="mt-10">
          <h1 className="text-red-500  hover:line-through text-[26px]">
            <Link href="/login">Log in</Link>
          </h1>
          <h1 className="text-red-500  hover:line-through text-[26px]">
            <Link href="/signup">Sign up</Link>
          </h1>
        </div>
      </div>
    );
  }

  if (isLoaded) {
    return <Loader />;
  }

  if (pageData.length === 0 && res !== null) {
    return (
      <div className="text-[26px] ">
        <h1>No books saved</h1>
      </div>
    );
  }

  return (
    <div>
      {pageData.map((book) => (
        <div key={book.id} className="border-t-[2px] border-slate-400 mb-6">
          <div key={book.id} className="mt-4 flex justify-start w-full">
            <div
              className={
                isMobileDevice
                  ? "max-w-[150px] mr-6"
                  : "max-w-[200px] mr-[50px]"
              }
            >
              <img
                className={isMobileDevice ? "max-w-[150px]" : "max-w-[200px] "}
                src={book.photo_front}
              />
            </div>
            <div
              className={`w-3/4 ${
                isMobileDevice ? "text-[18px] ml-4" : "text-[24px]"
              } `}
            >
              <h1 className="hover:line-through">
                <Link href={`/book/${book.id}`}>{book.title}</Link>
              </h1>
              <h1 className="mt-4">{book.author}</h1>
              {book.inStock && (
                <>
                  <h1 className="text-slate-400 cursor-pointer mt-4">
                    In Stock
                  </h1>
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

              {!book.inStock && (
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
