"use client";
import React, { use, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ExtendedSession } from "@/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  isSmallDevice: boolean;
  isMobileDevice: boolean;
}
const SingleBook = ({ isSmallDevice, isMobileDevice }: Props) => {
  const currentPage = usePathname();
  const title = currentPage.split("/")[2];
  const router = useRouter();
  const { data: session } = useSession();
  const [userId, setuserId] = useState("");
  const [queuedLists, setQueuedLists] = useState<number[]>([]);
  const [savedLists, setSavedLists] = useState<number[]>([]);
  const [cartLists, setCartLists] = useState<number[]>([]);
  const [savedStatuses, setSavedStatuses] = useState<Record<number, string>>(
    {}
  );
  const [cartStatuses, setCartStatuses] = useState<Record<number, string>>({});
  const [linetatuses, setLinetatuses] = useState<Record<number, string>>({});
  const [saved, setSaved] = useState(false);
  const [cart, setCart] = useState(false);

  const [stock, setStock] = useState({
    upForGrabs: false,
    yours: false,
    notYours: false,
    inYourPossesion: false,
  });

  const [pageData, setPageData] = useState({
    id: "",
    title: "",
    author: "",
    publisher: "",
    photo_front: "",
    photo_back: "",
    inStock: false,
  });

  const text = isMobileDevice ? "text-[20px]" : "text-[24px]";

  useEffect(() => {
    const sessionId = (session as ExtendedSession)?.user?.id;
    setuserId(sessionId);

    const getBook = async () => {
      const res = await fetch(`/api/book/${title}`);
      const data = await res.json();
      const queuedIds = [];
      const savedIds = [];
      const cartIds = [];
      if (res.status === 404) {
        router.push("/not-found");
        return;
      }

      for (const key in data.Saved) {
        savedIds.push(data.Saved[key].userId);
      }

      for (const key in data.Queue) {
        queuedIds.push(data.Queue[key].userId);
      }

      for (const key in data.Cart) {
        cartIds.push(data.Cart[key].userId);
      }

      if (
        data.Queue[0]?.userId !== parseInt(sessionId) &&
        data.inStock &&
        data.Queue.length > 0
      ) {
        setStock((prev) => ({ ...prev, notYours: true }));
      }
      if (data.Queue[0]?.userId === parseInt(sessionId) && data.inStock) {
        setStock((prev) => ({ ...prev, yours: true }));
      }
      if (data.Queue.length === 0 && data.inStock) {
        setStock((prev) => ({ ...prev, upForGrabs: true }));
      }
      if (
        data.Current[0]?.userId &&
        data.Current[0]?.userId === parseInt(sessionId)
      ) {
        setStock((prev) => ({ ...prev, inYourPossesion: true }));
      }

      setPageData(data);
      setQueuedLists(queuedIds);
      setSavedLists(savedIds);
      setCartLists(cartIds);
    };
    getBook();
  }, [sessionStorage, saved, cart]);

  const handleSave = async () => {
    const uId = parseInt(userId);

    if (savedLists.includes(uId)) {
      setSavedStatuses((prev) => ({ ...prev, [uId]: "Already Saved" }));
      setTimeout(() => {
        setSavedStatuses((prev) => ({ ...prev, [uId]: "" }));
      }, 2000);
      return;
    }
    const res = await fetch(`/api/saved`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookId: pageData.id,
        userId: userId,
      }),
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  const handleCart = async () => {
    const uId = parseInt(userId);

    if (cartLists.includes(uId)) {
      setCartStatuses((prev) => ({ ...prev, [uId]: "Already in cart" }));
      setTimeout(() => {
        setCartStatuses((prev) => ({ ...prev, [uId]: "" }));
      }, 2000);
      return;
    }
    const res = await fetch(`/api/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookId: pageData.id,
        userId: userId,
      }),
    });
    setCart(true);
    setTimeout(() => {
      setCart(false);
    }, 2000);
  };

  const [queued, setQueued] = useState(false);

  const getInLine = async (bookId: number) => {
    const uId = parseInt(userId);

    if (queuedLists.includes(uId)) {
      setLinetatuses((prev) => ({ ...prev, [uId]: "Already in queue" }));
      setTimeout(() => {
        setLinetatuses((prev) => ({ ...prev, [uId]: "" }));
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
        userId,
        bookId,
      }),
    });

    setQueued(true);
    setTimeout(() => {
      setQueued(false);
    }, 2000);
  };

  return (
    <div className={`flex w-full ${isSmallDevice && "mt-10"}`}>
      <div className="w-1/2 flex flex-col ">
        <img
          className={
            isMobileDevice
              ? "w-[85%] mb-6 min-w-[100px]"
              : isSmallDevice
              ? "w-[85%] min-w-[200px] mb-6"
              : "w-[80%] min-w-[200px] mb-6"
          }
          src={pageData.photo_front}
        />
        <img
          className={
            isMobileDevice
              ? "w-[85%] mb-6 min-w-[100px]"
              : isSmallDevice
              ? "w-[85%] min-w-[200px] mb-6"
              : "w-[80%] min-w-[200px] mb-6"
          }
          src={pageData.photo_back}
        />
      </div>
      <div className="w-1/2">
        <h1
          className={
            isSmallDevice
              ? `${text}  text-slate-400`
              : "book-text  text-slate-400"
          }
        >
          Title
        </h1>
        <h1 className={isSmallDevice ? `${text}` : "book-text "}>
          {pageData.title}
        </h1>
        <h1
          className={
            isSmallDevice
              ? `${text}  text-slate-400 mt-4`
              : "book-text  text-slate-400 mt-4"
          }
        >
          Author
        </h1>
        <h1 className={isSmallDevice ? `${text}` : "book-text"}>
          {pageData.author}
        </h1>
        <h1
          className={
            isSmallDevice
              ? `${text}  text-slate-400 mt-4`
              : "book-text  text-slate-400 mt-4"
          }
        >
          Publisher
        </h1>
        <h1 className={isSmallDevice ? `${text}` : "book-text"}>
          {pageData.publisher}
        </h1>

        {!userId ? (
          <>
            <h1
              className={`${
                isSmallDevice ? `${text}` : "book-text mt-10"
              }  cursor-pointer hover:line-through text-red-500 mt-10`}
            >
              You must have an account to checkout books
            </h1>
            <Link href="/login">
              <h1
                className={`${
                  isSmallDevice ? `${text}` : "book-text mt-8"
                }  cursor-pointer hover:line-through text-red-500 mt-8`}
              >
                Login
              </h1>
            </Link>

            <Link href="/signup">
              <h1
                className={`${
                  isSmallDevice ? `${text}` : "book-text "
                }  cursor-pointer hover:line-through text-red-500 `}
              >
                {" "}
                Signup
              </h1>
            </Link>
          </>
        ) : (
          <>
            {stock.inYourPossesion ? (
              <div>
                <h1
                  className={`${
                    isSmallDevice ? `${text}` : "book-text mt-10"
                  }  cursor-pointer hover:line-through text-red-500 mt-10`}
                  onClick={handleSave}
                >
                  {saved ? "Saved" : savedStatuses[parseInt(userId)] || "Save"}
                </h1>
                <h1
                  className={`${
                    isSmallDevice ? `${text}` : "book-text"
                  }   text-red-500`}
                >
                  In your possesion
                </h1>
              </div>
            ) : (
              <div>
                <h1
                  className={
                    isSmallDevice
                      ? `${text} text-red-500 mt-10`
                      : "book-text text-red-500 mt-10"
                  }
                >
                  {pageData.inStock && stock.yours
                    ? "In stock"
                    : pageData.inStock && stock.upForGrabs
                    ? "In stock"
                    : pageData.inStock && stock.notYours
                    ? "Out of stock"
                    : !pageData.inStock && "Out of stock"}
                </h1>
                <h1
                  className={`${
                    isSmallDevice ? `${text}` : "book-text"
                  }  cursor-pointer hover:line-through text-red-500`}
                  onClick={handleSave}
                >
                  {saved ? "Saved" : savedStatuses[parseInt(userId)] || "Save"}
                </h1>
                {pageData.inStock && stock.yours && (
                  <h1
                    className={`${
                      isSmallDevice ? `${text}` : "book-text"
                    }  cursor-pointer hover:line-through text-red-500`}
                    onClick={handleCart}
                  >
                    {cart
                      ? "Added to cart"
                      : cartStatuses[parseInt(userId)] || "Add to cart"}
                  </h1>
                )}
                {pageData.inStock && stock.upForGrabs && (
                  <h1
                    className={`${
                      isSmallDevice ? `${text}` : "book-text"
                    }  cursor-pointer hover:line-through text-red-500`}
                    onClick={handleCart}
                  >
                    {cart
                      ? "Added to cart"
                      : cartStatuses[parseInt(userId)] || "Add to cart"}
                  </h1>
                )}
                {pageData.inStock && stock.notYours && (
                  <h1
                    className={`${
                      isSmallDevice ? `${text}` : "book-text"
                    }  cursor-pointer hover:line-through text-red-500`}
                    onClick={() => getInLine(parseInt(pageData.id))}
                  >
                    {queued
                      ? "In queue"
                      : linetatuses[parseInt(userId)] || "Get in line"}
                  </h1>
                )}
                {!pageData.inStock && (
                  <h1
                    className={`${
                      isSmallDevice ? `${text}` : "book-text"
                    }  cursor-pointer hover:line-through text-red-500`}
                    onClick={() => getInLine(parseInt(pageData.id))}
                  >
                    {queued
                      ? "In queue"
                      : linetatuses[parseInt(userId)] || "Get in line"}
                  </h1>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SingleBook;
