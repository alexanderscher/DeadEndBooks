"use client";
import React, { useEffect } from "react";

const CheckoutSuccess = ({}) => {
  useEffect(() => {
    const getBooks = async () => {
      const res = await fetch("/api/books");
      const data = await res.json();
      console.log(data);
    };
  }, []);
  return (
    <div>
      <h1>hello</h1>
    </div>
  );
};

export default CheckoutSuccess;
