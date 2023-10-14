"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Loader from "../components/Loader";
import { useMediaQuery } from "react-responsive";
import Profile from "../components/Profile/Profile";
import { ProfileNav } from "../components";
import { useSession } from "next-auth/react";
import Link from "next/link";

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
            <div
              className={
                isSmallDevice ? "page-margin-small" : "page-margin w-full"
              }
            >
              <ProfileNav isSmallDevice={isSmallDevice} />

              <Profile />
            </div>
          ) : (
            <div
              className={
                isSmallDevice ? "page-margin-small" : "page-margin w-full"
              }
            >
              <h1 className="text-[30px]">
                Login or sign up to view your profile
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
