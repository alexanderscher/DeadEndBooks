"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

interface Props {
  isSmallDevice: boolean;
}
export const LogOutButton = ({ isSmallDevice }: Props) => {
  const router = useRouter();
  const isProduction = process.env.NODE_ENV === "production";
  const url = isProduction
    ? "https://deadendbooks.org/home"
    : "http://localhost:3000/home";

  const signout = async () => {
    await signOut({ callbackUrl: url });
    location.reload();
  };

  const isMobileDeviceQuery = useMediaQuery({ maxWidth: 460 });
  const [isMobileDevice, setIsMobileDevice] = useState<any>(null);

  useEffect(() => {
    setIsMobileDevice(isMobileDeviceQuery);
  }, [isMobileDeviceQuery]);

  return (
    <button
      className={`hover:line-through text-md
     mr-2`}
      onClick={() => signout()}
    >
      {isSmallDevice ? "Log Out" : "Log Out"}
    </button>
  );
};
