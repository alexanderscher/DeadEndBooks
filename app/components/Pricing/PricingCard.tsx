"use client";
import { ExtendedSession } from "@/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Loader } from "..";
import { usePathname } from "next/navigation";

interface priceProps {
  price: any;
  session: any;
}

const PricingCard = ({ price, session }: priceProps) => {
  const sessionId = (session as ExtendedSession)?.user?.id;
  const subscriptionID = (session as ExtendedSession)?.user?.subscriptionID;
  const [noSession, setNoSession] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const currentPage = usePathname();
  const [userSub, setUserSub] = useState("");

  const changeSubscription = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      if (currentPage === "/profile/subscription") {
        e.preventDefault();

        if (!sessionId) {
          setNoSession(true);
        } else {
          const { data } = await axios.post(
            "/api/stripe/subscription-change",
            {
              subscriptionID: subscriptionID,
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      console.log((session as ExtendedSession)?.user?.id);

      const res = await fetch(
        `/api/user/${(session as ExtendedSession)?.user?.id}`
      );
      const data = await res.json();
      setUserSub(data.subscriptionType);
    };
    if (sessionId) {
      setisLoading(true);
      getUser();
      setisLoading(false);
    }
  }, [session]);

  const handleSubscription = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!sessionId) {
      setNoSession(true);
    } else {
      const { data } = await axios.post(
        "/api/stripe/payment",
        {
          priceId: price.id,
          subscriptionID: subscriptionID,
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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <h1
        className={`text-[30px] ${price.nickname === "Yearly Plan" && "mt-10"}`}
      >
        {price.nickname}
      </h1>
      <p className="text-[30px] text-slate-500">
        {(price.unit_amount / 100).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}{" "}
        {price.nickname === "Yearly Plan" ? "/year" : "/month"}
      </p>

      {userSub === price.nickname && sessionId ? (
        <h1 className="text-[30px] hover:line-through text-red-300">
          Current subscription
        </h1>
      ) : currentPage === "/profile/subscription" ? (
        <button
          className="text-[30px] hover:line-through text-red-500"
          onClick={changeSubscription}
        >
          Subscribe
        </button>
      ) : (
        <button
          className="text-[30px] hover:line-through text-red-500"
          onClick={handleSubscription}
        >
          Subscribe
        </button>
      )}

      {noSession && (
        <p className="text-red-300 text-[30px]  ">Please login to subscribe</p>
      )}
    </div>
  );
};

export default PricingCard;
