"use client";
import {
  EditBook,
  EditProfile,
  Loader,
  Navbar,
  Profile,
  ProfileNav,
} from "@/app/components";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { useMediaQuery } from "react-responsive";

const page = () => {
  const { data: session } = useSession();
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 700 });

  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);

  const isMediumDeviceQuery = useMediaQuery({ maxWidth: 900 });
  const [isMediumDevice, setIsMediumDevice] = useState<any>(null);

  const isMobileDeviceQuery = useMediaQuery({ maxWidth: 460 });
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

              <EditProfile />
            </div>
          ) : (
            <div className={" w-full"}>
              <h1 className="text-[26px]">
                Log in or sign up to view your profile
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
