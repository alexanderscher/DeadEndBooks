"use server";
import { NewOrderTemplate } from "@/app/email-templates/order";
import { sendEmail } from "../emails/sendEmail";

type OrderData = {
  email: string;
  name: string;
  orderId: number;
  date: string;
  titles: string[];
  returnDate: string;
};

export const newOrder = async (data: OrderData) => {
  sendEmail({
    from: "Dead End Books <admin@deadendbooks.org>",
    to: ["alexcscher@gmail.com"],
    subject: "New Order",
    react: NewOrderTemplate({
      name: data.name,
      orderId: data.orderId,
      orderDate: data.date,
      titles: data.titles,
      returnDate: data.returnDate,
    }) as React.ReactElement,
  });
};
