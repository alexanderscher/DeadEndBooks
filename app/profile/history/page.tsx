"use client";
import React, { useEffect, useState } from "react";

import { useMediaQuery } from "react-responsive";
import { History, Loader, Navbar, ProfileNav } from "@/app/components";
import Link from "next/link";
import { useSession } from "next-auth/react";

const page = () => {
  const { data: session } = useSession();
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 700 });

  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);

  const isMediumDeviceQuery = useMediaQuery({ maxWidth: 900 });
  const [isMediumDevice, setIsMediumDevice] = useState<any>(null);

  const isMobileDeviceQuery = useMediaQuery({ maxWidth: 500 });
  const [isMobileDevice, setIsMobileDevice] = useState<any>(null);

  useEffect(() => {
    setIsSmallDevice(isSmallDeviceQuery);
    setIsMediumDevice(isMediumDeviceQuery);
    setIsMobileDevice(isMobileDeviceQuery);
  }, [isSmallDeviceQuery, isMediumDeviceQuery, isMobileDeviceQuery]);

  return (
    <main className={isSmallDevice ? "" : "page"}>
      {isSmallDevice === null ? (
        <Loader />
      ) : (
        <>
          <Navbar
            isSmallDevice={isSmallDevice}
            isMobileDevice={isMobileDevice}
          />

          {session ? (
            <div className={" w-full"}>
              <ProfileNav
                isSmallDevice={isSmallDevice}
                isMobileDevice={isMobileDevice}
              />

              <History />
            </div>
          ) : (
            <div className={" w-full"}>
              <h1 className="text-[26px]">
                Login or sign up to view your profile
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
