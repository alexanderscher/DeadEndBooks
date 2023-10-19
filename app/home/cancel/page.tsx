"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Loader from "../../components/Loader";
import { useMediaQuery } from "react-responsive";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ExtendedSession } from "@/types";

const page = () => {
  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 700 });
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sessionLoaded, setSessionLoaded] = useState(false);

  useEffect(() => {
    if (session && (session as ExtendedSession)?.user?.id) {
      setSessionLoaded(true);
      setIsSmallDevice(isSmallDeviceQuery);
    }
  }, [isSmallDeviceQuery, session, (session as ExtendedSession)?.user?.id]);

  if (status === "loading") {
    return <Loader />;
  }
  if (
    status === "unauthenticated" ||
    (!(session as ExtendedSession)?.user?.id && sessionLoaded)
  ) {
    router.replace("/not-found");
    return null;
  }
  return (
    <main className={isSmallDevice ? "" : "page"}>
      {isSmallDevice === null ? (
        <Loader />
      ) : (
        <>
          <Navbar
            isSmallDevice={isSmallDevice}
            isMobileDevice={isMobileDevice}
          />

          <div className={isSmallDevice ? "-small" : "  w-full"}>
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
