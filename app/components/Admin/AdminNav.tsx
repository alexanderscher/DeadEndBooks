"use client";
import { useDeviceQueries } from "@/utils/deviceQueries";
import Link from "next/link";
import React from "react";

const AdminNav = () => {
  const { isSmallDevice } = useDeviceQueries();
  return (
    <div
      className={
        isSmallDevice
          ? "flex flex-wrap mt-6 border-t-[2px] border-slate-500 "
          : "flex flex-wrap w-full "
      }
    >
      <h1
        className={`mr-3 ${
          isSmallDevice ? "text-slate-500 text-[20px]" : "text-[24px]"
        } hover:line-through cursor-pointer`}
      >
        <Link href="/admin/addbook">Add Book,</Link>
      </h1>
      <h1
        className={`mr-3 ${
          isSmallDevice ? "text-slate-500 text-[20px]" : "text-[24px]"
        } hover:line-through cursor-pointer `}
      >
        <Link href="/admin/allbooks">See All Books,</Link>
      </h1>
      <h1
        className={`mr-3 ${
          isSmallDevice ? "text-slate-500 text-[20px]" : "text-[24px]"
        } hover:line-through cursor-pointer`}
      >
        <Link href="/admin/current-rentals">Current Rentals,</Link>
      </h1>
      <h1
        className={`mr-3 ${
          isSmallDevice ? "text-slate-500 text-[20px]" : "text-[24px]"
        } hover:line-through cursor-pointer`}
      >
        <Link href="/admin/past-rentals">Past Rentals,</Link>
      </h1>
      <h1
        className={`mr-3 ${
          isSmallDevice ? "text-slate-500 text-[20px]" : "text-[24px]"
        } hover:line-through cursor-pointer`}
      >
        <Link href="/admin/users">Users, </Link>
      </h1>
      <h1
        className={`mr-3 ${
          isSmallDevice ? "text-slate-500 text-[20px]" : "text-[24px]"
        } hover:line-through cursor-pointer`}
      >
        <Link href="/admin/orders/pending">Orders</Link>
      </h1>
    </div>
  );
};

export default AdminNav;
