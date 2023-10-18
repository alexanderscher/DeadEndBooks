"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Props {
  isSmallDevice: boolean;
}
export const LogOutButton = ({ isSmallDevice }: Props) => {
  const router = useRouter();
  const isProduction = process.env.NEXT_PUBLIC_NODE_ENV === "production";
  const url = isProduction
    ? "https://deadendbooks.org"
    : "http://localhost:3000/";

  const signout = async () => {
    await signOut({ callbackUrl: url });
    location.reload();
  };
  return (
    <button
      className="hover:line-through text-md mr-2"
      onClick={() => signout()}
    >
      {isSmallDevice ? "Log Out" : "Log Out"}
    </button>
  );
};
