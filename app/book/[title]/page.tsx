"use client";
import React, { use, useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Loader from "../../components/Loader";
import { useMediaQuery } from "react-responsive";
import { usePathname } from "next/navigation";
import { ExtendedSession } from "@/types";
import { useSession } from "next-auth/react";

const page = () => {
  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 800 });
  const currentPage = usePathname();
  const title = currentPage.split("/")[2];
  const { data: session } = useSession();
  const [userId, setuserId] = useState("");

  const [pageData, setPageData] = useState({
    id: "",
    title: "",
    author: "",
    publisher: "",
    photo_front: "",
    photo_back: "",
    inStock: false,
  });

  useEffect(() => {
    setIsSmallDevice(isSmallDeviceQuery);
  }, [isSmallDeviceQuery]);

  useEffect(() => {
    const getBook = async () => {
      const res = await fetch(`/api/book/${title}`);
      const data = await res.json();
      console.log(data);
      setPageData(data);
    };
    getBook();
  }, []);

  useEffect(() => {
    const sessionId = (session as ExtendedSession)?.user?.id;
    setuserId(sessionId);
  }, [session]);

  const [saved, setSaved] = useState(false);
  const [cart, setCart] = useState(false);
  const handleSave = async () => {
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

  return (
    <main className={isSmallDevice ? "page-small" : "page"}>
      {isSmallDevice === null ? (
        <Loader />
      ) : (
        <>
          <Navbar isSmallDevice={isSmallDevice} />
          <div
            className={`flex ${
              isSmallDevice ? "page-margin-small" : "page-margin"
            }`}
          >
            <div className={`flex w-full ${isSmallDevice && "mt-10"}`}>
              <div className="w-1/2 flex flex-col ">
                <img
                  className={`mb-6 ${
                    isSmallDevice ? "w-[85%]" : "w-[80%]"
                  } min-w-[200px]`}
                  src={pageData.photo_front}
                />
                <img
                  className={`mb-6 ${
                    isSmallDevice ? "w-[85%]" : "w-[80%]"
                  } min-w-[200px]`}
                  src={pageData.photo_back}
                />
              </div>
              <div className="w-1/2">
                <h1
                  className={
                    isSmallDevice
                      ? "text-[24px]  text-slate-400 "
                      : "book-text  text-slate-400 "
                  }
                >
                  Title
                </h1>
                <h1 className={isSmallDevice ? "text-[25px] " : "book-text "}>
                  {pageData.title}
                </h1>
                <h1
                  className={
                    isSmallDevice
                      ? "text-[24px]  text-slate-400 mt-4"
                      : "book-text  text-slate-400 mt-4"
                  }
                >
                  Author
                </h1>
                <h1 className={isSmallDevice ? "text-[24px]  " : "book-text  "}>
                  {pageData.author}
                </h1>
                <h1
                  className={
                    isSmallDevice
                      ? "text-[24px]  text-slate-400 mt-4"
                      : "book-text  text-slate-400 mt-4"
                  }
                >
                  Publisher
                </h1>
                <h1 className={isSmallDevice ? "text-[24px]" : "book-text"}>
                  {pageData.publisher}
                </h1>
                <h1
                  className={
                    isSmallDevice
                      ? "text-[24px] text-red-500 mt-10"
                      : "book-text text-red-500 mt-10"
                  }
                >
                  {pageData.inStock ? "In stock" : "Out of stock"}
                </h1>
                <h1
                  className={`${
                    isSmallDevice ? "text-[24px]" : "book-text"
                  }  cursor-pointer hover:line-through text-red-500`}
                  onClick={handleSave}
                >
                  {saved ? "Saved" : "Save"}
                </h1>
                <h1
                  className={`${
                    isSmallDevice ? "text-[24px]" : "book-text"
                  }  cursor-pointer hover:line-through text-red-500`}
                  onClick={handleCart}
                >
                  {cart ? "Added to cart" : "Add to cart"}
                </h1>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default page;
