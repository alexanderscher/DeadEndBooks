"use client";
import { ExtendedSession } from "@/types";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Loader } from "..";

const formatDate = (input: string) => {
  const date = new Date(input);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  return `${month}/${day}/${year}`;
};

const daysLate = (input: string) => {
  const dueDate = new Date(input);
  const today = new Date();

  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diff = today.getTime() - dueDate.getTime();

  if (diff <= 0) {
    return 0;
  }

  return Math.round(diff / (1000 * 60 * 60 * 24));
};

const daysLeft = (input: string) => {
  const date = new Date(input);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const diff = date.getTime() - today.getTime();

  return Math.round(diff / (1000 * 60 * 60 * 24));
};

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
      setisLoading(true);

      const res = await fetch(
        `/api/user/${(session as ExtendedSession)?.user?.id}`
      );
      const data = await res.json();

      const rentals = [];

      if (res.ok) {
        for (const rental in data.Current) {
          const res = await fetch(`/api/book/${data.Current[rental].bookId}`);
          const dataBook = await res.json();

          const order = await fetch(
            `/api/order/${data.Current[rental].orderId}`
          );
          const dataOrder = await order.json();

          if (res.ok) {
            rentals.push({
              title: dataBook.title,
              start_date: formatDate(data.Current[rental].start_date),
              return_date: formatDate(data.Current[rental].return_date),
              isLate: daysLate(data.Current[rental].return_date),
              daysLeft: daysLeft(data.Current[rental].return_date),
              orderId: data.Current[rental].orderId,
              shipped: dataOrder.shipped,
            });
          }
        }
        setRentals(rentals);
        setisLoading(false);
      }
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
