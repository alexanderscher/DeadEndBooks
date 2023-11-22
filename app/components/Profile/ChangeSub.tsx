"use client";

import React, { useEffect, useState } from "react";
import { PricingCard } from "..";
import { useSession } from "next-auth/react";

interface Props {
  res: any;
}
const ChangeSub = ({ res }: Props) => {
  const { data: session } = useSession();

  const [prices, setPrices] = useState<any>([]);

  useEffect(() => {
    setPrices(res);
  }, [res]);

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
