import { PricingCard } from "../components";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";

import { getServerSession } from "next-auth";
import { isProduction } from "@/utils/name";
import { ExtendedSession } from "@/types";
import { authOptions } from "@/utils/auth";

const page = async () => {
  const serverSession = await getServerSession(authOptions);

  let prices: any = [];
  const url = isProduction();
  const res = await fetch(`${url}/api/stripe/getproducts/shop`);
  const data = await res.json();
  prices = data;

  return (
    <main className={"page"}>
      <>
        <Navbar />

        <div>
          <div className="w-full ">
            {prices &&
              prices.map((price: any) => (
                <PricingCard
                  price={price}
                  key={price.id}
                  session={serverSession}
                />
              ))}
          </div>
        </div>
      </>
    </main>
  );
};

export default page;
