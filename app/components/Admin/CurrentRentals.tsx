"use client";
import React, { useEffect, useState } from "react";
import { Loader } from "..";

const formatDate = (input: string) => {
  const date = new Date(input);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are
  const year = String(date.getFullYear()).slice(-2); // Get the last two

  return `${month}/${day}/${year}`;
};

interface Rental {
  id: number;
  userId: number;
  title: string;
  start_date: string;
  return_date: string;
  user_email: string;
  bookId: number;
  isLate: number;
  daysLeft: number;
}
const CurrentRentals = () => {
  const [rentals, setRentals] = useState<Rental[]>([
    {
      id: 0,
      title: "",
      start_date: "",
      return_date: "",
      user_email: "",
      userId: 0,
      bookId: 0,
      isLate: 0,
      daysLeft: 0,
    },
  ]);

  const [isLoaded, setIsLoaded] = useState(true);
  const [isReturned, setIsReturned] = useState(false);
  const [charge, setCharge] = useState({
    bookId: 0,
    charged: false,
  });

  const lateFee = async (userId: number, bookId: number) => {
    const res = await fetch(`/api/user/${userId}`);
    const data = await res.json();
    const stripeCustomerId = data.stripeCustomerId;
    const res1 = await fetch(
      `/api/admin/stripe/getcustomer/${stripeCustomerId}`
    );
    const data1 = await res1.json();
    const paymentMethodId = data1.invoice_settings.default_payment_method;

    const res2 = await fetch(`/api/admin/stripe/charge`, {
      method: "POST",
      body: JSON.stringify({
        amount: 500,
        paymentMethodId,
        stripeCustomerId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setCharge({
      bookId,
      charged: true,
    });
    setTimeout(() => {
      setCharge({
        bookId: 0,
        charged: false,
      });
    }, 2000);
  };

  const returnHandler = async (
    rentalId: number,
    userId: number,
    start_date: string,
    return_date: string,
    id: number
  ) => {
    setIsReturned(false);
    const res = await fetch(`/api/rentals/admin/return`, {
      method: "POST",
      body: JSON.stringify({
        userId,
        bookId: rentalId,
        start_date,
        return_date,
        id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setIsReturned(true);
  };

  useEffect(() => {
    const getCurrentRentals = async () => {
      setIsLoaded(true);
      const res = await fetch(`/api/rentals/admin/current-rentals`);
      const data = await res.json();

      setRentals(data);
      setIsLoaded(false);
    };
    getCurrentRentals();
  }, [isReturned]);

  if (isLoaded) {
    return <Loader />;
  }

  if (rentals.length === 0) {
    return (
      <div className="w-full  mt-10">
        <h1 className="text-[30px]">No current rentals</h1>
      </div>
    );
  }
  return (
    <div>
      <div className="w-full max-w-[1000px] mt-10">
        {rentals.map((rental, index) => (
          <div
            key={index}
            className="mt-4 flex flex-col w-full  border-t-[2px] border-black"
          >
            <div className="flex mt-2 items-center justify-between border-b-[1.5px] border-slate-300">
              <h1>Title:</h1>
              <h1 className=" text-md ">{rental.title}</h1>
            </div>
            <div className="flex mt-2 items-center justify-between border-b-[1.5px] border-slate-300">
              <h1>Start Date:</h1>
              <h1 className=" text-md ">{formatDate(rental.start_date)}</h1>
            </div>

            <div className="flex mt-2 items-center justify-between border-b-[1.5px] border-slate-300">
              <h1>Return Date:</h1>
              <h1 className=" text-md ">{formatDate(rental.return_date)}</h1>
            </div>
            <div className="flex mt-2 items-center justify-between border-b-[1.5px] border-slate-300">
              <h1>User:</h1>
              <h1 className=" text-md ">{rental.user_email}</h1>
            </div>
            {rental.isLate >= 0 && rental.daysLeft <= 0 ? (
              <div className="flex mt-2 items-center justify-between border-b-[1.5px] border-slate-300">
                <h1>Status:</h1>
                <h1 className=" text-md text-red-500">Late</h1>
              </div>
            ) : (
              <div className="flex mt-2 items-center justify-between border-b-[1.5px] border-slate-300">
                <h1>Days left:</h1>
                <h1 className=" text-md text-red-500">{rental.daysLeft}</h1>
              </div>
            )}

            <div className="flex justify-between items-start">
              <h1
                className=" text-md mt-2 mb-2 text-red-500 cursor-pointer hover:line-through"
                onClick={() =>
                  returnHandler(
                    rental.bookId,
                    rental.userId,
                    rental.start_date,
                    rental.return_date,
                    rental.id
                  )
                }
              >
                Mark as returned
              </h1>
              <div className="flex flex-col items-end mt-2">
                {charge.bookId == rental.bookId && charge.charged ? (
                  <h1 className="text-red-300">Late fee charged!</h1>
                ) : (
                  <button
                    className="text-red-300 hover:line-through"
                    onClick={() => {
                      lateFee(rental.userId, rental.bookId);
                    }}
                  >
                    Charge late fee
                  </button>
                )}

                <button className="hover:line-through text-red-300">
                  Charge book amount
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentRentals;
