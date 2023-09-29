"use client";
import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Loader from "./components/Loader";
import { useMediaQuery } from "react-responsive";
import Books from "./components/Home/Books";

const page = () => {
  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 800 });
  const isMediumDeviceQuery = useMediaQuery({ maxWidth: 1200 });
  const [isMediumDevice, setIsMediumDevice] = useState<any>(null);

  useEffect(() => {
    setIsSmallDevice(isSmallDeviceQuery);
    setIsMediumDevice(isMediumDeviceQuery);
  }, [isSmallDeviceQuery, isMediumDeviceQuery]);

  return (
    <main className={isSmallDevice ? "page-small" : "page"}>
      {isSmallDevice === null ? (
        <Loader />
      ) : (
        <>
          <Navbar isSmallDevice={isSmallDevice} />

          <Books
            isSmallDevice={isSmallDevice}
            isMediumDevice={isMediumDevice}
          />
        </>
      )}
    </main>
  );
};

export default page;
