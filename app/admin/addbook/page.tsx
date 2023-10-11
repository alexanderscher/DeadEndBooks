"use client";
import React, { useEffect, useState } from "react";

import { useMediaQuery } from "react-responsive";
import Link from "next/link";
import { AddBook, AdminNav, Loader, Navbar } from "@/app/components";
import { ExtendedSession } from "@/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const page = () => {
  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 800 });
  const isMediumDeviceQuery = useMediaQuery({ maxWidth: 1000 });
  const [isMediumDevice, setIsMediumDevice] = useState<any>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [done, setDone] = useState(false);

  useEffect(() => {
    if (session && !(session as ExtendedSession)?.user?.admin) {
      router.push("/not-found");
    } else {
      setIsSmallDevice(isSmallDeviceQuery);
      setIsMediumDevice(isMediumDeviceQuery);
    }
  }, [isSmallDeviceQuery, isMediumDeviceQuery, session, status]);

  if (
    status === "loading" ||
    status === "unauthenticated" ||
    !(session as ExtendedSession)?.user?.admin
  ) {
    return <Loader />;
  }

  return (
    <main className={isSmallDevice ? "page-small" : "page"}>
      <>
        <Navbar isSmallDevice={isSmallDevice} />
        <div
          className={
            isSmallDevice ? "page-margin-small " : "page-margin w-full"
          }
        >
          <AdminNav
            isSmallDevice={isSmallDevice}
            isMediumDevice={isMediumDevice}
          />
          <AddBook />
        </div>
      </>
    </main>
  );
};

export default page;
