"use client";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";
import { Loader, Navbar, CheckoutSuccess } from "@/app/components";
import { useSession } from "next-auth/react";
import { ExtendedSession } from "@/types";
import { usePathname, useRouter } from "next/navigation";

const Page = () => {
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 700 });

  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);

  const isMediumDeviceQuery = useMediaQuery({ maxWidth: 900 });
  const [isMediumDevice, setIsMediumDevice] = useState<any>(null);

  const isMobileDeviceQuery = useMediaQuery({ maxWidth: 470 });
  const [isMobileDevice, setIsMobileDevice] = useState<any>(null);

  useEffect(() => {
    setIsSmallDevice(isSmallDeviceQuery);
    setIsMediumDevice(isMediumDeviceQuery);
    setIsMobileDevice(isMobileDeviceQuery);
  }, [isSmallDeviceQuery, isMediumDeviceQuery, isMobileDeviceQuery]);

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
    const orderId = currentPage.split("success/")[1];

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/order/${orderId}`);
        console.log(res.status);

        if (res.status === 404) {
          console.log(res.status);
          router.push("/not-found");
          return;
        }

        const data = await res.json();

        if (data.userId !== parseInt((session as ExtendedSession)?.user?.id)) {
          setError(true);
          router.push("/not-found");
          return;
        }

        setOrderBooks(data.books);
        setYourOrder(true);
      } catch (error) {
        setError(true);
        console.error("Failed to fetch order:", error);
        router.push("/not-found"); // Redirect to an error page if you prefer
      } finally {
        setLoading(false);
      }
    };
    if (session) {
      fetchOrder();
    }
  }, [session, status]);

  if (status === "loading") {
    return <Loader />;
  }
  if (!loading) {
    return (
      <main className={isSmallDevice ? "" : "page"}>
        {isSmallDevice === null ? (
          <Loader />
        ) : (
          <>
            <Navbar
              isSmallDevice={isSmallDevice}
              isMobileDevice={isMobileDevice}
            />

            {session && yourOrder && (
              <div className={isSmallDevice ? "-small" : " w-full"}>
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
