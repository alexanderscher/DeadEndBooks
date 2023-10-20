"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Loader from "../../components/Loader";
import { useMediaQuery } from "react-responsive";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ExtendedSession } from "@/types";

const page = () => {
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 700 });

  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);

  const isMediumDeviceQuery = useMediaQuery({ maxWidth: 900 });
  const [isMediumDevice, setIsMediumDevice] = useState<any>(null);

  const isMobileDeviceQuery = useMediaQuery({ maxWidth: 470 });
  const [isMobileDevice, setIsMobileDevice] = useState<any>(null);

  const { data: session, status } = useSession();
  const router = useRouter();
  const [sessionLoaded, setSessionLoaded] = useState(false);
  useEffect(() => {
    setIsSmallDevice(isSmallDeviceQuery);
    setIsMediumDevice(isMediumDeviceQuery);
    setIsMobileDevice(isMobileDeviceQuery);
  }, [isSmallDeviceQuery, isMediumDeviceQuery, isMobileDeviceQuery]);

  useEffect(() => {
    if (session && (session as ExtendedSession)?.user?.id) {
      setSessionLoaded(true);
    }
  }, [session, (session as ExtendedSession)?.user?.id]);

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
    <main className={isSmallDevice ? "mt-10" : "page"}>
      {isSmallDevice === null ? (
        <Loader />
      ) : (
        <>
          <Navbar
            isSmallDevice={isSmallDevice}
            isMobileDevice={isMobileDevice}
          />

          <div className={isSmallDevice ? "mt-10" : "  w-full"}>
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
