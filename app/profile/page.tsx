"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { useMediaQuery } from "react-responsive";
import Profile from "../components/Profile";
import Link from "next/link";
import { ProfileNav } from "../components";

const page = () => {
  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 800 });

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
          <div
            className={
              isSmallDevice ? "page-margin-small" : "page-margin w-full"
            }
          >
            <ProfileNav isSmallDevice={isSmallDevice} />

            <Profile />
          </div>
        </>
      )}
    </main>
  );
};

export default page;
