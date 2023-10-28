import * as React from "react";

interface EmailTemplateProps {
  name: string;
  orderId: number;
  orderDate: string;
  titles: string[];
  returnDate: string;
}

function extractDate(inputString: string) {
  const match = inputString.match(/^([a-zA-Z]{3} [a-zA-Z]{3} \d{2} \d{4})/);
  if (match) {
    return match[1];
  }
  return null;
}

export const OrderTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  orderId,
  orderDate,
  titles,
  returnDate,
}) => (
  <div>
    <h2>Order #{orderId}</h2>
    <h3>Order Date: {extractDate(orderDate)}</h3>
    <h3>Return Date: {extractDate(returnDate)}</h3>
    <h3>Books:</h3>

    {titles.length > 0 && titles.map((title) => <li key={title}>{title}</li>)}
  </div>
);
