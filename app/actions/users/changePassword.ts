"use server";

import prisma from "@/prisma/client";
import bcrypt from "bcryptjs";

export const changePassword = async (
  resetPasswordToken: string,
  password: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      resetPasswordToken,
    },
  });
  if (!user) {
    return "Invalid reset token";
  }

  const resetPasswordTokenExpiry = user.resetPasswordTokenExpiry;

  if (!resetPasswordTokenExpiry) {
    return "Invalid reset token";
  }

  const today = new Date();

  if (today > resetPasswordTokenExpiry) {
    return "Token expired";
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordTokenExpiry: null,
    },
  });

  return "Password changed";
};
