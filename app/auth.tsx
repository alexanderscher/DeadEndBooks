"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export const LogOutButton = () => {
  const router = useRouter();

  const signout = async () => {
    await signOut({ callbackUrl: "http://localhost:3000/" });
  };
  return (
    <button
      className="hover:line-through text-lg mr-2"
      onClick={() => signout()}
    >
      Log Out
    </button>
  );
};
