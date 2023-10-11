"use client";
import React, { useEffect, useState } from "react";

import { useMediaQuery } from "react-responsive";
import Link from "next/link";
import { Loader, Navbar, Cart, Checkout } from "@/app/components";
import { useSession } from "next-auth/react";
import { ExtendedSession } from "@/types";
import { useRouter } from "next/navigation";

const page = () => {
  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 800 });
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    if (session) {
      setisLoading(false);
      if (!(session as ExtendedSession)?.user?.isActive) {
        router.push("/subscribe");
      }
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
            <Loader /> // Show loader while session is being checked
          ) : session ? (
            <div
              className={
                isSmallDevice ? "page-margin-small" : "page-margin w-full"
              }
            >
              <Checkout />
            </div>
          ) : (
            <div
              className={
                isSmallDevice ? "page-margin-small" : "page-margin w-full"
              }
            >
              <h1 className="text-[30px]">
                Login or sign up to view your cart
              </h1>
              <div className="mt-10">
                <h1 className="text-red-500  hover:line-through text-[30px]">
                  <Link href="/login">Login</Link>
                </h1>
                <h1 className="text-red-500  hover:line-through text-[30px]">
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
