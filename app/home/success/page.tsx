"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Loader from "../../components/Loader";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const page = () => {
  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 800 });
  const router = useRouter();
  const currentPage = usePathname();

  useEffect(() => {
    setIsSmallDevice(isSmallDeviceQuery);
  }, [isSmallDeviceQuery]);

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
              isSmallDevice ? "page-margin-small" : " page-margin w-full"
            }
          >
            <div
              className={
                isSmallDevice
                  ? "mt-10 flex justify-center"
                  : "flex justify-center"
              }
            >
              <div className="flex flex-col items-center ">
                <img
                  src="/Screenshot 2023-09-18 at 4.38.04 PM.png"
                  className="max-w-[500px] w-3/4"
                  alt=""
                />
                <h1 className="text-[26px] "> Thanks for subscribing</h1>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default page;
