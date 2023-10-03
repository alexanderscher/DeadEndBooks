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

const daysLate = (input: string) => {
  const dueDate = new Date(input);
  const today = new Date();

  // reset hours, minutes, seconds and milliseconds
  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diff = today.getTime() - dueDate.getTime();

  // If dueDate is in the future or same as today, return 0 as it's not late.
  if (diff <= 0) {
    return 0;
  }

  // Convert milliseconds to days
  return Math.round(diff / (1000 * 60 * 60 * 24));
};

const daysLeft = (input: string) => {
  const date = new Date(input);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const diff = date.getTime() - today.getTime();

  console.log(Math.round(diff / (1000 * 60 * 60 * 24)));
  return Math.round(diff / (1000 * 60 * 60 * 24));
};

interface CurrentRentalsProps {
  isSmallDevice: boolean;
}

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
const CurrentRentals = ({ isSmallDevice }: CurrentRentalsProps) => {
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

  const returnHandler = async (
    rentalId: number,
    userId: number,
    start_date: string,
    return_date: string,
    id: number
  ) => {
    console.log(rentalId, userId, start_date, return_date, id);
    const res = await fetch(`/api/book/${rentalId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const res1 = await fetch(`/api/rentals/history`, {
        method: "POST",
        body: JSON.stringify({
          userId,
          bookId: rentalId,
          start_date,
          return_date,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res1.ok) {
        const res2 = await fetch(`/api/rentals/current`, {
          method: "DELETE",
          body: JSON.stringify({
            id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res2.ok) {
          setIsReturned(true);
        }
      }
    }
  };

  useEffect(() => {
    const getCurrentRentals = async () => {
      setIsLoaded(true);
      const res = await fetch(`/api/rentals/current`);
      const data = await res.json();
      console.log(data);

      const apiRentals = [];

      for (const key in data) {
        const res = await fetch(`/api/book/${data[key].bookId}`);
        const book = await res.json();

        const res1 = await fetch(`/api/user/${data[key].userId}`);
        const user = await res1.json();

        apiRentals.push({
          id: data[key].id,
          title: book.title,
          bookId: data[key].bookId,
          userId: data[key].userId,
          start_date: data[key].start_date,
          return_date: data[key].return_date,
          user_email: user.email,
          isLate: daysLate(data[key].return_date),
          daysLeft: daysLeft(data[key].return_date),
        });
      }

      setRentals(apiRentals);
      setIsLoaded(false);
    };
    getCurrentRentals();
  }, [isReturned]);

  if (isLoaded) {
    return <Loader />;
  }

  if (rentals.length === 0) {
    return (
      <div className="w-full max-w-[1000px] mt-10">
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
            <div className="flex mt-2 items-center justify-between border-b-[1.5px] border-slate-300">
              <h1>Status:</h1>
              <h1 className=" text-md ">Status</h1>
            </div>
            {rental.isLate > 0 ? (
              <div className="flex mt-2 items-center justify-between border-b-[1.5px] border-slate-300">
                <h1>Status:</h1>
                <h1 className=" text-md ">Late</h1>
              </div>
            ) : (
              <div className="flex mt-2 items-center justify-between border-b-[1.5px] border-slate-300">
                <h1>Days left:</h1>
                <h1 className=" text-md ">{rental.daysLeft}</h1>
              </div>
            )}

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
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentRentals;
