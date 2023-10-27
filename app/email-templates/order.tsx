import * as React from "react";

interface EmailTemplateProps {
  name: string;
  orderId: number;
  orderDate: string;
  titles: string[];
  returnDate: string;
}

export const OrderTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  orderId,
  orderDate,
  titles,
  returnDate,
}) => (
  <div>
    <h1>{name}</h1>
    <h2>Order #{orderId}</h2>
    <h3>Order Date: {orderDate}</h3>
    <h3>Return Date: {returnDate}</h3>
    <h3>Books:</h3>

    {titles.length > 0 && titles.map((title) => <li key={title}>{title}</li>)}
  </div>
);
