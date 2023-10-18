"use client";

import React, { useEffect, useState } from "react";
import { PricingCard } from "..";
import { useSession } from "next-auth/react";

const ChangeSub = () => {
  const { data: session } = useSession();

  const [prices, setPrices] = useState<any>([]);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    const res = await fetch("/api/stripe/getproducts");
    const data = await res.json();
    setPrices(data);
  };

  return (
    <div>
      <div className="w-full mt-10">
        {prices &&
          prices.map((price: any) => (
            <PricingCard price={price} key={price.id} session={session} />
          ))}
      </div>
    </div>
  );
};

export default ChangeSub;
