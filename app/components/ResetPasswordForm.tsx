"use client";
import React, { useEffect, useState } from "react";
import { resetPassword } from "../actions/users/resetPassword";
import { Loader, Navbar } from ".";
import { useMediaQuery } from "react-responsive";

const ResetPasswordForm = () => {
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 700 });

  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);

  const isMediumDeviceQuery = useMediaQuery({ maxWidth: 900 });
  const [isMediumDevice, setIsMediumDevice] = useState<any>(null);

  const isMobileDeviceQuery = useMediaQuery({ maxWidth: 460 });
  const [isMobileDevice, setIsMobileDevice] = useState<any>(null);

  useEffect(() => {
    setIsSmallDevice(isSmallDeviceQuery);
    setIsMediumDevice(isMediumDeviceQuery);
    setIsMobileDevice(isMobileDeviceQuery);
  }, [isSmallDeviceQuery, isMediumDeviceQuery, isMobileDeviceQuery]);
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async () => {
    const message = await resetPassword(email);

    setMessage(message);
  };

  return (
    <main className={isSmallDevice ? "" : "page"}>
      {isSmallDevice === null ? (
        <Loader />
      ) : (
        <>
          <Navbar />

          <div
            className={`flex flex-col gap-4 w-full ${isSmallDevice && "mt-6"}`}
          >
            <h1 className="text-[26px]">Reset Password</h1>
            <input
              type="email"
              placeholder="Email"
              className="border-b-[2px] focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="text-red-500 text-start hover:line-through text-[20px] "
              onClick={handleSubmit}
            >
              Send reset password email
            </button>
            <p className="text-slate-400">{message}</p>
          </div>
        </>
      )}
    </main>
  );
};

export default ResetPasswordForm;
