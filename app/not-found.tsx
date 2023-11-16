import Link from "next/link";
import React from "react";

const notfound = () => {
  return (
    <div className="">
      <div className="w-full flex flex-col h-screen red  p-6 text-red-500">
        <div>
          <h1 className="text-[100px]">404</h1>
          <p className="text-[26px]">Page not found</p>

          <button className="text-red-500 text-[40px] hover:line-through">
            <Link href="/home">Home</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default notfound;
