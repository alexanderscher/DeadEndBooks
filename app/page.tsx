import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const page = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="">
        <Link href="/home">
          <img
            src="/deadendbooks.png"
            width={100}
            height={100}
            alt="Logo"
            className="w-full max-w-[500px]"
          ></img>
        </Link>
      </div>
    </div>
  );
};

export default page;
