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

  const isMobileDeviceQuery = useMediaQuery({ maxWidth: 460 });
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
          <Navbar />

          <div className={isSmallDevice ? "" : "info text-end "}>
            <div className={isSmallDevice && "mt-6"}>
              <button className={isSmallDevice ? " text-[20px]" : ""}>
                How it works
              </button>
              <p
                className={isSmallDevice ? "text-[18px] mt-6" : "w-full mt-10"}
              >
                Subscribing to Dead End Books gives you access to a diverse
                collection of art books on painting, sculpture, photography,
                film, anthologies, exhibition catalogs, and magazines. After
                creating an account with your personal information, you will be
                able to checkout up to 3 books for 4 weeks at a time.
                Subscriptions are $16.85/month with a 3 month minimum or $188.00
                for the year. Local subscriptions are $10/month for Los Angeles
                residents who can pick up and drop off at our physical library.
                We will cover shipping costs. In your package from Dead End, you
                will receive a return label, and can send the books back to us
                in the box they came in. Subscription time starts a week after
                your order to account for shipping. As long as the postage is
                marked before or on your due date, the book will not be marked
                late. Late fees will begin on the 40th day of your subscription.
                The fee is $5/day. On the 50th day, we will consider the book
                lost or stolen, and will charge you the full price of the book.
              </p>
              <button
                className={
                  isSmallDevice
                    ? "hover:line-through mt-5 text-[20px] text-red-500"
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
