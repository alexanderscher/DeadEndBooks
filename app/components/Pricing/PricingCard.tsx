"use client";
import { ExtendedSession } from "@/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

interface priceProps {
  price: any;
}

const PricingCard = ({ price }: priceProps) => {
  const { data: session } = useSession();
  const sessionId = (session as ExtendedSession)?.user?.id;
  const [noSession, setNoSession] = useState(false);

  const handleSubscription = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!sessionId) {
      setNoSession(true);
    } else {
      const { data } = await axios.post(
        "/api/stripe/payment",
        {
          priceId: price.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      window.location.assign(data);
    }
  };

  return (
    <div>
      <h1
        className={`text-[30px] ${price.nickname === "Yearly Plan" && "mt-10"}`}
      >
        {price.nickname}
      </h1>
      <p className="text-[26px] text-slate-500">
        {(price.unit_amount / 100).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}{" "}
        {price.nickname === "Yearly Plan" ? "/year" : "/month"}
      </p>
      <button
        className="text-[26px] hover:line-through text-red-500"
        onClick={handleSubscription}
      >
        Subscribe
      </button>
      {noSession && (
        <p className="text-red-300 text-[26px]  ">Please login to subscribe</p>
      )}
    </div>
  );
};

export default PricingCard;
