"use client";
import React, { useEffect, useState } from "react";

import { useMediaQuery } from "react-responsive";
import { usePathname, useRouter } from "next/navigation";
import { Loader, Navbar } from "@/app/components";
import { ExtendedSession } from "@/types";
import { useSession } from "next-auth/react";

const page = () => {
  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 700 });
  const { data: session, status } = useSession();
  const router = useRouter();
  const currentPath = usePathname();
  const [sessionLoaded, setSessionLoaded] = useState(false);

  useEffect(() => {
    if (session && (session as ExtendedSession)?.user?.isActive) {
      setSessionLoaded(true);
      setIsSmallDevice(isSmallDeviceQuery);
    }
  }, [
    isSmallDeviceQuery,
    session,

    (session as ExtendedSession)?.user?.isActive,
  ]);

  if (status === "loading") {
    return <Loader />;
  }
  if (
    status === "unauthenticated" ||
    (!(session as ExtendedSession)?.user?.isActive && sessionLoaded)
  ) {
    router.replace("/not-found");
    return null;
  }
  return (
    <main className={isSmallDevice ? "page-small" : "page"}>
      {isSmallDevice === null &&
      (session as ExtendedSession)?.user?.subscriptionID === undefined ? (
        <Loader />
      ) : (
        <>
          <Navbar isSmallDevice={isSmallDevice} />
          <div className={isSmallDevice ? "-small" : "  w-full"}>
            <div className={"flex justify-center "}>
              <div className={"flex justify-center"}>
                <div className="flex flex-col items-center ">
                  <img
                    src="/dead-end-stripe.png"
                    className="max-w-[500px] w-full"
                    alt=""
                  />
                  <h1 className="text-[26px] text-red-500">
                    Thanks for subscribing
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default page;
