import React from "react";

const Payments = () => {
  return (
    <div className="w-full">
      <div className="mt-10 flex w-full  border-b-[1.5px] border-black">
        <h1 className="w-[150px] text-[20px]">Date</h1>
        <h1 className="w-[150px] text-[20px] ">Amount</h1>
      </div>
      <div className="flex w-full border-b-[1.5px] border-black">
        <h1 className="w-[150px] text-[20px] ">1/1/23</h1>
        <h1 className="w-[150px] text-[20px] ">$20.00</h1>
      </div>
      <div className="flex w-full border-b-[1.5px] border-black">
        <h1 className="w-[150px] text-[20px] ">2/1/23</h1>
        <h1 className="w-[150px] text-[20px] ">$20.00</h1>
      </div>
      <div className="flex w-full border-b-[1.5px] border-black">
        <h1 className="w-[150px] text-[20px] ">3/1/23</h1>
        <h1 className="w-[150px] text-[20px] ">$20.00</h1>
      </div>
    </div>
  );
};

export default Payments;
