"use client";
import { ExtendedSession } from "@/types";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const formatDate = (input: string) => {
  const date = new Date(input);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are
  const year = String(date.getFullYear()).slice(-2); // Get the last two

  return `${month}/${day}/${year}`;
};

const Rentals = () => {
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
      }
    };
    getUser();
  }, [session]);
  return (
    <div className="w-full">
      <div className="mt-16 flex w-full  border-b-[1.5px] border-black">
        <h1 className="w-3/4 text-[18px]">Title</h1>
        <h1 className="w-1/3 text-[18px] text-end">Start Date</h1>
        <h1 className="w-1/3 text-[18px] text-end">Return Date</h1>
      </div>
      {rentals.map((rental, index) => (
        <div className="mt-6 flex w-full  border-b-[1.5px] border-black">
          <h1 className="w-3/4 text-[18px]">{rental.title}</h1>
          <h1 className="w-1/3 text-[18px] text-end">{rental.start_date}</h1>
          <h1 className="w-1/3 text-[18px] text-end">{rental.return_date}</h1>
        </div>
      ))}
    </div>
  );
};

export default Rentals;
