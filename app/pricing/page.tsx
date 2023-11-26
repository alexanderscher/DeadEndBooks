import { PricingCard } from "../components";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";

import { getServerSession } from "next-auth";
import { isProduction } from "@/utils/name";
import { ExtendedSession } from "@/types";
import { authOptions } from "@/utils/auth";

const page = async () => {
  const serverSession = await getServerSession(authOptions);
  const sessionId = (serverSession as ExtendedSession)?.user?.id;

  let prices: any = [];
  let userData: any = null;
  const url = isProduction();
  const res = await fetch(`${url}/api/stripe/getproducts`);
  const data = await res.json();
  prices = data;

  if (sessionId) {
    const res1 = await fetch(`${url}/api/user/${sessionId}`, {
      next: { tags: [`user-profile-${sessionId}`], revalidate: 60 * 60 * 24 },
    });
    userData = await res1.json();
  }

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
                  userData={userData}
                />
              ))}
          </div>
        </div>
      </>
    </main>
  );
};

export default page;
