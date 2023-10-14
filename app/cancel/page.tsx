"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Loader from "../components/Loader";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";

const page = () => {
  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 700 });

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
            <div className={isSmallDevice && "mt-10"}>
              <div className="flex flex-col items-center w-full ">
                <img src="Screenshot 2023-09-18 at 4.38.04 PM.png" alt="" />
                <h1 className="text-[40px]">Failed to subscribe</h1>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default page;
