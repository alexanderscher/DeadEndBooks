"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Loader } from "..";
import { useDeviceQueries } from "@/utils/deviceQueries";

interface Props {
  res: any;
}

const Profile = ({ res }: Props) => {
  const { isSmallDevice } = useDeviceQueries();

  const [isLoading, setisLoading] = useState(true);
  const [user, setUser] = useState({
    id: null,
    admin: false,
    email: "",
    name: "",
    address: {
      id: null,
      address: "",
      zipcode: "",
      city: "",
      state: "",
      country: "",
      phone: "",
    },
  });

  useEffect(() => {
    const getUser = async () => {
      setisLoading(true);

      const data = res;

      setUser(data);
    };
    getUser();
    setisLoading(false);
  }, [res]);

  if (isLoading) {
    return <Loader />;
  }

  if (res === null) {
    return (
      <div className={`${isSmallDevice ? "mt-10" : ""}`}>
        <h1 className="text-[26px]">Log in or sign up to view your profile</h1>
        <div className="mt-10">
          <h1 className="text-red-500  hover:line-through text-[26px]">
            <Link href="/login">Log in</Link>
          </h1>
          <h1 className="text-red-500  hover:line-through text-[26px]">
            <Link href="/signup">Sign up</Link>
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className={isSmallDevice ? "mt-10" : " w-full"}>
      <div className="mt-10  w-full max-w-[800px]">
        <div className="mb-10 flex justify-between">
          <div>
            <span className="text-[16px] text-slate-400">Name</span>
            <h1 className="text-[26px]">{user.name}</h1>
          </div>
        </div>
        <div className="mb-10">
          <span className="text-[16px] text-slate-400">Email</span>
          <h1 className="text-[26px]">{user.email}</h1>
        </div>

        <div className="mt-10">
          <h1 className="text-[26px] text-red-500 hover:line-through cursor-pointer mb- ">
            <Link href="/profile/editprofile"> Edit profile</Link>
          </h1>
          <h1 className="text-[26px] text-red-500 hover:line-through cursor-pointer mb- ">
            <Link href="/newsletter">Manage Newsletter</Link>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Profile;
