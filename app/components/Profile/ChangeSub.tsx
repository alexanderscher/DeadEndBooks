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
    <div>
      <div className="w-full mt-10">
        {prices &&
          prices.map((price: any) => (
            <PricingCard
              price={price}
              session={serverSession}
              userData={userData}
            />
          ))}
      </div>
    </div>
  );
};

export default ChangeSub;
