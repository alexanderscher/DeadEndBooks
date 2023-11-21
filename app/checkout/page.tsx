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
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 700 });
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setisLoading] = useState(true);
  const isMobileDeviceQuery = useMediaQuery({ maxWidth: 460 });
  const [isMobileDevice, setIsMobileDevice] = useState<any>(null);

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
    setIsMobileDevice(isMobileDeviceQuery);
  }, [isSmallDeviceQuery, isMobileDeviceQuery]);

  return (
    <main className={isSmallDevice ? "" : "page"}>
      {isSmallDevice === null ? (
        <Loader />
      ) : (
        <>
          <Navbar />

          {isLoading && session !== null ? (
            <Loader /> // Show loader while session is being checked
          ) : session ? (
            <div className={" w-full"}>
              <Checkout
                isSmallDevice={isSmallDevice}
                isMobileDevice={isMobileDevice}
              />
            </div>
          ) : (
            <div className={isSmallDevice ? "mt-10" : " w-full"}>
              <h1 className="text-[26px]">
                Login or sign up to view your cart
              </h1>
              <div className="mt-10">
                <h1 className="text-red-500  hover:line-through text-[26px]">
                  <Link href="/login">Log in</Link>
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
