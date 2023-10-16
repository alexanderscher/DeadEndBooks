"use client";
import React, { useEffect, useState } from "react";

import { useMediaQuery } from "react-responsive";
import { AdminNav, Loader, Navbar, PastRentals, Users } from "@/app/components";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ExtendedSession } from "@/types";

const page = () => {
  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 700 });
  const isMediumDeviceQuery = useMediaQuery({ maxWidth: 1200 });
  const [isMediumDevice, setIsMediumDevice] = useState<any>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && !(session as ExtendedSession)?.user?.admin) {
      router.push("/not-found");
    } else {
      setIsSmallDevice(isSmallDeviceQuery);
      setIsMediumDevice(isMediumDeviceQuery);
    }
  }, [isSmallDeviceQuery, isMediumDeviceQuery, session, status]);

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
            <AdminNav
              isSmallDevice={isSmallDevice}
              isMediumDevice={isMediumDevice}
            />
            <Users />
          </div>
        </>
      )}
    </main>
  );
};

export default page;
