"use client";
import React, { useEffect, useState } from "react";
import { PricingCard } from "../components";

const page = () => {
  const [prices, setPrices] = useState([]);
  useEffect(() => {
    fetchPrices();
  }, []);
  const fetchPrices = async () => {
    const res = await fetch("/api/getproducts");
    const data = await res.json();
    setPrices(data);
    console.log(data);
  };
  return (
    <section className="w-full">
      {prices &&
        prices.map((price) => <PricingCard price={price} key={price.id} />)}
    </section>
  );
};

export default page;
