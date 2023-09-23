import React from "react";

const Rentals = () => {
  return (
    <div className="w-full">
      <div className="mt-10 flex w-full  border-b-[1.5px] border-black">
        <h1 className="w-[200px] text-[20px]">Title</h1>
        <h1 className="w-[150px] text-[20px] text-end">Start Date</h1>
        <h1 className="w-[150px] text-[20px] text-end">Return Date</h1>
      </div>
      <div className="flex w-full border-b-[1.5px] border-black">
        <h1 className="w-[200px] text-[20px]">Book 1</h1>
        <h1 className="w-[150px] text-[20px] text-end">1/1/23</h1>
        <h1 className="w-[150px] text-[20px] text-end">1/11/23</h1>
      </div>
      <div className="flex w-full border-b-[1.5px] border-black">
        <h1 className="w-[200px] text-[20px]">Book 2</h1>
        <h1 className="w-[150px] text-[20px] text-end">1/2/23</h1>
        <h1 className="w-[150px] text-[20px] text-end">1/12/23</h1>
      </div>
      <div className="flex w-full border-b-[1.5px] border-black">
        <h1 className="w-[200px] text-[20px]">Book 3</h1>
        <h1 className="w-[150px] text-[20px] text-end">1/3/23</h1>
        <h1 className="w-[150px] text-[20px] text-end">1/13/23</h1>
      </div>
    </div>
  );
};

export default Rentals;
