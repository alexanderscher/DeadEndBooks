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

const History = () => {
  const [isLoading, setisLoading] = useState(true);
  const { data: session } = useSession();
  const [rentals, setRentals] = useState([
    {
      title: "",
      start_date: "",
      return_date: "",
    },
  ]);

  useEffect(() => {
    const getUser = async () => {
      setisLoading(true);

      const res = await fetch("/api/user/history", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 * 60 * 24 },
        body: JSON.stringify((session as ExtendedSession)?.user?.id),
      });

      const data = await res.json();
      console.log(data);

      setRentals(data);
      setisLoading(false);
    };
    getUser();
  }, [session]);
  if (isLoading) {
    return <Loader />;
  }
  if (rentals.length === 0) {
    return (
      <div className="w-full mt-10 ">
        <h1 className="text-[26px]">You have no past rentals</h1>
      </div>
    );
  }
  return (
    <div className="w-full mt-10 max-w-[800px]">
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

          <div className="flex mt-2 items-center justify-between ">
            <h1>Return Date:</h1>
            <h1 className=" text-md ">{rental.return_date}</h1>
          </div>
        </div>
      ))}
    </div>
  );
};

export default History;
