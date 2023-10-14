"use client";

import { PricingCard } from "../components";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Loader from "../components/Loader";
import { useMediaQuery } from "react-responsive";
import { ExtendedSession } from "@/types";
import { useSession } from "next-auth/react";

const page = () => {
  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 700 });
  const [prices, setPrices] = useState<any>([]);
  const { data: session } = useSession();

  console.log(prices);
  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    const res = await fetch("/api/stripe/getproducts");
    const data = await res.json();
    setPrices(data);
  };

  useEffect(() => {
    setIsSmallDevice(isSmallDeviceQuery);
  }, [isSmallDeviceQuery, session]);

  return (
    <main className={isSmallDevice ? "page-small" : "page"}>
      {isSmallDevice === null ? (
        <Loader />
      ) : (
        <>
          <Navbar isSmallDevice={isSmallDevice} />
          <div className={isSmallDevice ? "page-margin-small" : "page-margin"}>
            <div className="w-full ">
              {prices &&
                prices.map((price: any) => (
                  <PricingCard price={price} key={price.id} />
                ))}
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default page;
