"use client";
import { ExtendedSession, UserType } from "@/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Loader } from "..";
import { useRouter } from "next/navigation";

const Profile = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const active = (session as ExtendedSession)?.user?.isActive;

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

  const [formData, setFormData] = useState({
    address: "",
    zipCode: "",
    city: "",
    state: "",
    country: "",
    phone: "",
    userId: "",
  });

  useEffect(() => {
    const getUser = async () => {
      setisLoading(true);

      const res = await fetch(
        `/api/user/${(session as ExtendedSession)?.user?.id}`,
        { method: "PUT", next: { revalidate: 60 * 60 * 24 } }
      );
      const data = await res.json();

      setUser(data);
      if (data.address == null) {
        setFormData((prevState) => ({
          ...prevState,
          userId: data.id,
        }));
      }
    };
    getUser();
    setisLoading(false);
  }, [session]);

  if (isLoading) {
    return <Loader />;
  }
  return (
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
  );
};

export default Profile;
