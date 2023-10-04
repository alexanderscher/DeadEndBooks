"use client";
import React, { useEffect, useState } from "react";

import { useMediaQuery } from "react-responsive";
import Link from "next/link";
import { Loader, Navbar, Saved } from "@/app/components";
import { useSession } from "next-auth/react";
import SingleBook from "@/app/components/Book/SingleBook";

const page = () => {
  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 800 });
  const { data: session, status } = useSession();

  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    if (session) {
      setisLoading(false);
    }
  }, [session]);

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

          {isLoading && session !== null ? (
            <Loader />
          ) : (
            <div
              className={
                isSmallDevice ? "page-margin-small" : "page-margin w-full"
              }
            >
              <SingleBook isSmallDevice={isSmallDevice} />
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default page;
