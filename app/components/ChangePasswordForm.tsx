"use client";
import React, { useEffect, useState } from "react";
import { changePassword } from "../actions/users/changePassword";
import { useMediaQuery } from "react-responsive";
import { Loader, Navbar } from ".";

interface ChangePasswordFormProps {
  resetPasswordToken: string;
}

const ChangePasswordForm = ({
  resetPasswordToken,
}: ChangePasswordFormProps) => {
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 700 });

  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);

  const isMediumDeviceQuery = useMediaQuery({ maxWidth: 900 });

  const isMobileDeviceQuery = useMediaQuery({ maxWidth: 460 });
  const [isMobileDevice, setIsMobileDevice] = useState<any>(null);

  useEffect(() => {
    setIsSmallDevice(isSmallDeviceQuery);
    setIsMobileDevice(isMobileDeviceQuery);
  }, [isSmallDeviceQuery, isMediumDeviceQuery, isMobileDeviceQuery]);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [message, setMessage] = useState<string>("");

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    } else if (password.length === 0) {
      setMessage("Password cannot be empty");
      return;
    }

    const message = await changePassword(resetPasswordToken, password);

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
            <h1 className="text-[26px]">Change Password</h1>
            <input
              type="password"
              placeholder="Password"
              value={password}
              className="border-b-[2px] focus:outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              className="border-b-[2px] focus:outline-none"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              className="text-red-500 text-start hover:line-through text-[20px] "
              onClick={handleSubmit}
            >
              Change Password
            </button>
            <p className="text-slate-400">{message}</p>
          </div>
        </>
      )}
    </main>
  );
};

export default ChangePasswordForm;
