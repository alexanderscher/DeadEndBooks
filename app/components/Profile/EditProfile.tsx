"use client";
import { ExtendedSession, UserType } from "@/types";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Loader } from "..";

interface ChangeEventState {
  username: string;
  currentPasswordPassword: string;
  currentPasswordEmail: string;
  newPassword: string;
  email: string;
  userId: string;
  [key: string]: string;
}

interface Props {
  res: any;
}

const Profile = ({ res }: Props) => {
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

  const [changeEvent, setChangeEvent] = useState<ChangeEventState>({
    username: "",
    currentPasswordPassword: "",
    currentPasswordEmail: "",
    newPassword: "",
    email: "",
    userId: "",
  });

  const [passwordPrompt, setPasswordPrompt] = useState(false);
  const [emailPrompt, setEmailPrompt] = useState(false);
  const [errorText, setErrorText] = useState({
    name: false,
    password: false,
    email: false,
    address: false,
  });

  const isProduction = process.env.NODE_ENV === "production";
  const url = isProduction
    ? "https://deadendbooks.org/"
    : "http://localhost:3000/";

  const signout = async () => {
    await signOut({ callbackUrl: url });
  };

  const [errorMessage, seterrorMessage] = useState("");

  const handleChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChangeEvent((prevState) => ({ ...prevState, [name]: value }));
  };

  const [success, setSuccess] = useState({
    username: false,
    password: false,
    email: false,
  });

  const changeSubmit = async (name: string) => {
    if (!changeEvent[name]) {
      return;
    }
    if (name === "newPassword") {
      name = "password";
    }
    const res = await fetch(`/api/user/${name}`, {
      method: "PUT",
      body: JSON.stringify(changeEvent),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess({ ...success, [name]: true });
      setErrorText({ ...errorText, [name]: false });
      setChangeEvent({
        ...changeEvent,
        [name]: "",
      });

      setTimeout(() => {
        setSuccess({ ...success, [name]: false });
      }, 3000);
    } else {
      setErrorText({ ...errorText, [name]: true });
      seterrorMessage(data.message);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      setisLoading(true);
      const data = await res;
      setUser(data);
      setChangeEvent((prevState) => ({
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
            placeholder="Change Name"
            className="border-b-[2px] border-black placeholder:text-black placeholder:text-[16px] mt-2 w-full focus:outline-none"
          />
          {errorText.name && <p className="text-red-300">{errorMessage}</p>}
          <button
            className="text-red-500 hover:line-through text-[16px] mt-2"
            onClick={() => changeSubmit("username")}
          >
            {success.username ? "Submitted" : "Submit"}
          </button>
        </div>
      </div>
      {!(session as ExtendedSession)?.user?.image && (
        <>
          <div className="mb-10 w-full items-start">
            <span className="text-[16px] text-slate-400">Email</span>
            <input
              type="text"
              name="email"
              value={changeEvent.email}
              onChange={handleChangeEvent}
              placeholder="Change email"
              className="border-b-[2px] border-black placeholder:text-black placeholder:text-[16px] mt-2 w-full focus:outline-none"
            />

            {!emailPrompt ? (
              <button
                className="text-red-500 hover:line-through text-[16px] mt-2"
                onClick={() => setEmailPrompt(true)}
              >
                Submit
              </button>
            ) : (
              <>
                <input
                  type="password"
                  name="currentPasswordEmail"
                  value={changeEvent.currentPasswordEmail}
                  onChange={handleChangeEvent}
                  placeholder="Current Password"
                  className="border-b-[2px] border-black placeholder:text-black placeholder:text-[16px] mt-2 w-full focus:outline-none"
                />
                {errorText.email && (
                  <p className="text-red-300">{errorMessage}</p>
                )}
                <button
                  className="text-red-500 hover:line-through text-[16px] mt-2"
                  onClick={() => changeSubmit("email")}
                >
                  {success.email ? "Submitted" : "Submit"}
                </button>
              </>
            )}
          </div>
          <div className="mb-10 w-full items-start">
            <span className="text-[16px] text-slate-400">Password</span>
            <input
              type="password"
              name="newPassword"
              value={changeEvent.newPassword}
              onChange={handleChangeEvent}
              placeholder="Change Password"
              className="border-b-[2px] border-black placeholder:text-black placeholder:text-[16px] mt-2 w-full focus:outline-none"
            />

            {!passwordPrompt ? (
              <button
                className="text-red-500 hover:line-through text-[16px] mt-2"
                onClick={() => setPasswordPrompt(true)}
              >
                Submit
              </button>
            ) : (
              <>
                <input
                  type="password"
                  name="currentPasswordPassword"
                  value={changeEvent.currentPasswordPassword}
                  onChange={handleChangeEvent}
                  placeholder="Current Password"
                  className="border-b-[2px] border-black placeholder:text-black placeholder:text-[16px] mt-2 w-full focus:outline-none"
                />
                {errorText.password && (
                  <p className="text-red-300">{errorMessage}</p>
                )}
                <button
                  className="text-red-500 hover:line-through text-[16px] mt-2"
                  onClick={() => changeSubmit("newPassword")}
                >
                  {success.password ? "Submitted" : "Submit"}
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
