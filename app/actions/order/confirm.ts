"use server";
import { OrderTemplate } from "@/app/email-templates/order";
import { sendEmail } from "../emails/sendEmail";

type OrderData = {
  email: string;
  name: string;
  orderId: number;
  date: string;
  titles: string[];
  returnDate: string;
};

export const confirmation = async (data: OrderData) => {
  sendEmail({
    from: "Deadendbooks <admin@deadendbooks.org>",
    to: [data.email],
    subject: "Order " + data.orderId + " confirmation",
    react: OrderTemplate({
      name: data.name,
      orderId: data.orderId,
      orderDate: data.date,
      titles: data.titles,
      returnDate: data.returnDate,
    }) as React.ReactElement,
  });
};
