"use client";
import React, { useEffect, useState } from "react";

import { useMediaQuery } from "react-responsive";
import { Books, Loader, Navbar } from "../components";

const page = () => {
  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 700 });
  const isMediumDeviceQuery = useMediaQuery({ maxWidth: 900 });
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
