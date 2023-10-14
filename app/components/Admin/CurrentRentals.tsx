"use client";
import React, { useEffect, useState } from "react";
import { Loader } from "..";

function dollarsToCents(dollarString: string): number {
  let cleanedString = dollarString.replace("$", "");

  let cents = Math.round(parseFloat(cleanedString) * 100);

  return cents;
}

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
  orderId: number;
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
      orderId: 0,
    },
  ]);

  const [isLoaded, setIsLoaded] = useState(true);
  const [isReturned, setIsReturned] = useState(false);
  const [charge, setCharge] = useState({
    bookId: 0,
    charged: false,
  });
  const [chargeBookInput, setChargeBookInput] = useState({
    input: false,
    userId: 0,
    bookId: 0,
  });

  const [lateFeeModal, setLateFeeModal] = useState({
    bookId: 0,
    charged: false,
    userId: 0,
  });

  const [amountBook, setAmount] = useState("0.00");

  const amountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const bookAmount = async (userId: number, bookId: number) => {
    const res = await fetch(`/api/user/${userId}`);
    const data = await res.json();
    const stripeCustomerId = data.stripeCustomerId;
    const res1 = await fetch(
      `/api/admin/stripe/getcustomer/${stripeCustomerId}`
    );
    const data1 = await res1.json();
    const paymentMethodId = data1.invoice_settings.default_payment_method;
    try {
      const res2 = await fetch(`/api/admin/stripe/charge`, {
        method: "POST",
        body: JSON.stringify({
          amount: dollarsToCents(amountBook),
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
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const lateFee = async (userId: number, bookId: number) => {
    const res = await fetch(`/api/user/${userId}`);
    const data = await res.json();
    const stripeCustomerId = data.stripeCustomerId;
    const res1 = await fetch(
      `/api/admin/stripe/getcustomer/${stripeCustomerId}`
    );
    const data1 = await res1.json();
    const paymentMethodId = data1.invoice_settings.default_payment_method;
    try {
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
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const returnHandler = async (
    rentalId: number,
    userId: number,
    start_date: string,
    return_date: string,
    id: number
  ) => {
    setIsReturned(false);
    const res = await fetch(`/api/admin/rentals/return`, {
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
      const res = await fetch(`/api/admin/rentals/current-rentals`);
      const data = await res.json();
      console.log(data);

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
        <h1 className="text-[26px]">No current rentals</h1>
      </div>
    );
  }
  return (
    <div>
      <div className="w-full max-w-[840px] mt-10">
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
              <h1>Order ID:</h1>
              <h1 className=" text-md ">{rental.orderId}</h1>
            </div>
            <div className="flex mt-2 items-center justify-between border-b-[1.5px] border-slate-300">
              <h1>User:</h1>
              <h1 className=" text-md ">{rental.user_email}</h1>
            </div>
            <div className="flex mt-2 items-center justify-between border-b-[1.5px] border-slate-300">
              <h1>Start Date:</h1>
              <h1 className=" text-md ">{formatDate(rental.start_date)}</h1>
            </div>

            <div className="flex mt-2 items-center justify-between border-b-[1.5px] border-slate-300">
              <h1>Return Date:</h1>
              <h1 className=" text-md ">{formatDate(rental.return_date)}</h1>
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
                <button
                  className="text-red-500 hover:line-through text-sm"
                  onClick={() => {
                    setLateFeeModal({
                      bookId: rental.bookId,
                      charged: !lateFeeModal.charged,
                      userId: rental.userId,
                    });
                  }}
                >
                  Charge $5.00 late fee
                </button>

                {lateFeeModal.charged &&
                  lateFeeModal.bookId == rental.bookId &&
                  lateFeeModal.userId == rental.userId && (
                    <div className="fixed inset-0 flex items-center justify-center z-40">
                      <div className="p-8 z-50 max-w-[400px] w-3/4 bg-red-100 h-[160px] rounded-md border-black border-[2px] shadow-xl">
                        <h1>
                          Charging $5.00 to {rental.user_email} for{" "}
                          {rental.title}
                        </h1>
                        <div className="flex justify-between mt-6">
                          <button
                            className="text-red-500 hover:line-through "
                            onClick={() => {
                              lateFee(rental.userId, rental.bookId);
                            }}
                          >
                            {charge.bookId == rental.bookId && charge.charged
                              ? "Late fee charged"
                              : "Confirm"}
                          </button>
                          <button
                            className="text-red-500 hover:line-through "
                            onClick={() => {
                              setLateFeeModal({
                                bookId: 0,
                                charged: !lateFeeModal.charged,
                                userId: 0,
                              });
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                <button
                  className="hover:line-through text-red-500 text-sm"
                  onClick={() => {
                    setChargeBookInput({
                      input: !chargeBookInput.input,
                      userId: rental.userId,
                      bookId: rental.bookId,
                    });
                  }}
                >
                  Charge book amount
                </button>
                {chargeBookInput.input &&
                  chargeBookInput.bookId == rental.bookId &&
                  chargeBookInput.bookId == rental.bookId && (
                    <div className="fixed inset-0 flex items-center justify-center z-40">
                      <div className="p-8 z-50 max-w-[400px] w-3/4 bg-red-100 h-[260px] rounded-md border-black border-[2px] shadow-xl">
                        <h1>Input late fee amount</h1>
                        <input
                          type="text"
                          className="border-b-[2px] border-black mt-4 bg-red-100 focus:outline-none"
                          placeholder="$0.00"
                          onChange={amountChange}
                        />
                        <h1 className="mt-2">
                          Charging to {amountBook} {rental.user_email} for{" "}
                          {rental.title}
                        </h1>
                        <div className="flex justify-between mt-[70px]">
                          <button
                            className="text-red-500 hover:line-through "
                            onClick={() => {
                              bookAmount(rental.userId, rental.bookId);
                            }}
                          >
                            {charge.bookId == rental.bookId && charge.charged
                              ? "Late fee charged"
                              : "Confirm"}
                          </button>
                          <button
                            className="text-red-500 hover:line-through "
                            onClick={() => {
                              setChargeBookInput({
                                bookId: 0,
                                input: !chargeBookInput.input,
                                userId: 0,
                              });
                              setAmount("0.00");
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentRentals;
