"use client";
import React from "react";
import { EmailTemplate } from "../email-templates/test-email";
import { sendEmail } from "../actions/emails/sendEmail";

const TestEmailButton = () => {
  const handleSubmit = async () => {
    sendEmail({
      from: "Admin <admin@deadendbooks.org>",
      to: ["alexcscher@gmail.com"],
      subject: "Test Email",
      react: EmailTemplate({ firstName: "Alex" }) as React.ReactElement,
    });
  };
  return (
    <div onClick={handleSubmit} className="cursor-pointer">
      Send{" "}
    </div>
  );
};

export default TestEmailButton;
