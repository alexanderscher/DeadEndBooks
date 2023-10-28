import * as React from "react";

interface ResetPasswordEmailTemplateProps {
  email: string;
  resetPasswordToken: string;
}
const isProduction = process.env.NODE_ENV === "production";
const url = isProduction
  ? "https://deadendbooks.org/not-found"
  : "http://localhost:3000/not-found";

export const ResetPasswordEmailTemplate: React.FC<
  Readonly<ResetPasswordEmailTemplateProps>
> = ({ email, resetPasswordToken }) => (
  <div>
    <h1>
      Reset password for <b>{email}</b>
    </h1>
    <p>
      To reset your password, click on this link and follow the instructions
    </p>
    <a
      href={
        isProduction
          ? `http://deadendbooks.org/auth/reset-password?token=${resetPasswordToken}`
          : `http://localhost:3000/auth/reset-password?token=${resetPasswordToken}`
      }
    >
      Click here to reset Password
    </a>
  </div>
);
