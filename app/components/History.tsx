import React from "react";

const History = () => {
  return (
    <div className="w-full">
      <div className="mt-10 flex w-full  border-b-[1.5px] border-black">
        <h1 className="w-1/4 text-[18px]">Title</h1>
        <h1 className="w-1/4 text-[18px]">Status</h1>
        <h1 className="w-1/4 text-[18px]">Return Date</h1>
        <h1 className="ww-1/4 text-[18px]">Late fee</h1>
      </div>
      <div className="flex w-full border-b-[1.5px] border-black">
        <h1 className="w-1/4 text-[18px]">Book 1</h1>
        <h1 className="w-1/4 text-[18px]">Returned</h1>
        <h1 className="w-1/4 text-[18px]">1/1/23</h1>
        <h1 className="w-1/4 text-[18px]">$0.00</h1>
      </div>
      <div className="flex w-full border-b-[1.5px] border-black">
        <h1 className="w-1/4 text-[18px]">Book 1</h1>
        <h1 className="w-1/4 text-[18px]">Pending return</h1>
        <h1 className="w-1/4 text-[18px]">1/1/23</h1>
        <h1 className="w-1/4 text-[18px]">$10.00</h1>
      </div>
      <div className="flex w-full border-b-[1.5px] border-black">
        <h1 className="w-1/4 text-[18px]">Book 3</h1>
        <h1 className="w-1/4 text-[18px]">Returned</h1>
        <h1 className="w-1/4 text-[18px]">1/1/23</h1>
        <h1 className="w-1/4 text-[18px]">$0.00</h1>
      </div>
    </div>
  );
};

export default History;
