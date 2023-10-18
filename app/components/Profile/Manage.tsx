"use client";
import { ExtendedSession, UserType } from "@/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Loader } from "..";
import { useRouter } from "next/navigation";
import ChangeSub from "./ChangeSub";

const Manage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const active = (session as ExtendedSession)?.user?.isActive;
  const stripeId = (session as ExtendedSession)?.user?.stripeCustomerId;
  console.log(session);

  const [isLoading, setisLoading] = useState(true);
  const [userSub, setUserSub] = useState("");

  useEffect(() => {
    const getUser = async () => {
      setisLoading(true);
      console.log((session as ExtendedSession)?.user?.id);

      const res = await fetch(
        `/api/user/${(session as ExtendedSession)?.user?.id}`
      );
      const data = await res.json();
      console.log(data);
      setUserSub(data.subscriptionType);
    };

    getUser();

    setisLoading(false);
  }, [session]);

  const cancelSubscription = async () => {
    try {
      const res = await fetch("/api/stripe/subscription-cancel");
      const { subscription } = await res.json();
      router.push("/home/cancel");
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="mt-10  w-full max-w-[800px]">
      <div className="border-b-[2px] border-slate-300">
        <h1 className="text-[26px] text-slate-400">Your subscription</h1>
        <h1 className="text-[26px] ">{userSub}</h1>
      </div>

      {active ? (
        <div className="flex flex-col mt-10 items-start">
          <button
            className="text-red-500 hover:line-through text-[26px] "
            onClick={cancelSubscription}
          >
            Cancel Subscription
          </button>
          <button className="text-red-500 hover:line-through text-[26px]">
            <Link href="/profile/subscription/change">Change Subscription</Link>
          </button>
        </div>
      ) : (
        <button
          className="text-red-500 hover:line-through text-[26px]"
          onClick={() => router.push("/pricing")}
        >
          Subscribe
        </button>
      )}
    </div>
  );
};

export default Manage;
