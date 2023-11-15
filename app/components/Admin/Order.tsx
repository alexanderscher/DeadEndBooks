"use client";
import React, { useEffect, useState } from "react";
import { Loader } from "..";
import OrderNav from "./OrderNav";
import { usePathname } from "next/navigation";

const formatDate = (input: string) => {
  if (input === "") {
    return;
  } else {
    const date = new Date(input);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are
    const year = String(date.getFullYear()).slice(-2); // Get the last two

    return `${month}/${day}/${year}` as string;
  }
};

type OrderBook = {
  bookId: number;
  orderId: number;
  returned?: boolean;
};

type Order = {
  addressOrder: {
    address: string;
    city: string;
    country: string;
    state: string;
    zipcode: string;
    phone: string;
    orderName: string;
  };

  id: number;
  title: string[];
  email: string;
  name: string;
  start_date: string;
  return_date: string;

  shipped: boolean;
  order_date: string;
  returned: { bookTitle: string; returned: boolean }[];
};

type Props = {
  isMobileDevice: boolean;
};

const Order = ({ isMobileDevice }: Props) => {
  const [isLoaded, setIsLoaded] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  const [reload, setReload] = useState(false);
  const currentPage = usePathname();

  const markasShipped = async (id: number) => {
    const res = await fetch(`/api/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    });
    const data = await res.json();
    setReload(true);
  };

  useEffect(() => {
    setOrders([]);

    const getOrders = async () => {
      setIsLoaded(true);
      setReload(false);

      const res = await fetch(`/api/order/${currentPage.split("/")[3]}`, {
        method: "PUT",
        next: { revalidate: 60 * 60 * 24 },
      });
      const data = await res.json();

      setOrders(data);
      setIsLoaded(false);
    };
    getOrders();
  }, [reload]);

  if (isLoaded) {
    return <Loader />;
  }

  if (orders.length === 0) {
    return (
      <div className="w-full  mt-10  max-w-[840px]">
        <OrderNav isMobileDevice={isMobileDevice} />
        <div className="w-full flex mt-10">
          <span className="text-[26px]">No orders</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 max-w-[840px]">
      <OrderNav isMobileDevice={isMobileDevice} />
      {orders.map((order) => (
        <div
          key={order.id}
          className="border-b-[2px] border-black flex  justify-between "
        >
          <div className="mt-2 w-full mb-2">
            <div className="flex justify-between text-md border-b-[2px] border-slate-300 mt-1">
              <span className="text-slate-400">Order ID:</span>
              <span className="">{order.id}</span>
            </div>
            <div className="flex justify-between text-md border-b-[2px] border-slate-300 mt-1">
              <span className="text-slate-400">Email:</span>
              <span className="">{order.email}</span>
            </div>
            <div className="flex justify-between text-md border-b-[2px] border-slate-300 mt-1">
              <span className="text-slate-400">Order date:</span>
              <span>{order.order_date}</span>
            </div>
            <div className="flex justify-between text-md border-b-[2px] border-slate-300 mt-1">
              <span className="text-slate-400">Subscription start date:</span>
              <span>{order.start_date}</span>
            </div>
            <div className="flex justify-between text-md border-b-[2px] border-slate-300 mt-1">
              <span className="text-slate-400">Subscription end date:</span>
              <span>{order.return_date}</span>
            </div>

            <div className="flex justify-between text-md border-b-[2px] border-slate-300 mt-1">
              <span className="text-slate-400">Order items:</span>
              <div className="flex flex-col">
                {order.title.map((title) => (
                  <span key={title} className="">
                    {title}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-between text-md border-b-[2px] border-slate-300 mt-1">
              <span className="text-slate-400">Status:</span>
              <span>{!order.shipped ? "Not shipped" : "Shipped"}</span>
            </div>
            {currentPage === "/admin/orders/completed" && (
              <div className="flex justify-between text-md border-b-[2px] border-slate-300 mt-1">
                <span className="text-slate-400">Return Status:</span>
                <div className="flex flex-col">
                  {order.returned.map((title) => (
                    <div className="flex justify-end">
                      <span key={title.bookTitle} className="">
                        {title.bookTitle}:
                      </span>
                      <span className="text-end ml-2">
                        {title.returned ? "Returned" : "Not returned"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between text-md ">
              <div className="flex flex-col justify-between">
                <span className="text-slate-400">Order address:</span>
                {currentPage === "/admin/orders/pending" && (
                  <button
                    className="text-red-500 hover:line-through text-[18px]"
                    onClick={() => markasShipped(order.id)}
                  >
                    Mark as shipped
                  </button>
                )}
              </div>

              <div
                className={
                  currentPage === "/admin/orders/pending"
                    ? "text-end flex flex-col"
                    : "text-end w-3/4 flex flex-col"
                }
              >
                <span className="mt-1">{order.addressOrder.orderName}</span>
                <span className="mt-1">{order.addressOrder.address}</span>
                <span className="mt-1">{order.addressOrder.city}</span>
                <span className="mt-1">{order.addressOrder.country}</span>
                <span className="mt-1">{order.addressOrder.state}</span>
                <span className="mt-1">{order.addressOrder.zipcode}</span>
                <span className="mt-1">{order.addressOrder.phone}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Order;
