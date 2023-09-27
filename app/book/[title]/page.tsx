"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import { useMediaQuery } from "react-responsive";
import { usePathname } from "next/navigation";

const page = () => {
  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 800 });
  const currentPage = usePathname();
  const title = currentPage.split("/")[2];
  const [pageData, setPageData] = useState({
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
                >
                  Save
                </h1>
                <h1
                  className={`${
                    isSmallDevice ? "text-[24px]" : "book-text"
                  }  cursor-pointer hover:line-through text-red-500`}
                >
                  Add to cart
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
