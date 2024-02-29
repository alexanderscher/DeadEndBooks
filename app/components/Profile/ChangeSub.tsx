import React, { useEffect, useState } from "react";
import { PricingCard } from "..";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { ExtendedSession } from "@/types";
import { isProduction } from "@/utils/name";

interface Props {
  res: any;
}
const ChangeSub = async () => {
  const serverSession = await getServerSession(authOptions);
  let prices: any = [];
  const url = isProduction();
  const res = await fetch(`${url}/api/stripe/getproducts`);
  const data = await res.json();
  prices = data;

  return (
    <div>
      <div className="w-full mt-10">
        {prices &&
          prices.map((price: any) => (
            <PricingCard price={price} session={serverSession} />
          ))}
      </div>
    </div>
  );
};

export default ChangeSub;
