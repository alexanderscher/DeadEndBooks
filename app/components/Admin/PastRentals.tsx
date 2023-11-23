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

interface PastRentalsProps {
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
}
const PastRentals = () => {
  const [rentals, setRentals] = useState<Rental[]>([
    {
      id: 0,
      title: "",
      start_date: "",
      return_date: "",
      user_email: "",
      userId: 0,
      bookId: 0,
    },
  ]);

  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    const getPastRentals = async () => {
      const res = await fetch(`/api/admin/rentals/past-rentals`, {
        method: "PUT",
        next: { revalidate: 60 * 60 * 24 },
      });
      const data = await res.json();
      setRentals(data);

      setIsLoaded(false);
    };
    getPastRentals();
  }, []);

  if (isLoaded) {
    return <Loader />;
  } else if (rentals.length === 0) {
    return (
      <div className="w-full max-w-[840px] mt-10">
        <h1 className="text-[26px]">No past rentals</h1>
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
              <h1>Start Date:</h1>
              <h1 className=" text-md ">{formatDate(rental.start_date)}</h1>
            </div>

            <div className="flex mt-2 items-center justify-between border-b-[1.5px] border-slate-300">
              <h1>Return Date:</h1>
              <h1 className=" text-md ">{formatDate(rental.return_date)}</h1>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <h1>User:</h1>
              <h1 className=" text-md ">{rental.user_email}</h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastRentals;
