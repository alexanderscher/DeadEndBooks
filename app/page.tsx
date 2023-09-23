"use client";
import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";
import { useMediaQuery } from "react-responsive";
import Books from "./components/Books";
import BooksSmall from "./components/BooksSmall";

const page = () => {
  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 800 });

  useEffect(() => {
    setIsSmallDevice(isSmallDeviceQuery);
  }, [isSmallDeviceQuery]);

  return (
    <main className={isSmallDevice ? "page-small" : "page"}>
      {isSmallDevice === null ? (
        <Loader />
      ) : (
        <>
          <Navbar isSmallDevice={isSmallDevice} />
          {isSmallDevice ? (
            <div className="mt-6">
              <BooksSmall />
            </div>
          ) : (
            <Books />
          )}
        </>
      )}
    </main>
  );
};

export default page;
