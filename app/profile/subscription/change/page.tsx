"use client";
import React, { useEffect, useState } from "react";

import { useMediaQuery } from "react-responsive";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Loader, Navbar, Profile, ProfileNav } from "@/app/components";
import ChangeSub from "@/app/components/Profile/ChangeSub";

const page = () => {
  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 700 });
  const { data: session } = useSession();

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

          {session ? (
            <div className={isSmallDevice ? "-small" : " w-full"}>
              <ProfileNav isSmallDevice={isSmallDevice} />
              <ChangeSub />
            </div>
          ) : (
            <div className={isSmallDevice ? "-small" : " w-full"}>
              <h1 className="text-[26px]">
                Login or sign up to view your subscription
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
