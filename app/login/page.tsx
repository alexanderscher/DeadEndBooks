"use client";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  console.log(data);

  const [google, setGoogle] = useState(false);

  const [missingEmail, setMissingEmail] = useState(false);
  const [missingPassword, setMissingPassowrd] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [invalidP, setInvalidP] = useState(false);

  const loginUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signIn("credentials", { ...data, redirect: false });
    if (result?.error) {
      console.error(result?.error);
      if (result?.error === "Missing email or password") {
        if (data.email === "" && data.password === "") {
          setMissingEmail(true);
          setMissingPassowrd(true);
        } else if (data.email === "" && data.password !== "") {
          setMissingEmail(true);
          setMissingPassowrd(false);
        } else if (data.email !== "" && data.password === "") {
          setMissingEmail(false);
          setMissingPassowrd(true);
        }
      }
      if (result?.error === "User not found") {
        setNotFound(true);
      }
      if (result?.error === "Invalid password") {
        setInvalidP(true);
      }
    } else if (!result?.error) {
      setMissingEmail(false);
      setMissingPassowrd(false);
      setNotFound(false);
      setInvalidP(false);
      router.push("/");
    }
  };

  return (
    <div className="w-full h-screen">
      <div className=" flex flex-col w-full h-full items-center justify-center">
        <Link href="/">
          <Image
            className="cursor-pointer mb-10 w-[200px]"
            alt="send"
            src="/Screenshot 2023-09-18 at 4.38.04 PM.png"
            width={100}
            height={100}
          />
        </Link>

        <div className="w-3/4 min-w-[500px] max-w-[600px] ">
          <form noValidate onSubmit={loginUser} className={"flex flex-col "}>
            <input
              className={`border-[3px] border-black  w-full h-[50px]  px-3 focus:outline-none focus:none placeholder:text-slate-400 ${
                missingEmail ? "placeholder-red-500 border-red-500" : ""
              } ${missingPassword && !missingEmail ? "border-b-[0px]" : ""}`}
              id="email"
              name="email"
              type="text"
              placeholder={missingEmail ? "Please fill out email" : "Email"}
              required
              value={data.email}
              onChange={(e) => {
                setMissingEmail(false);
                setData({ ...data, email: e.target.value });
              }}
            />
            <input
              className={`border-t-[0px] border-[3px] border-black  w-full h-[50px]  px-3 focus:outline-none focus:none  placeholder:text-slate-400 ${
                missingPassword && !missingEmail
                  ? "placeholder-red-500 border-t-[1.5px] border-red-500"
                  : ""
              } ${
                missingEmail && missingPassword
                  ? "placeholder-red-500  border-red-500"
                  : ""
              }`}
              id="password"
              name="password"
              type="text"
              placeholder={
                missingPassword ? "Please fill out password" : "Password"
              }
              required
              value={data.password}
              onChange={(e) => {
                setMissingPassowrd(false);
                setData({ ...data, password: e.target.value });
              }}
            />
            {notFound && (
              <p className="text-red-500 text-sm mt-2">User not found</p>
            )}
            {invalidP && (
              <p className="text-red-500 text-sm mt-2">Incorrect password</p>
            )}

            <div className="flex flex-col  mt-5 items-center">
              <button
                type="submit"
                className=" text-red-500  text-[26px] hover:line-through"
              >
                Login
              </button>

              <p className="text-[26px] hover:line-through cursor-pointer">
                <Link href="\signup"> Create an account</Link>
              </p>
              <p className="text-[26px] hover:line-through cursor-pointer">
                Forgot password
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
