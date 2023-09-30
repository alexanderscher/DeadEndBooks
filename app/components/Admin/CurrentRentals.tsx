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

interface CurrentRentalsProps {
  isSmallDevice: boolean;
}

interface Rental {
  title: string;
  start_date: string;
  return_date: string;
  user_email: string;
  days_late: number;
}
const CurrentRentals = ({ isSmallDevice }: CurrentRentalsProps) => {
  const [rentals, setRentals] = useState<Rental[]>([
    {
      title: "",
      start_date: "",
      return_date: "",
      user_email: "",
      days_late: 0,
    },
  ]);

  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    const getCurrentRentals = async () => {
      setIsLoaded(true);
      const res = await fetch(`/api/rentals/current`);
      const data = await res.json();

      const apiRentals = [];

      for (const key in data) {
        const res = await fetch(`/api/book/${data[key].bookId}`);
        const book = await res.json();

        const res1 = await fetch(`/api/user/${data[key].userId}`);
        const user = await res1.json();

        apiRentals.push({
          title: book.title,
          start_date: formatDate(data[key].start_date),
          return_date: formatDate(data[key].return_date),
          user_email: user.email,
          days_late: data[key].daysLate,
        });
      }

      setRentals(apiRentals);
      setIsLoaded(false);
    };
    getCurrentRentals();
  }, []);

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
              <h1 className=" text-md ">{rental.start_date}</h1>
            </div>

            <div className="flex mt-2 items-center justify-between border-b-[1.5px] border-slate-300">
              <h1>Return Date:</h1>
              <h1 className=" text-md ">{rental.return_date}</h1>
            </div>
            <div className="flex mt-2 items-center justify-between border-b-[1.5px] border-slate-300">
              <h1>User:</h1>
              <h1 className=" text-md ">{rental.user_email}</h1>
            </div>
            <div className="flex mt-2 items-center justify-between border-b-[1.5px] border-slate-300">
              <h1>Status:</h1>
              <h1 className=" text-md ">Status</h1>
            </div>

            <h1 className=" text-md mt-2 mb-2 text-red-500">
              Mark as returned
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentRentals;
