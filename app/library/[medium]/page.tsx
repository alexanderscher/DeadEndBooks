"use client";
import { Books, Loader, Navbar } from "@/app/components";
import React, { useEffect, useState } from "react";

import { useMediaQuery } from "react-responsive";

const page = () => {
  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 700 });
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
