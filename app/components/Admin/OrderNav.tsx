import Link from "next/link";
import React from "react";
type Props = {
  isMobileDevice: boolean;
};
const OrderNav = ({ isMobileDevice }: Props) => {
  return (
    <div
      className={`text-[18px] mb-2 ${
        isMobileDevice ? "text-start" : "text-end"
      }`}
    >
      <button className="hover:line-through text-red-500">
        <Link href="/admin/orders/pending">Pending Orders</Link>
      </button>
      <button className="ml-4 hover:line-through text-red-500">
        <Link href="/admin/orders/completed">Completed Orders</Link>
      </button>
    </div>
  );
};

export default OrderNav;
