"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Loader from "../components/Loader";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";

const page = () => {
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 700 });

  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);

  const isMediumDeviceQuery = useMediaQuery({ maxWidth: 900 });
  const [isMediumDevice, setIsMediumDevice] = useState<any>(null);

  const isMobileDeviceQuery = useMediaQuery({ maxWidth: 470 });
  const [isMobileDevice, setIsMobileDevice] = useState<any>(null);

  useEffect(() => {
    setIsSmallDevice(isSmallDeviceQuery);
    setIsMediumDevice(isMediumDeviceQuery);
    setIsMobileDevice(isMobileDeviceQuery);
  }, [isSmallDeviceQuery, isMediumDeviceQuery, isMobileDeviceQuery]);
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

          <div className={isSmallDevice ? "-small" : "info text-end "}>
            <div className={isSmallDevice && "mt-10"}>
              <button className={isSmallDevice ? " text-[20px]" : ""}>
                How it works
              </button>
              <p
                className={isSmallDevice ? "text-[18px] mt-6" : "w-full mt-10"}
              >
                Subscribing to Deadend Books gives you access to a diverse
                collection of art books on painting, sculpture, photography,
                film, anthologies, exhibition catalogs, and magazines. After
                creating an account with your personal information, you will be
                able to check our up to 3 books for 4 weeks at a time.
                Subscriptions are $16.85/month or $188.00 for the year. We will
                cover shipping costs. In your package from Deadend, you will
                receive a return label, and can send the books back to us in the
                box they came in. Subscription time starts 3 days after your
                order (to account for shipping time). Your account will show the
                subscription end date. Late fees will be charged if books are
                not returned on time. The fee will be $5 a day. 2 weeks past the
                return date, your card will automatically be charged the price
                of the book.
              </p>
              <button
                className={
                  isSmallDevice
                    ? "hover:line-through mt-6 text-[20px] text-red-500"
                    : "hover:line-through mt-10 text-red-500"
                }
              >
                <Link href="/pricing">Register</Link>
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default page;
