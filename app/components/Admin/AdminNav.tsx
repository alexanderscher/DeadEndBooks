import Link from "next/link";
import React from "react";

interface Props {
  isSmallDevice: boolean;
  isMediumDevice: boolean;
}

const AdminNav = ({ isSmallDevice, isMediumDevice }: Props) => {
  return (
    <div className={isSmallDevice ? "flex mt-10" : "flex w-full"}>
      <h1
        className={`mr-6 ${
          isSmallDevice
            ? "text-[24px]"
            : isMediumDevice
            ? "text-[22px]"
            : "text-[28px]"
        } hover:line-through cursor-pointer`}
      >
        <Link href="/admin/addbook">Add Book</Link>
      </h1>
      <h1
        className={`mr-6 ${
          isSmallDevice
            ? "text-[24px]"
            : isMediumDevice
            ? "text-[22px]"
            : "text-[28px]"
        } hover:line-through cursor-pointer `}
      >
        <Link href="/admin/allbooks">See All Books</Link>
      </h1>
      <h1
        className={`mr-6 ${
          isSmallDevice
            ? "text-[24px]"
            : isMediumDevice
            ? "text-[22px]"
            : "text-[28px]"
        } hover:line-through cursor-pointer`}
      >
        <Link href="/admin/users">Users</Link>
      </h1>
      <h1
        className={`mr-6 ${
          isSmallDevice
            ? "text-[24px]"
            : isMediumDevice
            ? "text-[22px]"
            : "text-[28px]"
        } hover:line-through cursor-pointer`}
      >
        <Link href="/admin/payments">Payments</Link>
      </h1>
    </div>
  );
};

export default AdminNav;
