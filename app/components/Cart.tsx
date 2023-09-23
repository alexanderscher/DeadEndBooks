import React from "react";

const Cart = ({}) => {
  return (
    <div>
      <div className="fixed bottom-0 left-0 border-t-[2px] border-black bg-red-100 w-full text-red-500 p-5 flex ">
        <button className="text-[30px]">Checkout</button>
      </div>
      <div className="border-t-[2px] border-slate-400">
        <div className="mt-4 flex justify-start w-full">
          <div className="max-w-[200px] mr-[50px]">
            <img className="max-w-[200px]" src={"/41D44xk6A1L._SL1000_.jpg"} />
          </div>
          <div className="w-3/4 text-[30px]">
            <h1>What She Means</h1>
            <h1>Joan Didion</h1>
            <h1 className="text-slate-400 cursor-pointer">In Stock</h1>
            <h1 className="text-slate-400 cursor-pointer hover:line-through">
              Remove
            </h1>
          </div>
        </div>
      </div>
      <div className="border-t-[2px] border-slate-400 mt-6">
        <div className="mt-4 flex justify-start w-full">
          <div className="max-w-[200px] mr-[50px]">
            <img className="max-w-[200px]" src={"/41D44xk6A1L._SL1000_.jpg"} />
          </div>
          <div className="w-3/4 text-[30px]">
            <h1>What She Means</h1>
            <h1>Joan Didion</h1>
            <h1 className="text-slate-400 cursor-pointer">In Stock</h1>
            <h1 className="text-slate-400 cursor-pointer hover:line-through">
              Remove
            </h1>
          </div>
        </div>
      </div>
      <div className="border-t-[2px] border-slate-400 mt-6">
        <div className="mt-4 flex justify-start w-full">
          <div className="max-w-[200px] mr-[50px]">
            <img className="max-w-[200px]" src={"/41D44xk6A1L._SL1000_.jpg"} />
          </div>
          <div className="w-3/4 text-[30px]">
            <h1>What She Means</h1>
            <h1>Joan Didion</h1>
            <h1 className="text-slate-400 cursor-pointer">In Stock</h1>
            <h1 className="text-slate-400 cursor-pointe hover:line-through">
              Remove
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
