"use client";
import React, { useEffect, useState } from "react";

import { useMediaQuery } from "react-responsive";
import { EditBook, Loader, Navbar } from "@/app/components";

const page = () => {
  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 800 });
  const isMediumDeviceQuery = useMediaQuery({ maxWidth: 1000 });
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
          <div
            className={
              isSmallDevice ? "page-margin-small " : "page-margin w-full"
            }
          >
            <EditBook isSmallDevice={isSmallDevice} />
          </div>
        </>
      )}
    </main>
  );
};

export default page;
