"use client";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";

interface DataProps {
  name: string;
  email: string;
  password: string;
  subscribed: boolean;
}

export default function Signup() {
  const router = useRouter();
  const [data, setData] = useState<DataProps>({
    name: "",
    email: "",
    password: "",
    subscribed: false,
  });

  const loginUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signIn("credentials", { ...data, redirect: false });
    router.push("/");
  };

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const registerUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    });
    if (response.status === 400) {
      if (data.name === "") {
        setUsernameError(true);
      }
      if (data.email === "") {
        setEmailError(true);
      }
      if (data.password === "") {
        setPasswordError(true);
      }
    }

    if (response.status === 422) {
      setUserExists(false);
      setInvalid(true);
    }

    if (response.status === 409) {
      setInvalid(false);
      setUserExists(true);
    }

    if (response.status === 201) {
      loginUser(e);
    }
  };

  return (
    <div className="w-full h-screen">
      <div className="flex flex-col w-full h-full items-center justify-center">
        <Link href="/">
          {/* <Image
            className="cursor-pointer mb-10 w-[200px]"
            alt="send"
            src="/Screenshot 2023-09-18 at 4.38.04 PM.png"
            width={100}
            height={100}
          /> */}
          <h1 className="text-[40px] text-red-500 mb-10 font-bold">
            DEAD END BOOKS
          </h1>
        </Link>
        <div className="w-3/4 min-w-[500px] max-w-[600px] ">
          <form onSubmit={registerUser} noValidate className="flex flex-col">
            <input
              className={`border-[3.5px] border-red-500  w-full h-[50px] px-3 focus:outline-none focus:none placeholder:text-red-300 text-red-500 ${
                usernameError ? "placeholder:text-blue-300 border-blue-500" : ""
              } ${emailError && !usernameError ? "border-b-[0px]" : ""}`}
              id="name"
              name="name"
              type="text"
              placeholder={usernameError ? "Username is required" : "Username"}
              required
              value={data.name}
              onChange={(e) => {
                setUsernameError(false);
                setData({ ...data, name: e.target.value });
              }}
            />
            <input
              className={`border-t-[0px] border-[3.5px] border-red-500  w-full h-[50px] px-3 focus:outline-none focus:none placeholder:text-red-300 text-red-500 ${
                emailError && !usernameError
                  ? "placeholder:text-blue-300 border-t-[1.5px] border-blue-500"
                  : ""
              } ${
                usernameError && emailError
                  ? "placeholder:text-blue-300  border-blue-500"
                  : ""
              } ${!emailError && passwordError ? "border-b-[0px]" : ""}`}
              id="email"
              name="email"
              type="text"
              placeholder={emailError ? "Email is required" : "Email"}
              required
              value={data.email}
              onChange={(e) => {
                setEmailError(false);
                setData({ ...data, email: e.target.value });
              }}
            />
            <input
              className={`border-t-[0px] border-[3.5px] border-red-500  w-full h-[50px]  px-3 focus:outline-none focus:none placeholder:text-red-300 text-red-500 ${
                passwordError && !emailError
                  ? "placeholder:text-blue-300 border-t-[1.5px] border-blue-500"
                  : ""
              } ${
                emailError && passwordError
                  ? "placeholder:text-blue-300  border-blue-500"
                  : ""
              }`}
              id="password"
              name="password"
              type="text"
              placeholder={passwordError ? "Password is required" : "Password"}
              required
              value={data.password}
              onChange={(e) => {
                setPasswordError(false);
                setData({ ...data, password: e.target.value });
              }}
            />

            {userExists && (
              <p className="text-red-500 text-sm mt-2">User already exists</p>
            )}
            {invalid && (
              <p className="text-red-500 text-sm mt-2">
                Please provide a valid email address
              </p>
            )}
            <div className="flex flex-col  mt-5 items-center">
              <button
                type="submit"
                className=" text-red-500 font-bold  text-[26px] hover:line-through"
              >
                Submit
              </button>

              <p className="text-[26px] hover:line-through cursor-pointer text-red-300">
                <Link href="\login">Have an account? Log in</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
