import { ExtendedSession } from "@/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Props {
  isSmallDevice: boolean;
}

const ProfileNav = ({ isSmallDevice }: Props) => {
  const { data: session } = useSession();
  const active = (session as ExtendedSession)?.user?.isActive;

  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    if (session && (session as ExtendedSession)?.user?.admin) {
      setAdmin(true);
    }
  }, []);
  return (
    <div className={isSmallDevice ? "flex mt-10  border-black" : "flex w-full"}>
      <button
        className={`mr-4 ${
          isSmallDevice ? "text-[24px]" : "text-[26px]"
        } hover:line-through `}
      >
        <Link href="/profile">Profile</Link>
      </button>
      <button
        className={`mr-4 ${
          isSmallDevice ? "text-[24px]" : "text-[26px]"
        } hover:line-through  `}
      >
        <Link href="/profile/current-rentals">Rentals</Link>
      </button>
      <button
        className={`mr-4 ${
          isSmallDevice ? "text-[24px]" : "text-[26px]"
        } hover:line-through `}
      >
        <Link href="/profile/history">History</Link>
      </button>
      {active ? (
        <button className="hover:line-through text-[26px]">
          <Link href="/profile/subscription">Subscription</Link>
        </button>
      ) : (
        <button className="hover:line-through text-[26px]">
          <Link href="/pricing"> Subscribe</Link>
        </button>
      )}
      {/* {admin && (
        <button
          className={`mr-4 ${
            isSmallDevice ? "text-[24px]" : "text-[26px]"
          } hover:line-through `}
        >
          <Link href="/admin/addbook">Admin</Link>
        </button>
      )} */}
    </div>
  );
};

export default ProfileNav;
