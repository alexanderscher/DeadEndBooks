"use client";
import { ExtendedSession, UserType } from "@/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Loader } from "..";

const Profile = () => {
  const { data: session } = useSession();
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

  const [errorText, setErrorText] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const submitAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      Object.entries(formData).every(
        ([key, value]) => key === "userId" || value === ""
      )
    ) {
    } else {
      const res = await fetch("/api/user/address", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        setErrorText(false);
        location.reload();
      } else {
        console.error("Error submitting address:", data.message);
        setErrorText(true);
      }
    }
  };

  useEffect(() => {
    const getUser = async () => {
      setisLoading(true);

      const res = await fetch(
        `/api/user/${(session as ExtendedSession)?.user?.id}`
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
          <h1 className="text-[30px]">{user.name}</h1>
        </div>

        <h1 className="text-[20px] text-red-500 hover:line-through cursor-pointer mb- text-end">
          <Link href="/profile/editprofile"> Edit profile</Link>
        </h1>
      </div>
      <div className="mb-10">
        <span className="text-[16px] text-slate-400">Email</span>
        <h1 className="text-[30px]">{user.email}</h1>
      </div>

      <div className="mb-10 flex flex-col flex-wrap">
        <span className="text-[16px] text-slate-400">Address</span>
        {user.address == null ? (
          <div className=" ">
            <h1 className="text-[20px] ">Please fill out address</h1>

            <form onSubmit={submitAddress}>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="border-black text-[20px] border-b-[2px] placeholder:text-black placeholder:text-[20px] mt-2 w-full focus:outline-none"
              />
              <input
                type="text"
                name="zipCode"
                placeholder="Zip Code"
                value={formData.zipCode}
                onChange={handleChange}
                className="border-black text-[20px] border-b-[2px] placeholder:text-black placeholder:text-[20px] mt-2 w-full focus:outline-none"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="border-black text-[20px] border-b-[2px] placeholder:text-black placeholder:text-[20px] mt-2 w-full focus:outline-none"
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                className="border-black text-[20px] border-b-[2px] placeholder:text-black placeholder:text-[20px] mt-2 w-full focus:outline-none"
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
                className="border-black text-[20px] border-b-[2px] placeholder:text-black placeholder:text-[20px] mt-2 w-full focus:outline-none"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="border-black text-[20px] border-b-[2px] placeholder:text-black placeholder:text-[20px] mt-2 w-full focus:outline-none"
              />
              {errorText && (
                <p className="text-red-500">Please fill out all fields</p>
              )}
              <button className="text-red-500 hover:line-through text-[20px] mt-2">
                Submit
              </button>
            </form>
          </div>
        ) : (
          <>
            <h1 className="text-[30px]">{user.address.address}</h1>
            <h1 className="text-[30px]">{user.address.zipcode}</h1>
            <h1 className="text-[30px]">{user.address.city}</h1>
            <h1 className="text-[30px]">{user.address.state}</h1>
            <h1 className="text-[30px]">{user.address.phone}</h1>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
