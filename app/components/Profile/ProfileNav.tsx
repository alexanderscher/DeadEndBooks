import Link from "next/link";
import React from "react";

interface Props {
  isSmallDevice: boolean;
}

const ProfileNav = ({ isSmallDevice }: Props) => {
  return (
    <div className={isSmallDevice ? "flex mt-10  border-black" : "flex w-full"}>
      <h1
        className={`mr-6 ${
          isSmallDevice ? "text-[24px]" : "text-[28px]"
        } hover:line-through cursor-pointer`}
      >
        <Link href="/profile">Profile</Link>
      </h1>
      <h1
        className={`mr-6 ${
          isSmallDevice ? "text-[24px]" : "text-[28px]"
        } hover:line-through cursor-pointer `}
      >
        <Link href="/profile/current-rentals">Rentals</Link>
      </h1>
      <h1
        className={`mr-6 ${
          isSmallDevice ? "text-[24px]" : "text-[28px]"
        } hover:line-through cursor-pointer`}
      >
        <Link href="/profile/history">History</Link>
      </h1>
      <h1
        className={`mr-6 ${
          isSmallDevice ? "text-[24px]" : "text-[28px]"
        } hover:line-through cursor-pointer`}
      >
        <Link href="/profile/payments">Payments</Link>
      </h1>
    </div>
  );
};

export default ProfileNav;
