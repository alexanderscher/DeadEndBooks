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
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 800 });
  const { data: session, status } = useSession();
  const router = useRouter();
  const [yourOrder, setYourOrder] = useState<boolean | null>(null);
  const currentPage = usePathname();
  const [loading, setLoading] = useState<boolean>(true);
  // const [bookId, setBookId] = useState<string | null>(null);

  useEffect(() => {
    setIsSmallDevice(isSmallDeviceQuery);
  }, [isSmallDeviceQuery]);

  useEffect(() => {
    if (status !== "authenticated") return;

    if (session) {
      const orderId = currentPage.split("success/")[1];
      const getOrder = async () => {
        const res = await fetch(`/api/admin/order/${orderId}`);
        console.log(res.status);
        if (res.status === 404) {
          router.push("/not-found");
          return;
        }
        const data = await res.json();
        console.log(data);

        if (data.userId !== parseInt((session as ExtendedSession)?.user?.id)) {
          router.push("/not-found");
        } else {
          setYourOrder(true);
          // setBookId(data.bookId);
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
                <CheckoutSuccess />
              </div>
            )}
          </>
        )}
      </main>
    );
  }
};

export default Page;
