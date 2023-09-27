"use client";
import { ExtendedSession, UserType } from "@/types";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { User, Session } from "next-auth";

const Profile = () => {
  const { data: session } = useSession();
  useEffect(() => {
    const getUser = async () => {
      const res = await fetch(
        `/api/user/${(session as ExtendedSession)?.user?.id}`
      );
      const data = await res.json();
      console.log(data);
    };
  }, [session]);
  return (
    <div className="mt-10  w-full">
      <div className="mb-10">
        <span className="text-[16px] text-slate-400">Name</span>
        <h1 className="text-[30px]">Alex</h1>
      </div>
      <div className="mb-10">
        <span className="text-[16px] text-slate-400">Email</span>
        <h1 className="text-[30px]">alexcscher@gmail.com</h1>
      </div>
      <div className="mb-10 flex flex-col flex-wrap">
        <span className="text-[16px] text-slate-400">Address</span>
        <h1 className="text-[30px]">2912 6th ave.</h1>
        <h1 className="text-[30px]">90018</h1>
        <h1 className="text-[30px]">Los Angeles</h1>
        <h1 className="text-[30px]">California</h1>
        <h1 className="text-[30px]">213-310-323</h1>
      </div>
      <div className="mb-10">
        <span className="text-[16px] text-slate-400">Wallet</span>
        <h1 className="text-[30px]">**** **** **** **** 1099</h1>
      </div>
      <h1 className="text-[30px] text-red-500 hover:line-through cursor-pointer">
        Edit profile
      </h1>
    </div>
  );
};

export default Profile;
