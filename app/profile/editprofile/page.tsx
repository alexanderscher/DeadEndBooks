"use client";
import {
  EditBook,
  EditProfile,
  Loader,
  Navbar,
  Profile,
  ProfileNav,
} from "@/app/components";
import React, { useEffect, useState } from "react";

import { useMediaQuery } from "react-responsive";

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

            <EditProfile />
          </div>
        </>
      )}
    </main>
  );
};

export default page;
