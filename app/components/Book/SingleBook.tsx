"use client";
import React, { use, useEffect, useState } from "react";
import { ExtendedSession } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader } from "..";
import { useDeviceQueries } from "@/utils/deviceQueries";
import { useSession } from "next-auth/react";

interface Props {
  title: string;
}

const SingleBook = ({ title }: Props) => {
  const { data: session, status } = useSession();
  const { isSmallDevice, isMobileDevice } = useDeviceQueries();
  const router = useRouter();

  const [userId, setuserId] = useState("");

  const [savedLists, setSavedLists] = useState<number[]>([]);
  const [cartLists, setCartLists] = useState<number[]>([]);
  const [savedStatuses, setSavedStatuses] = useState<Record<number, string>>(
    {}
  );
  const [cartStatuses, setCartStatuses] = useState<Record<number, string>>({});
  const [saved, setSaved] = useState(false);
  const [cart, setCart] = useState(false);

  const [stock, setStock] = useState({
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

  const smtext = isMobileDevice ? "text-[16px]" : "text-[24px]";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      setuserId((session as ExtendedSession).user.id);
    }
  }, [session]);

  useEffect(() => {
    const getBook = async () => {
      const res = await fetch(`/api/book/${title}`, {
        method: "GET",
        cache: "no-store",
      });
      const data = await res.json();
      console.log(data);
      const status = res.status;
      const savedIds = [];
      const cartIds = [];
      console.log(status);
      if (status === 404) {
        router.push("/not-found");
        return;
      }

      for (const key in data.Saved) {
        savedIds.push(data.Saved[key].userId);
      }

      for (const key in data.Cart) {
        cartIds.push(data.Cart[key].userId);
      }

      if (
        session &&
        data.Current[0]?.userId &&
        data.Current[0]?.userId ===
          parseInt((session as ExtendedSession).user.id)
      ) {
        setStock((prev) => ({ ...prev, inYourPossesion: true }));
      }

      setPageData(data);
      setSavedLists(savedIds);
      setCartLists(cartIds);
      setLoading(false);
    };
    getBook();
  }, [saved, cart, userId]);

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
  if (loading) {
    return <Loader />;
  }
  return (
    <div className={"w-full"}>
      <div className={`flex w-full ${isSmallDevice && "mt-10"}`}>
        {isSmallDevice ? (
          <>
            <div className="w-full">
              <div className="flex flex-col ">
                <div className="w-full">
                  <h1 className={`${text}  text-slate-400`}>Title</h1>
                  <h1 className={`${text} border-b-[2px] border-slate-300`}>
                    {pageData.title}
                  </h1>
                  <h1 className={`${text}  text-slate-400 mt-4`}>Author</h1>
                  <h1 className={`${text} border-b-[2px] border-slate-300`}>
                    {pageData.author}
                  </h1>
                  <h1 className={`${text}  text-slate-400 mt-4`}>Publisher</h1>
                  <h1 className={`${text} border-b-[2px] border-slate-300`}>
                    {pageData.publisher}
                  </h1>
                </div>
                <div className="w-1/2">
                  {!userId ? (
                    <div className="mt-4">
                      <h1 className={` text-red-300 ${text} `}>
                        Log in to checkout books
                      </h1>
                      <Link href="/login">
                        <h1
                          className={`book-text mt-4 ${text}
                        }  cursor-pointer hover:line-through text-red-500 mt-4`}
                        >
                          Log in
                        </h1>
                      </Link>

                      <Link href="/signup">
                        <h1
                          className={`${text}
                     cursor-pointer hover:line-through text-red-500 `}
                        >
                          Signup
                        </h1>
                      </Link>
                    </div>
                  ) : (
                    <>
                      {stock.inYourPossesion ? (
                        <div className="mt-4">
                          <h1
                            className={`${text}
                  
                       cursor-pointer hover:line-through text-red-500`}
                            onClick={handleSave}
                          >
                            {saved
                              ? "Saved"
                              : savedStatuses[parseInt(userId)] || "Save"}
                          </h1>
                          <h1
                            className={`${text}
                        text-red-500`}
                          >
                            In your possesion
                          </h1>
                        </div>
                      ) : (
                        <div className="mt-4">
                          <h1 className={`${text} text-red-500 `}>
                            {pageData.inStock && "In stock"}
                          </h1>
                          <h1
                            className={`${text}
                       cursor-pointer hover:line-through text-red-500`}
                            onClick={handleSave}
                          >
                            {saved
                              ? "Saved"
                              : savedStatuses[parseInt(userId)] || "Save"}
                          </h1>
                          {pageData.inStock && (
                            <h1
                              className={`${text} 
                            }  cursor-pointer hover:line-through text-red-500`}
                              onClick={handleCart}
                            >
                              {cart
                                ? "Added to cart"
                                : cartStatuses[parseInt(userId)] ||
                                  "Add to cart"}
                            </h1>
                          )}

                          {!pageData.inStock && (
                            <h1
                              className={`${text}
                            }  cursor-pointer hover:line-through text-red-500`}
                            >
                              Out of stock
                            </h1>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="w-full flex flex-col items-center mt-10">
                <img className="w-full mb-4" src={pageData.photo_front} />
                <img className="w-full" src={pageData.photo_back} />
              </div>
            </div>
          </>
        ) : (
          <>
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
                      isSmallDevice ? `${smtext}` : "book-text mt-10"
                    }  cursor-pointer  text-red-500 mt-10`}
                  >
                    Please log in to checkout books
                  </h1>
                  <Link href="/login">
                    <h1
                      className={`${
                        isSmallDevice ? `${smtext}` : "book-text mt-8"
                      }  cursor-pointer hover:line-through text-red-500 mt-8`}
                    >
                      Log in
                    </h1>
                  </Link>

                  <Link href="/signup">
                    <h1
                      className={`${
                        isSmallDevice ? `${smtext}` : "book-text "
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
                        {saved
                          ? "Saved"
                          : savedStatuses[parseInt(userId)] || "Save"}
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
                        {pageData.inStock && "In stock"}
                      </h1>
                      <h1
                        className={`${
                          isSmallDevice ? `${text}` : "book-text"
                        }  cursor-pointer hover:line-through text-red-500`}
                        onClick={handleSave}
                      >
                        {saved
                          ? "Saved"
                          : savedStatuses[parseInt(userId)] || "Save"}
                      </h1>
                      {pageData.inStock && (
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

                      {!pageData.inStock && (
                        <h1
                          className={`${
                            isSmallDevice ? `${text}` : "book-text"
                          }  cursor-pointer hover:line-through text-red-500`}
                        >
                          Out of stock
                        </h1>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SingleBook;
