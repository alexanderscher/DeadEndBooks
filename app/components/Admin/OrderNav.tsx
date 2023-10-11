import Link from "next/link";
import React from "react";

const OrderNav = () => {
  return (
    <div>
      <button className="hover:line-through">
        <Link href="/admin/orders/pending">Pending Orders</Link>
      </button>
      <button className="ml-4 hover:line-through">
        <Link href="/admin/orders/completed">Completed Orders</Link>
      </button>
    </div>
  );
};

export default OrderNav;
