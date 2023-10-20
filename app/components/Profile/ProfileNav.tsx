import { ExtendedSession } from "@/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Props {
  isSmallDevice: boolean;
  isMobileDevice: boolean;
}

const ProfileNav = ({ isSmallDevice, isMobileDevice }: Props) => {
  const { data: session } = useSession();
  const active = (session as ExtendedSession)?.user?.isActive;

  return (
    <div className={isSmallDevice ? "flex mt-6  border-black" : "flex w-full"}>
      <button
        className={`mr-4 ${
          isMobileDevice
            ? "text-[18px]"
            : isSmallDevice
            ? "text-[24px]"
            : "text-[26px]"
        } hover:line-through `}
      >
        <Link href="/profile">Profile</Link>
      </button>
      <button
        className={`mr-4 ${
          isMobileDevice
            ? "text-[18px]"
            : isSmallDevice
            ? "text-[24px]"
            : "text-[26px]"
        } hover:line-through  `}
      >
        <Link href="/profile/current-rentals">Rentals</Link>
      </button>
      <button
        className={`mr-4 ${
          isMobileDevice
            ? "text-[18px]"
            : isSmallDevice
            ? "text-[24px]"
            : "text-[26px]"
        } hover:line-through `}
      >
        <Link href="/profile/history">History</Link>
      </button>
      {active ? (
        <button
          className={`mr-4 ${
            isMobileDevice
              ? "text-[18px]"
              : isSmallDevice
              ? "text-[24px]"
              : "text-[26px]"
          } hover:line-through `}
        >
          <Link href="/profile/subscription">Subscription</Link>
        </button>
      ) : (
        <button
          className={`mr-4 ${
            isMobileDevice
              ? "text-[18px]"
              : isSmallDevice
              ? "text-[24px]"
              : "text-[26px]"
          } hover:line-through `}
        >
          <Link href="/pricing"> Subscribe</Link>
        </button>
      )}
    </div>
  );
};

export default ProfileNav;
