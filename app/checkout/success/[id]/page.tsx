"use client";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";
import { Loader, Navbar, CheckoutSuccess } from "@/app/components";
import { useSession } from "next-auth/react";
import { ExtendedSession } from "@/types";
import { usePathname, useRouter } from "next/navigation";

const Page = () => {
  const [isSmallDevice, setIsSmallDevice] = useState<boolean | null>(null);
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 700 });
  const { data: session, status } = useSession();
  const router = useRouter();
  const [yourOrder, setYourOrder] = useState<boolean | null>(null);
  const currentPage = usePathname();
  const [loading, setLoading] = useState<boolean>(true);
  const [orderBooks, setOrderBooks] = useState([
    {
      orderId: 0,
      bookId: 0,
    },
  ]);

  useEffect(() => {
    setIsSmallDevice(isSmallDeviceQuery);
  }, [isSmallDeviceQuery]);

  useEffect(() => {
    if (status !== "authenticated") return;

    if (session) {
      const orderId = currentPage.split("success/")[1];

      const getOrder = async () => {
        const res = await fetch(`/api/order/${orderId}`);

        if (res.status === 404) {
          router.push("/not-found");
          return;
        }
        const data = await res.json();

        setOrderBooks(data.books);

        if (data.userId !== parseInt((session as ExtendedSession)?.user?.id)) {
          router.push("/not-found");
        } else {
          setYourOrder(true);
        }
      };
      getOrder();
      setLoading(false);
    }
  }, [session, status]);

  if (loading) {
    return <Loader />;
  }

  if (!loading) {
    return (
      <main className={isSmallDevice ? "page-small" : "page"}>
        {isSmallDevice === null ? (
          <Loader />
        ) : (
          <>
            <Navbar isSmallDevice={isSmallDevice} />

            {session && yourOrder && (
              <div
                className={
                  isSmallDevice ? "page-margin-small" : "page-margin w-full"
                }
              >
                <CheckoutSuccess orderBooks={orderBooks} />
              </div>
            )}
          </>
        )}
      </main>
    );
  }
};

export default Page;
