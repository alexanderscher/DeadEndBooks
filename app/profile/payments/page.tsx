"use client";
import React, { useEffect, useState } from "react";

import { useMediaQuery } from "react-responsive";
import {
  History,
  Loader,
  Navbar,
  Payments,
  ProfileNav,
} from "@/app/components";

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
              isSmallDevice ? "page-margin-small " : "page-margin w-full"
            }
          >
            <ProfileNav isSmallDevice={isSmallDevice} />

            <Payments />
          </div>
        </>
      )}
    </main>
  );
};

export default page;
