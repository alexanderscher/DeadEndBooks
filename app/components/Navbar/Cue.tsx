import React from "react";

const Cue = () => {
  return (
    <div>
      <div className="border-t-[2px] border-slate-400 ">
        <div className="mt-4 flex justify-start w-full">
          <div className="max-w-[200px] mr-[50px]">
            <img className="max-w-[200px]" src={"/41D44xk6A1L._SL1000_.jpg"} />
          </div>
          <div className="w-3/4 text-[30px]">
            <h1>What She Means</h1>
            <h1>Joan Didion</h1>
            <h1 className="text-slate-400 cursor-pointer">Out of Stock</h1>
            <h1 className="text-slate-400">2 users ahead of you</h1>
            <h1 className="text-slate-400 cursor-pointer hover:line-through">
              Remove
            </h1>
          </div>
        </div>
      </div>
      <div className="border-t-[2px] border-slate-400 mt-6">
        <div className="mt-4 flex justify-start w-full">
          <div className="max-w-[200px] mr-6">
            <img className="max-w-[200px]" src={"/41D44xk6A1L._SL1000_.jpg"} />
          </div>
          <div className="w-3/4 text-[30px]">
            <h1>What She Means</h1>
            <h1>Joan Didion</h1>
            <h1 className="text-slate-400 cursor-pointer">In Stock</h1>
            <h1 className="text-slate-400 cursor-pointer hover:line-through">
              Remove
            </h1>
            <h1 className="text-red-500 cursor-pointer hover:line-through">
              Add to cart
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cue;
