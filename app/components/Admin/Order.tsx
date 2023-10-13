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
  shipped: boolean;
  returned: boolean;
  order_date: string;
};

const Order = () => {
  const [isLoaded, setIsLoaded] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  console.log(orders);
  const [reload, setReload] = useState(false);
  const currentPage = usePathname();

  const markasShipped = async (id: number) => {
    console.log(id);
    const res = await fetch(`/api/admin/order`, {
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

      const res = await fetch(`/api/admin/order/${currentPage.split("/")[3]}`);
      const data = await res.json();
      for (const order of data) {
        console.log(order.books);
        const bookTitles = await Promise.all(
          order.books.map(async (book: OrderBook) => {
            const res = await fetch(`/api/book/${book.bookId}`);
            const bookOrder = await res.json();
            return bookOrder.title;
          })
        );

        const userres = await fetch(`/api/user/${order.userId}`);
        const user = await userres.json();

        setOrders((prevOrders) => [
          ...prevOrders,
          {
            addressOrder: {
              address: order.address.address,
              city: order.address.city,
              country: order.address.country,
              state: order.address.state,
              zipcode: order.address.zipcode,
              phone: order.address.phone,
              orderName: order.address.name,
            },
            id: order.id,
            title: bookTitles,
            email: user.email,
            name: user.name,
            order_date: formatDate(order.order_date) as string,

            start_date: formatDate(order.start_date) as string,
            shipped: order.shipped,
            returned: order.returned,
          },
        ]);
      }
      setIsLoaded(false);
    };
    getOrders();
  }, [reload]);

  if (isLoaded) {
    return <Loader />;
  }

  if (orders.length === 0) {
    return (
      <div className="w-full  mt-10">
        <OrderNav />
        <h1 className="text-[30px] mt-10">No current orders</h1>
      </div>
    );
  }

  return (
    <div className="mt-10 max-w-[1000px]">
      <OrderNav />
      {orders.map((order) => (
        <div
          key={order.id}
          className="border-t-[2px] border-black flex  justify-between "
        >
          <div className="mt-2 w-full mb-2">
            <div className="flex justify-between text-lg border-b-[2px] border-slate-300 mt-1">
              <h1 className="text-slate-500">Order ID:</h1>
              <h1 className="">{order.id}</h1>
            </div>
            <div className="flex justify-between text-lg border-b-[2px] border-slate-300 mt-1">
              <h1 className="text-slate-500">Email:</h1>
              <h1 className="">{order.email}</h1>
            </div>

            <div className="flex justify-between text-lg border-b-[2px] border-slate-300 mt-1">
              <h1 className="text-slate-500">Subscription start date:</h1>
              <h1>{order.start_date}</h1>
            </div>
            <div className="flex justify-between text-lg border-b-[2px] border-slate-300 mt-1">
              <h1 className="text-slate-500">Order date:</h1>
              <h1>{order.order_date}</h1>
            </div>
            <div className="flex justify-between text-lg border-b-[2px] border-slate-300 mt-1">
              <h1 className="text-slate-500">Status:</h1>
              <h1>{order.shipped ? "Shipped" : "Not shipped"}</h1>
            </div>
            <div className="flex justify-between text-lg border-b-[2px] border-slate-300 mt-1">
              <h1 className="text-slate-500">Order items:</h1>
              <div className="flex flex-col">
                {order.title.map((title) => (
                  <h1 className="">{title}</h1>
                ))}
              </div>
            </div>
            <div className="flex justify-between text-lg ">
              <div className="flex flex-col justify-between">
                <h1 className="text-slate-500">Order address:</h1>
                {currentPage === "/admin/orders/pending" && (
                  <button
                    className="text-red-500 hover:line-through text-[20px]"
                    onClick={() => markasShipped(order.id)}
                  >
                    Mark as shipped
                  </button>
                )}
              </div>

              <div
                className={
                  currentPage === "/admin/orders/pending"
                    ? "text-end"
                    : "text-end w-3/4"
                }
              >
                <h1 className="mt-1">{order.addressOrder.orderName}</h1>
                <h1 className="mt-1">{order.addressOrder.address}</h1>
                <h1 className="mt-1">{order.addressOrder.city}</h1>
                <h1 className="mt-1">{order.addressOrder.country}</h1>
                <h1 className="mt-1">{order.addressOrder.state}</h1>
                <h1 className="mt-1">{order.addressOrder.zipcode}</h1>
                <h1 className="mt-1">{order.addressOrder.phone}</h1>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Order;
