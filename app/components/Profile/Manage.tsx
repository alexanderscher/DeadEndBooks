"use client";
import { ExtendedSession, UserType } from "@/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Loader } from "..";
import { useRouter } from "next/navigation";

const formatDate = (input: Date | string) => {
  if (!input) {
    return;
  }

  let date: Date;

  if (typeof input === "string") {
    date = new Date(input);
    date.setDate(date.getDate() + 90);
  } else {
    date = input;
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  return `${month}/${day}/${year}` as string;
};
const Manage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const active = (session as ExtendedSession)?.user?.isActive;
  const stripeId = (session as ExtendedSession)?.user?.stripeCustomerId;

  const [isLoading, setisLoading] = useState(true);
  const [userSub, setUserSub] = useState("");
  const [subscriptionDate, setSubscriptionDate] = useState("");
  const [errorCode, setErrorCode] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      setisLoading(true);

      const res = await fetch(
        `/api/user/${(session as ExtendedSession)?.user?.id}`
      );
      const data = await res.json();
      setUserSub(data.subscriptionType);
      setSubscriptionDate(data.subscriptionDate);
    };

    getUser();

    setisLoading(false);
  }, [session]);

  const cancelSubscription = async () => {
    try {
      const res = await fetch("/api/stripe/subscription-cancel");
      const { subscription } = await res.json();

      if (res.status === 200) {
        router.push("/home/cancel");
      } else if (res.status === 403) {
        console.log("error");
        setErrorCode(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [cancelModal, setCancelModal] = useState(false);

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
            onClick={() => setCancelModal(true)}
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

      {errorCode && (
        <div className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center">
          <div className="bg-red-200 text-red-500 m-10 p-8 rounded-md text-[20px] border-[2px] border-red-500 shadow-lg max-w-[500px]">
            <p>
              Subsciption cancelation is available after three months of your
              subscription date. You are able to cancel on{" "}
              {formatDate(subscriptionDate)}
            </p>
            <button
              onClick={() => setErrorCode(false)}
              className="hover:line-through text-md mt-4 text-end w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {cancelModal && (
        <div className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center">
          <div className="bg-red-200 text-red-500 m-10 p-8 rounded-md text-[20px] border-[2px] border-red-500 shadow-lg max-w-[500px]">
            <p>
              Are you sure you want to cancel your subscription? Your
              subscribption will end immediately.
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setCancelModal(false);
                  cancelSubscription();
                }}
                className="hover:line-through text-md mt-4 text-end"
              >
                Confirm
              </button>
              <button
                onClick={() => setCancelModal(false)}
                className="hover:line-through text-md mt-4 text-end"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manage;
