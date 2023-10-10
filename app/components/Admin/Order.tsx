"use client";
import React, { useEffect, useState } from "react";

const Order = () => {
  const [orders, setOrders] = useState([
    {
      address: {
        address: "",
        city: "",
        country: "",
        state: "",
        zipcode: "",
        phone: "",
      },
      title: "",
      email: "",
      name: "",
      start_date: "",
    },
  ]);

  console.log(orders);

  useEffect(() => {
    const getOrders = async () => {
      const res = await fetch("/api/order");
      const data = await res.json();

      for (const order in data) {
        const res = await fetch(`/api/book/${data[order].bookId}`);
        const book = await res.json();

        const userres = await fetch(`/api/user/${data[order].userId}`);
        const user = await userres.json();

        setOrders({
          address: {
            address: data[order].address.address,
            city: data[order].address.city,
            country: data[order].address.country,
            state: data[order].address.state,
            zipcode: data[order].address.zipcode,
            phone: data[order].address.phone,
          },
          title: book.title,
          email: user.email,
          name: user.name,
          start_date: data[order].start_date,
        });
      }
    };
    getOrders();
  }, []);
  return (
    <div>
      <h1>Orders</h1>
    </div>
  );
};

export default Order;
