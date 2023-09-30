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

  const [changeEvent, setChangeEvent] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
    email: "",
    userId: "",
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

  console.log(formData);

  const [passwordPrompt, setPasswordPrompt] = useState(false);
  const [emailPrompt, setEmailPrompt] = useState(false);
  const [errorText, setErrorText] = useState({
    name: false,
    password: false,
    email: false,
    address: false,
  });

  const [errorMessage, seterrorMessage] = useState("");

  const handleChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChangeEvent((prevState) => ({ ...prevState, [name]: value }));
  };

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
        method: "PUT",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        setErrorText({
          ...errorText,
          address: false,
        });
        location.reload();
      } else {
        console.error("Error submitting address:", data.message);
        setErrorText({
          ...errorText,
          address: true,
        });
      }
    }
  };

  const changeSubmit = async (name: string) => {
    const res = await fetch(`/api/user/${name}`, {
      method: "PUT",
      body: JSON.stringify(changeEvent),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (res.ok) {
      console.log("Success!");
      setErrorText({ ...errorText, [name]: false });
    } else {
      console.error(data.message);
      setErrorText({ ...errorText, [name]: true });
      seterrorMessage(data.message);
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
      setChangeEvent((prevState) => ({
        ...prevState,
        userId: data.id,
      }));
      setFormData((prevState) => ({
        ...prevState,
        userId: data.id,
      }));
      setisLoading(false);
    };
    getUser();
  }, [session]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="mt-10  w-full">
      <div className="mb-10 flex justify-between">
        <div className="w-full flex flex-col items-start">
          <span className="text-[16px] text-slate-400">Name</span>
          <input
            type="text"
            name="username"
            value={changeEvent.username}
            onChange={handleChangeEvent}
            placeholder={user.name}
            className="border-b-[2px] border-black placeholder:text-black placeholder:text-[20px] mt-2 w-full focus:outline-none"
          />
          {errorText.name && <p className="text-red-300">{errorMessage}</p>}
          <button
            className="text-red-500 hover:line-through text-[20px] mt-2"
            onClick={() => changeSubmit("username")}
          >
            Submit
          </button>
        </div>
      </div>
      <div className="mb-10 w-full items-start">
        <span className="text-[16px] text-slate-400">Email</span>
        <input
          type="text"
          name="email"
          value={changeEvent.email}
          onChange={handleChangeEvent}
          placeholder={user.email}
          className="border-b-[2px] border-black placeholder:text-black placeholder:text-[20px] mt-2 w-full focus:outline-none"
        />

        {!emailPrompt ? (
          <button
            className="text-red-500 hover:line-through text-[20px] mt-2"
            onClick={() => setEmailPrompt(true)}
          >
            Submit
          </button>
        ) : (
          <>
            <input
              type="text"
              name="currentPassword"
              value={changeEvent.currentPassword}
              onChange={handleChangeEvent}
              placeholder="Current Password"
              className="border-b-[2px] border-black placeholder:text-black placeholder:text-[20px] mt-2 w-full focus:outline-none"
            />
            {errorText.email && <p className="text-red-300">{errorMessage}</p>}
            <button
              className="text-red-500 hover:line-through text-[20px] mt-2"
              onClick={() => changeSubmit("email")}
            >
              Submit
            </button>
          </>
        )}
      </div>
      <div className="mb-10 w-full items-start">
        <span className="text-[16px] text-slate-400">Password</span>
        <input
          type="text"
          name="newPassword"
          value={changeEvent.newPassword}
          onChange={handleChangeEvent}
          placeholder="Change Password"
          className="border-b-[2px] border-black placeholder:text-black placeholder:text-[20px] mt-2 w-full focus:outline-none"
        />
        {!passwordPrompt ? (
          <button
            className="text-red-500 hover:line-through text-[20px] mt-2"
            onClick={() => setPasswordPrompt(true)}
          >
            Submit
          </button>
        ) : (
          <>
            <input
              type="text"
              name="currentPassword"
              value={changeEvent.currentPassword}
              onChange={handleChangeEvent}
              placeholder="Current Password"
              className="border-b-[2px] border-black placeholder:text-black placeholder:text-[20px] mt-2 w-full focus:outline-none"
            />
            <button
              className="text-red-500 hover:line-through text-[20px] mt-2"
              onClick={() => changeSubmit("password")}
            >
              Submit
            </button>
          </>
        )}
      </div>
      <div className="mb-10 flex flex-col w-full ">
        <span className="text-[16px] text-slate-400">Address</span>

        <div className="">
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
            {errorText.address && (
              <p className="text-red-300">Please fill out all fields</p>
            )}
            <button
              type="submit"
              className="text-red-500 hover:line-through text-[20px] mt-2"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
