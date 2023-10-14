"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Props {
  isSmallDevice: boolean;
}
export const LogOutButton = ({ isSmallDevice }: Props) => {
  const router = useRouter();

  const signout = async () => {
    await signOut({ callbackUrl: "http://localhost:3000/" });
    location.reload();
  };
  return (
    <button
      className="hover:line-through text-md mr-2"
      onClick={() => signout()}
    >
      {isSmallDevice ? "Log Out, " : "Log Out"}
    </button>
  );
};
