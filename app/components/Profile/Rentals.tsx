"use client";
import { ExtendedSession } from "@/types";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Loader } from "..";

const Rentals = () => {
  const [isLoading, setisLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const { data: session } = useSession();

  const [rentals, setRentals] = useState([
    {
      title: "",
      start_date: "",
      return_date: "",
      isLate: 0,
      daysLeft: 0,
      orderId: 0,
      shipped: false,
    },
  ]);

  useEffect(() => {
    const getUser = async () => {
      const res = await fetch("/api/user/current-rental", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
        body: JSON.stringify((session as ExtendedSession)?.user?.id),
      });

      const data = await res.json();

      setRentals(data);
      setisLoading(false);
    };
    getUser();
  }, [session]);

  if (isLoading) {
    return <Loader />;
  }
  if (rentals.length === 0) {
    return (
      <div className="w-full mt-10">
        <h1 className="text-[26px]">You have no rentals</h1>
      </div>
    );
  }
  return (
    <div className="w-full mt-10 relative max-w-[800px]">
      {rentals.map((rental, index) => (
        <div
          key={index}
          className="mt-4 flex flex-col w-full  border-t-[2px] border-black"
        >
          <div className="flex mt-2 items-center justify-between border-b-[1.5px]  border-slate-300">
            <h1>Title:</h1>
            <h1 className=" text-md ">{rental.title}</h1>
          </div>
          <div className="flex mt-2 items-center justify-between border-b-[1.5px]  border-slate-300">
            <h1>Order ID:</h1>
            <h1 className=" text-md ">{rental.orderId}</h1>
          </div>
          <div className="flex mt-2 items-center justify-between border-b-[1.5px] border-slate-300">
            <h1>Start Date:</h1>
            <h1 className=" text-md ">{rental.start_date}</h1>
          </div>

          <div className="flex mt-2 items-center justify-between border-b-[1.5px] border-slate-300">
            <h1>Return Date:</h1>
            <h1 className=" text-md ">{rental.return_date}</h1>
          </div>
          <div className="flex mt-2 items-center justify-between border-b-[1.5px] border-slate-300">
            <h1>Shipped:</h1>
            <h1 className=" text-md ">
              {rental.shipped ? "Shipped" : "Not Shipped"}
            </h1>
          </div>
          {rental.isLate >= 0 && rental.daysLeft <= 0 ? (
            <>
              {}
              <div className="flex mt-2 items-center justify-between border-b-[1.5px] border-slate-300">
                <h1>Status:</h1>
                <h1 className="text-md text-red-500">
                  {rental.isLate === 0
                    ? "Item is due today"
                    : rental.isLate === 1
                    ? "1 day late"
                    : `${rental.isLate} days late`}
                </h1>
              </div>
            </>
          ) : (
            <div className="flex mt-2 items-center justify-between relative ">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setModal(true)}
              >
                <h1 className="hover:line-through">Days left:</h1>
                <div className="w-[13px] ml-2 ">
                  <img src="/question.png" alt="" />
                </div>
              </div>
              <h1 className="text-md text-red-500">{rental.daysLeft}</h1>
            </div>
            // )
          )}
        </div>
      ))}
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-red-200 text-red-500 p-8 rounded-md text-[20px] border-[2px] border-red-500 shadow-lg z-50 w-3/4 max-w-[500px]">
            <p>
              Books need to be returned within the time period. If you fail to
              do so, you will be charged a fee. Please ship the book a week in
              advance to avoid any late fees.
            </p>
            <button
              onClick={() => setModal(false)}
              className="hover:line-through text-md mt-4 text-end"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rentals;
