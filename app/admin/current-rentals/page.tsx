"use client";
import React, { useEffect, useState } from "react";

import { useMediaQuery } from "react-responsive";
import Link from "next/link";
import {
  AddBook,
  AdminNav,
  CurrentRentals,
  Loader,
  Navbar,
} from "@/app/components";

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
          <div
            className={
              isSmallDevice ? "page-margin-small " : "page-margin w-full"
            }
          >
            {/* <Link href="/">
              <h1 className="text-[30px] hover:line-through">Home</h1>
            </Link> */}
            <AdminNav
              isSmallDevice={isSmallDevice}
              isMediumDevice={isMediumDevice}
            />
            <CurrentRentals
              isSmallDevice={isSmallDevice}
              isMediumDevice={isMediumDevice}
            />
          </div>
        </>
      )}
    </main>
  );
};

export default page;
