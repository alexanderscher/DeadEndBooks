"use client";

import { PricingCard } from "../components";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Loader from "../components/Loader";
import { useMediaQuery } from "react-responsive";

const page = () => {
  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 800 });
  const [prices, setPrices] = useState<any>([]);
  console.log(prices);
  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    const res = await fetch("/api/getproducts");
    const data = await res.json();
    setPrices(data);
  };

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
