"use client";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Loader, Navbar } from "@/app/components";
import { useSession } from "next-auth/react";
import { ExtendedSession } from "@/types";

type Props = { isSmallDevice: boolean };
const Newsletter = ({ isSmallDevice }: Props) => {
  const { data: session } = useSession();
  const [newsletter, setNewsletter] = useState(true);
  const [reload, setReload] = useState(false);

  const cancel = async () => {
    const response = await fetch(`/api/user/newsletter`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newsletter: false,
        userId: (session as ExtendedSession)?.user?.id,
      }),
    });
    setReload(true);
  };

  const signup = async () => {
    const response = await fetch(`/api/user/newsletter`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newsletter: true,
        userId: (session as ExtendedSession)?.user?.id,
      }),
    });
    setReload(true);
  };

  useEffect(() => {
    setReload(false);
    const getUser = async () => {
      const res = await fetch(
        `/api/user/${(session as ExtendedSession)?.user?.id}`,
        { method: "PUT", next: { revalidate: 60 * 60 * 24 } }
      );
      const data = await res.json();
      setNewsletter(data.newsletter);
    };
    getUser();
  }, [session, reload]);

  return (
    <div className={isSmallDevice ? "mt-10" : ""}>
      {newsletter ? (
        <div className="flex">
          <div>
            <h1 className="text-[26px]">You are signed up for newsletters</h1>
            <button
              className="text-red-500 text-[26px] hover:line-through"
              onClick={cancel}
            >
              Cancel newsletter
            </button>
          </div>
        </div>
      ) : (
        <button
          className="text-red-500 text-[26px] hover:line-through"
          onClick={signup}
        >
          Sign up for newsletters
        </button>
      )}
    </div>
  );
};

const page = () => {
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 700 });

  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);

  const isMediumDeviceQuery = useMediaQuery({ maxWidth: 900 });
  const [isMediumDevice, setIsMediumDevice] = useState<any>(null);

  const isMobileDeviceQuery = useMediaQuery({ maxWidth: 460 });
  const [isMobileDevice, setIsMobileDevice] = useState<any>(null);

  const { data: session, status } = useSession();

  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    if (session) {
      setisLoading(false);
    }
  }, [session]);

  useEffect(() => {
    setIsSmallDevice(isSmallDeviceQuery);
    setIsMediumDevice(isMediumDeviceQuery);
    setIsMobileDevice(isMobileDeviceQuery);
  }, [isSmallDeviceQuery, isMediumDeviceQuery, isMobileDeviceQuery]);

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

          {isLoading && session !== null ? (
            <Loader />
          ) : (
            <div className={" w-full"}>
              <Newsletter isSmallDevice={isSmallDevice} />
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default page;
