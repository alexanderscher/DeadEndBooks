import "./globals.css";
import type { Metadata } from "next";
import Head from "next/head";
import localFont from "next/font/local";
const myFont = localFont({
  src: "../SuisseIntl-Medium/SuisseIntl-Medium.woff",
});
import { Providers } from "./providers";
import { SearchProvider } from "@/app/components/Search/SearchContext";
export const metadata: Metadata = {
  title: "Dead End Books",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${myFont.className} page-margin `}>
        <Providers>
          <SearchProvider>{children} </SearchProvider>
        </Providers>
      </body>
    </html>
  );
}
