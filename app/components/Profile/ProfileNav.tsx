import { ExtendedSession } from "@/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Props {
  isSmallDevice: boolean;
}

const ProfileNav = ({ isSmallDevice }: Props) => {
  const { data: session } = useSession();

  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    if (session && (session as ExtendedSession)?.user?.admin) {
      setAdmin(true);
    }
  }, []);
  return (
    <div className={isSmallDevice ? "flex mt-10  border-black" : "flex w-full"}>
      <h1
        className={`mr-6 ${
          isSmallDevice ? "text-[24px]" : "text-[26px]"
        } hover:line-through cursor-pointer`}
      >
        <Link href="/profile">Profile</Link>
      </h1>
      <h1
        className={`mr-6 ${
          isSmallDevice ? "text-[24px]" : "text-[26px]"
        } hover:line-through cursor-pointer `}
      >
        <Link href="/profile/current-rentals">Rentals</Link>
      </h1>
      <h1
        className={`mr-6 ${
          isSmallDevice ? "text-[24px]" : "text-[26px]"
        } hover:line-through cursor-pointer`}
      >
        <Link href="/profile/history">History</Link>
      </h1>
      {admin && (
        <h1
          className={`mr-6 ${
            isSmallDevice ? "text-[24px]" : "text-[26px]"
          } hover:line-through cursor-pointer`}
        >
          <Link href="/admin/addbook">Admin</Link>
        </h1>
      )}
    </div>
  );
};

export default ProfileNav;
