"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Loader from "../../components/Loader";
import { useMediaQuery } from "react-responsive";
import { usePathname, useRouter } from "next/navigation";

const page = () => {
  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 700 });
  const router = useRouter();
  const currentPage = usePathname();

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
            <div className={"flex justify-center"}>
              <div className="flex flex-col items-center ">
                <img
                  src="/dead-end-stripe.png"
                  className="max-w-[500px] w-full"
                  alt=""
                />
                <h1 className="text-[26px] text-red-500">
                  Subscription cancelled
                </h1>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default page;
