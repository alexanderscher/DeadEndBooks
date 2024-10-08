"use client";
import { ExtendedSession } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Loader } from "..";
import { usePathname } from "next/navigation";
import { useDeviceQueries } from "@/utils/deviceQueries";
import Image from "next/image";
import { isProduction } from "@/utils/name";

interface priceProps {
  price: any;
  session: any;
}

const PricingCard = ({ price, session }: priceProps) => {
  const { isSmallDevice } = useDeviceQueries();
  const sessionId = (session as ExtendedSession)?.user?.id;
  const subscriptionID = (session as ExtendedSession)?.user?.subscriptionID;
  const [help, sethelp] = useState(false);
  const url = isProduction();
  const [noSession, setNoSession] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const currentPage = usePathname();
  const [userSub, setUserSub] = useState("");

  useEffect(() => {
    const getData = async () => {
      if (sessionId) {
        const res1 = await fetch(`${url}/api/user/${sessionId}`, {
          next: {
            tags: [`user-profile-${sessionId}`],
            revalidate: 60 * 60 * 24,
          },
        });
        const uD = await res1.json();

        if (uD === null) {
          setUserSub("");
          return;
        }
        if (uD.subscriptionType) {
          setUserSub(uD.subscriptionType);
        } else {
          setUserSub("");
        }
      }
    };
    getData();
    setisLoading(false);
  }, [url, sessionId]);

  const changeSubscription = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
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
    } catch (error) {
      console.log(error);
    }
  };

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
    <div className={`${isSmallDevice ? "mt-10" : "mb-10"}`}>
      <div className="flex gap-1">
        <h1 className={`text-[30px]`}>{price.nickname}</h1>
        {price.nickname === "Local Monthly Plan" && (
          <button
            onClick={() => {
              sethelp(!help);
            }}
          >
            <img className="w-4 h-4 bg-white" src="/questions.png"></img>
          </button>
        )}
      </div>

      <p className="text-[30px] text-slate-500">
        {(price.unit_amount / 100).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}{" "}
        {price.nickname === "Yearly Plan" ? "/year" : "/month"}
      </p>

      {price.nickname === "Local Monthly Plan" && help && (
        <>
          <p className="text-sm text-slate-500">Los Angeles residents only.</p>

          <p className="text-sm text-slate-500">
            Pick-up and drop-off for your rentals at our Los Angeles library.
          </p>
        </>
      )}
      {userSub === price.nickname && sessionId ? (
        <h1 className="text-[30px] text-red-300">Current subscription</h1>
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
