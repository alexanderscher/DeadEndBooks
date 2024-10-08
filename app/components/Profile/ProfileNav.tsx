"use client";
import { ExtendedSession } from "@/types";
import { useDeviceQueries } from "@/utils/deviceQueries";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Props {
  isActive: boolean;
}

const ProfileNav = ({ isActive }: Props) => {
  const { isSmallDevice, isMobileDevice } = useDeviceQueries();

  return (
    <div
      className={
        isSmallDevice
          ? "flex mt-6 border-black text-slate-500"
          : "flex w-full text-slate-500"
      }
    >
      <button
        className={` ${
          isMobileDevice
            ? "text-[20px] mr-2"
            : isSmallDevice
            ? "text-[24px] mr-4"
            : "text-[26px] mr-4"
        } hover:line-through `}
      >
        <Link href="/profile">Profile</Link>
      </button>
      <button
        className={` ${
          isMobileDevice
            ? "text-[20px] mr-2"
            : isSmallDevice
            ? "text-[24px] mr-4"
            : "text-[26px] mr-4"
        } hover:line-through  `}
      >
        <Link href="/profile/current-rentals">Rentals</Link>
      </button>
      <button
        className={` ${
          isMobileDevice
            ? "text-[20px] mr-2"
            : isSmallDevice
            ? "text-[24px] mr-4"
            : "text-[26px] mr-4"
        } hover:line-through `}
      >
        <Link href="/profile/history">History</Link>
      </button>
      {isActive ? (
        <button
          className={` ${
            isMobileDevice
              ? "text-[20px] mr-2"
              : isSmallDevice
              ? "text-[24px] mr-4"
              : "text-[26px] mr-4"
          } hover:line-through `}
        >
          <Link href="/profile/subscription">Subscription</Link>
        </button>
      ) : (
        <button
          className={` ${
            isMobileDevice
              ? "text-[20px] mr-2"
              : isSmallDevice
              ? "text-[24px] mr-4"
              : "text-[26px] mr-4"
          } hover:line-through `}
        >
          <Link href="/pricing"> Subscribe</Link>
        </button>
      )}
    </div>
  );
};

export default ProfileNav;
