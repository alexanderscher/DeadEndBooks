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

const Rentals = () => {
  const [isLoading, setisLoading] = useState(true);

  const { data: session } = useSession();

  const [rentals, setRentals] = useState([
    {
      title: "",
      start_date: "",
      return_date: "",
      isLate: false,
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

          if (res.ok) {
            rentals.push({
              title: dataBook.title,
              start_date: formatDate(data.Current[rental].start_date),
              return_date: formatDate(data.Current[rental].return_date),
              isLate: data.Current[rental].isLate,
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
  return (
    <div className="w-full">
      {rentals.map((rental, index) => (
        <div
          key={index}
          className="mt-4 flex flex-col w-full  border-t-[2px] border-black"
        >
          <div className="flex mt-2 items-center justify-between border-b-[1.5px]  border-slate-300">
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

          <div className="flex mt-2 items-center justify-between">
            <h1>Status:</h1>
            <h1 className=" text-md ">Status</h1>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Rentals;
