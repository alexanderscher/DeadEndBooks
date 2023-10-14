import Link from "next/link";
import React from "react";

const notfound = () => {
  return (
    <div className="">
      <div className="w-full flex flex-col h-screen red  p-10 text-red-500">
        <div>
          <h1 className="text-[100px]">404</h1>
          <p className="text-[30px]">Page not found</p>

          <button className="text-red-500 text-[40px] hover:line-through">
            <Link href="/home">Go Home</Link>
          </button>
        </div>
        <div className="flex items-center justify-center">
          <img
            className="max-w-[500px] mt-16"
            src="/Screenshot 2023-09-18 at 4.38.04 PM.png"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default notfound;
