"use client";
import React, { useEffect, useState } from "react";

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
const CurrentRentals = ({ isSmallDevice }: CurrentRentalsProps) => {
  const [rentals, setRentals] = useState<any>({
    title: "",
    start_date: "",
    return_date: "",
    user_email: "",
    days_late: 0,
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const getCurrentRentals = async () => {
      setIsLoaded(false);
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
      setIsLoaded(true);
    };
    getCurrentRentals();
  }, []);
  return (
    <div>
      <div className="w-full max-w-[1000px] mt-10">
        {isLoaded &&
          rentals.map((rental, index) => (
            <div
              key={index}
              className="mt-4 flex flex-col w-full  border-b-[2px] border-black"
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

              <h1 className=" text-md mt-6 text-red-500">Mark as returned</h1>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CurrentRentals;
