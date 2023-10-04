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
const PastRentals = ({ isSmallDevice }: PastRentalsProps) => {
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
  console.log(rentals);

  const [isLoaded, setIsLoaded] = useState(false);
  console.log(isLoaded);

  useEffect(() => {
    const getPastRentals = async () => {
      setIsLoaded(false);
      const res = await fetch(`/api/rentals/history`);
      const data = await res.json();

      const apiRentals = [];

      for (const key in data) {
        const res = await fetch(`/api/book/${data[key].bookId}`);
        const book = await res.json();

        const res1 = await fetch(`/api/user/${data[key].userId}`);
        const user = await res1.json();
        console.log(user);

        apiRentals.push({
          id: data[key].id,
          title: book.title,
          bookId: data[key].bookId,
          userId: data[key].userId,
          start_date: data[key].start_date,
          return_date: data[key].return_date,
          user_email: user.email,
        });
      }

      setRentals(apiRentals);
      setIsLoaded(true);
    };
    getPastRentals();
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastRentals;
