"use server";

import prisma from "@/prisma/client";
import crypto from "crypto";
import { sendEmail } from "../emails/sendEmail";
import { ResetPasswordEmailTemplate } from "@/app/email-templates/reset-password-email";

export const resetPassword = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return "User not found";
    // throw new Error("User not found");
  }

  const resetPasswordToken = crypto.randomBytes(32).toString("base64url");
  const today = new Date();
  const expireyDate = new Date(today.setDate(today.getDate() + 1));

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      resetPasswordToken: resetPasswordToken,
      resetPasswordTokenExpiry: expireyDate,
    },
  });

  await sendEmail({
    from: "Admin <admin@deadendbooks.org>",
    to: [email],
    subject: "Reset your password",
    react: ResetPasswordEmailTemplate({
      email,
      resetPasswordToken,
    }) as React.ReactElement,
  });

  return "Please check email to reset password";
};
