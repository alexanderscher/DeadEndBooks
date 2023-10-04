import Link from "next/link";
import React from "react";

interface Props {
  isSmallDevice: boolean;
  isMediumDevice: boolean;
}

const AdminNav = ({ isSmallDevice, isMediumDevice }: Props) => {
  return (
    <div
      className={
        isSmallDevice ? "flex flex-wrap mt-10" : "flex flex-wrap w-full "
      }
    >
      <h1
        className={`mr-4 ${
          isSmallDevice
            ? "text-[24px]"
            : isMediumDevice
            ? "text-[24px]"
            : "text-[28px]"
        } hover:line-through cursor-pointer`}
      >
        <Link href="/admin/addbook">Add Book,</Link>
      </h1>
      <h1
        className={`mr-4 ${
          isSmallDevice
            ? "text-[24px]"
            : isMediumDevice
            ? "text-[24px]"
            : "text-[28px]"
        } hover:line-through cursor-pointer `}
      >
        <Link href="/admin/allbooks">See All Books,</Link>
      </h1>
      <h1
        className={`mr-4 ${
          isSmallDevice
            ? "text-[24px]"
            : isMediumDevice
            ? "text-[24px]"
            : "text-[28px]"
        } hover:line-through cursor-pointer`}
      >
        <Link href="/admin/current-rentals">Current Rentals,</Link>
      </h1>
      <h1
        className={`mr-4 ${
          isSmallDevice
            ? "text-[24px]"
            : isMediumDevice
            ? "text-[24px]"
            : "text-[28px]"
        } hover:line-through cursor-pointer`}
      >
        <Link href="/admin/past-rentals">Past Rentals,</Link>
      </h1>
      <h1
        className={`mr-4 ${
          isSmallDevice
            ? "text-[24px]"
            : isMediumDevice
            ? "text-[24px]"
            : "text-[28px]"
        } hover:line-through cursor-pointer`}
      >
        <Link href="/admin/users">Users,</Link>
      </h1>
      <h1
        className={`mr-4 ${
          isSmallDevice
            ? "text-[24px]"
            : isMediumDevice
            ? "text-[24px]"
            : "text-[28px]"
        } hover:line-through cursor-pointer`}
      >
        <Link href="/admin/payments">Payments</Link>
      </h1>
    </div>
  );
};

export default AdminNav;
