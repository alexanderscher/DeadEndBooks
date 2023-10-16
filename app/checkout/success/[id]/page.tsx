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
  const [error, setError] = useState(false);

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
    if (status !== "authenticated") {
      router.push("/not-found");
      return;
    }

    if (!session) {
      router.push("/not-found");
      return;
    }

    const orderId = currentPage.split("success/")[1];

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/order/${orderId}`);
        console.log(res.status);

        if (res.status === 404) {
          console.log(res.status); // Set error to true
          router.push("/not-found");
          return;
        }

        const data = await res.json();

        if (data.userId !== parseInt((session as ExtendedSession)?.user?.id)) {
          setError(true); // Set error to true
          router.push("/not-found");
          return;
        }

        setOrderBooks(data.books);
        setYourOrder(true);
      } catch (error) {
        setError(true); // Set error to true
        console.error("Failed to fetch order:", error);
        router.push("/not-found"); // Redirect to an error page if you prefer
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [session, status]);

  if (loading) {
    return <Loader />;
  }
  if (error) {
    return null; // or return an <ErrorComponent /> if you have one
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
