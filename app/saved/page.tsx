"use client";
import React, { useEffect, useState } from "react";

import { useMediaQuery } from "react-responsive";
import Link from "next/link";
import { Loader, Navbar, Saved } from "@/app/components";
import { useSession } from "next-auth/react";

const page = () => {
  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 700 });
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
          ) : session ? (
            <div
              className={
                isSmallDevice ? "page-margin-small" : "page-margin w-full"
              }
            >
              <Saved />
            </div>
          ) : (
            <div
              className={
                isSmallDevice ? "page-margin-small" : "page-margin w-full"
              }
            >
              <h1 className="text-[26px]">
                Login or sign up to view your saved books
              </h1>
              <div className="mt-10">
                <h1 className="text-red-500  hover:line-through text-[26px]">
                  <Link href="/login">Login</Link>
                </h1>
                <h1 className="text-red-500  hover:line-through text-[26px]">
                  <Link href="/signup">Sign up</Link>
                </h1>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default page;
