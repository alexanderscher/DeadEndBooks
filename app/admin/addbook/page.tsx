"use client";
import React, { useEffect, useState } from "react";

import { useMediaQuery } from "react-responsive";
import { AddBook, AdminNav, Loader, Navbar } from "@/app/components";
import { ExtendedSession } from "@/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const page = () => {
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 700 });

  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);

  const isMediumDeviceQuery = useMediaQuery({ maxWidth: 900 });
  const [isMediumDevice, setIsMediumDevice] = useState<any>(null);

  const isMobileDeviceQuery = useMediaQuery({ maxWidth: 500 });
  const [isMobileDevice, setIsMobileDevice] = useState<any>(null);

  useEffect(() => {
    setIsSmallDevice(isSmallDeviceQuery);
    setIsMediumDevice(isMediumDeviceQuery);
    setIsMobileDevice(isMobileDeviceQuery);
  }, [isSmallDeviceQuery, isMediumDeviceQuery, isMobileDeviceQuery]);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    if (session && !(session as ExtendedSession)?.user?.admin) {
      router.push("/not-found");
    }
  }, [session, status]);

  if (status === "loading") {
    return <Loader />;
  }

  if (
    status === "unauthenticated" ||
    !(session as ExtendedSession)?.user?.admin
  ) {
    router.replace("/not-found");
    return null;
  }

  return (
    <main className={isSmallDevice ? "" : "page"}>
      <>
        <Navbar isSmallDevice={isSmallDevice} isMobileDevice={isMobileDevice} />

        <div className={"w-full"}>
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
